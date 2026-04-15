from fastapi import APIRouter, Depends, HTTPException, status, Body
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select, func
from typing import List

from app.utils.database import get_db
from app.utils.security import get_current_team

from app.models.users import Users
from app.models.orders import Orders
from app.models.payments import Payments
from app.models.services import Services
from app.models.teams import Teams

from app.schemas.orders import OrderOut, OrderResponse
from app.schemas.payments import PaymentOut
from app.schemas.teams import TeamCreate, TeamRead

# Цей роутер обробляє всі запити, які стосуються роботи бригад, а також управління самими бригадами.
# Захист конкретних роутів бригади (orders, finance) прописаний у них всередині через current_user.
router = APIRouter(
    prefix="/teams",
    tags=["Teams Management"])

# Створення нової бригади
@router.post("/")
def create_team(team_data: TeamCreate, db: Session = Depends(get_db)):
    existing_team = db.execute(select(Teams).where(Teams.name == team_data.name)).scalar_one_or_none()
    if existing_team:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Команда з такою назвою вже існує")

    stmt_leader = select(Users).where(Users.email == team_data.email)
    leader = db.execute(stmt_leader).scalars().first()
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

@router.get("/orders", response_model=List[OrderResponse])
def get_team_orders(db: Session = Depends(get_db), current_user: Users = Depends(get_current_team)):
    if not current_user.team_id:
        return []
    return db.execute(
        select(Orders)
        .where(Orders.team_id == current_user.team_id)
        .options(
            joinedload(Orders.user),
            joinedload(Orders.status),
            joinedload(Orders.plot),
            joinedload(Orders.service)
        )
    ).unique().scalars().all()

@router.patch("/orders/{order_id}/status", response_model=OrderOut)
def update_order_status(
    order_id: int, 
    status_id: int = Body(..., embed=True),
    db: Session = Depends(get_db), 
    current_user: Users = Depends(get_current_team)
    ):
    if not current_user.team_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Ви не належите до бригади")

    stmt_order = select(Orders).where(Orders.id == order_id, Orders.team_id == current_user.team_id)
    order = db.execute(stmt_order).scalars().first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Замовлення не знайдено")

    order.status_id = status_id

    if status_id == 4:
        stmt_payment = select(Payments).where(Payments.order_id == order.id)
        existing_payment = db.execute(stmt_payment).scalars().first()
        if order.total_price:
            if existing_payment:
                existing_payment.amount = order.total_price
            else:
                new_payment = Payments(
                    order_id=order.id,
                    amount=order.total_price,
                    team_id=order.team_id
                )
                db.add(new_payment)

    db.commit()
    db.refresh(order)
    return order

@router.get("/finance")
def get_team_finance(db: Session = Depends(get_db), current_user: Users = Depends(get_current_team)):
    if not current_user.team_id:
        raise HTTPException(status_code=403, detail="Ви не належите до бригади")

    stmt_payments = select(Payments).where(Payments.team_id == current_user.team_id)
    history = db.execute(stmt_payments).scalars().all()
    
    stmt_total = select(func.sum(Payments.amount)).where(Payments.team_id == current_user.team_id)
    total_amount = db.execute(stmt_total).scalar() or 0.0
    
    stmt_count = select(func.count()).select_from(Orders).where(Orders.team_id == current_user.team_id, Orders.status_id == 4)
    completed_orders_count = db.execute(stmt_count).scalar()

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