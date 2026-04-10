from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from sqlalchemy import select, func
from typing import List

from app.utils.database import get_db
from app.utils.security import get_current_team

from app.models.users import Users
from app.models.orders import Orders
from app.models.payments import Payments
from app.models.services import Services
from app.models.teams import Teams

from app.schemas.orders import OrderOut
from app.schemas.payments import PaymentOut
from app.schemas.teams import TeamCreate, TeamRead

# Цей роутер обробляє всі запити, які стосуються роботи бригад, а також управління самими бригадами.
# Захист конкретних роутів бригади (orders, finance) прописаний у них всередині через current_user.
router = APIRouter(prefix="/teams", tags=["Teams Management"])

# Створення нової бригади
@router.post("/")
def create_team(team_data: TeamCreate, db: Session = Depends(get_db)):
    existing_team = db.execute(select(Teams).where(Teams.name == team_data.name)).scalar_one_or_none()
    if existing_team:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Команда з такою назвою вже існує")

    leader = db.query(Users).filter(Users.email == team_data.email).first()
    if not leader:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Лідер бригади не знайдений")

    new_team = Teams(name=team_data.name, leader_id=leader.id)
    db.add(new_team)
    db.commit()
    db.refresh(new_team)
    leader.team_id = new_team.id
    leader.role_id = 3 
    db.commit()
    db.refresh(leader)
    return JSONResponse(status_code=status.HTTP_201_CREATED, content={'status': 'success', 'message': 'Команда створена'})

@router.get("/", response_model=list[TeamRead])
def get_all_teams(db: Session = Depends(get_db)):
    return db.execute(select(Teams)).scalars().all()

@router.get("/orders", response_model=List[OrderOut])
def get_team_orders(db: Session = Depends(get_db), current_user: Users = Depends(get_current_team)):
    if not current_user.team_id:
        return []
    return db.query(Orders).filter(Orders.team_id == current_user.team_id).all()

@router.patch("/orders/{order_id}/status", response_model=OrderOut)
def update_order_status(order_id: int, status_id: int, db: Session = Depends(get_db), current_user: Users = Depends(get_current_team)):
    if not current_user.team_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Ви не належите до бригади")

    order = db.query(Orders).filter(Orders.id == order_id, Orders.team_id == current_user.team_id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Замовлення не знайдено")

    order.status_id = status_id

    if status_id == 4:
        existing_payment = db.query(Payments).filter(Payments.order_id == order.id).first()
        if not existing_payment:
            service = db.query(Services).filter(Services.id == order.service_id).first()
            if service:
                new_payment = Payments(
                    order_id=order.id,
                    amount=service.price
                )
                db.add(new_payment)

    db.commit()
    db.refresh(order)
    return order

@router.get("/finance")
def get_team_finance(db: Session = Depends(get_db), current_user: Users = Depends(get_current_team)):
    if not current_user.team_id:
        raise HTTPException(status_code=403, detail="Ви не належите до бригади")

    payments_query = db.query(Payments).join(Orders).filter(Orders.team_id == current_user.team_id)
    history = payments_query.all()
    
    total_amount = db.query(func.sum(Payments.amount)).join(Orders).filter(Orders.team_id == current_user.team_id).scalar() or 0.0
    completed_orders_count = db.query(Orders).filter(Orders.team_id == current_user.team_id, Orders.status_id == 4).count()

    return {
        "team_id": current_user.team_id,
        "total_earned": float(total_amount),
        "completed_orders_count": completed_orders_count,
        "history": [
            {
                "payment_id": p.id,
                "order_id": p.order_id,
                "amount": float(p.amount),
                "date": p.payment_date
            } for p in history
        ]
    }