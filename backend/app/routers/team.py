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
router = APIRouter(
    prefix="/teams",
    tags=["Teams Management"]
)

@router.post("/")
def create_team(team_data: TeamCreate, db: Session = Depends(get_db)):
    stmt = select(Teams).where(Teams.name == team_data.name)
    existing_team = db.execute(stmt).scalar_one_or_none()

    if existing_team:
        raise HTTPException(status_code=400, detail="Команда з такою назвою вже існує")

    new_team = Teams(
        name=team_data.name,
        efficiency_rating=team_data.efficiency_rating,
        leader_id=team_data.leader_id
    )
    db.add(new_team)
    db.commit()
    db.refresh(new_team)
    return JSONResponse(status_code=201, content={
        'status': 'success', 'message': 'Команда успішно створена'
        })

@router.get("/", response_model=list[TeamRead])
def get_all_teams(db: Session = Depends(get_db)):
    return db.execute(select(Teams)).scalars().all()

@router.get("/orders", response_model=List[OrderOut])
def get_team_orders(db: Session = Depends(get_db), current_user: Users = Depends(get_current_team)):
    """
    Перегляд призначених замовлень (п. 4.1 ТЗ).
    Бригада бачить тільки ті замовлення, які призначені саме їй.
    """
    if not current_user.team_id:
        return [] # Якщо робітника ще не додали до жодної бригади
        
    orders = db.query(Orders).filter(Orders.team_id == current_user.team_id).all()
    return orders


@router.patch("/orders/{order_id}/status", response_model=OrderOut)
def update_order_status(order_id: int, status_id: int, db: Session = Depends(get_db), current_user: Users = Depends(get_current_team)):
    """
    Управління статусами робіт.
    Бригада може змінювати статус. Якщо статус = "виконано" (наприклад, ID = 4),
    система автоматично створює запис у таблиці Payments (нараховує гроші).
    """
    if not current_user.team_id:
        raise HTTPException(status_code=403, detail="Ви не належите до жодної бригади")

    order = db.query(Orders).filter(Orders.id == order_id, Orders.team_id == current_user.team_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Замовлення не знайдено або воно не належить вашій бригаді")

    # Оновлюємо статус
    order.status_id = status_id

    # Якщо статус "виконано" (припустимо, що в базі status_id = 4 відповідає "виконано")
    # Перевіряємо, чи ще немає платежу по цьому замовленню, щоб не нарахувати двічі
    if status_id == 4:
        existing_payment = db.query(Payments).filter(Payments.order_id == order.id).first()
        if not existing_payment:
            # Отримуємо ціну послуги
            service = db.query(Services).filter(Services.id == order.service_id).first()
            if service:
                # Створюємо платіж
                new_payment = Payments(
                    order_id=order.id,
                    amount=service.price,
                    payment_status="Оплачено" # або "Очікує виплати", залежить від вашої бізнес-логіки
                )
                db.add(new_payment)

    db.commit()
    db.refresh(order)
    return order


@router.get("/finance")
def get_team_finance(db: Session = Depends(get_db), current_user: Users = Depends(get_current_team)):
    """
    Фінансова інформація (п. 4.3 ТЗ).
    Бригада може переглядати суму нарахувань, статистику та історію.
    """
    if not current_user.team_id:
        raise HTTPException(status_code=403, detail="Ви не належите до жодної бригади")

    # Шукаємо всі платежі за замовленнями, які виконала ця бригада
    payments_query = db.query(Payments).join(Orders).filter(Orders.team_id == current_user.team_id)
    
    # Історія платежів
    history = payments_query.all()
    
    # Загальна сума нарахувань
    total_amount = db.query(func.sum(Payments.amount)).join(Orders).filter(Orders.team_id == current_user.team_id).scalar() or 0.0
    
    # Статистика: загальна кількість виконаних замовлень
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
                "status": p.payment_status,
                "date": p.created_at
            } for p in history
        ]
    }