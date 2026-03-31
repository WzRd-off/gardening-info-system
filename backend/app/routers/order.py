from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.utils.database import get_db
from app.utils.security import get_current_user
from app.models.orders import Orders
from app.models.orderstatus import OrderStatus
from app.models.users import Users
from app.models.services import Services
from app.schemas.orders import OrderCreate, OrderRead

router = APIRouter(prefix="/orders", tags=["Orders"])

# Отримання всіх замовлень (для менеджера)

@router.get("/", response_model=list[OrderRead])
async def get_orders(db: Session = Depends(get_db)):
    orders_stmt = select(Orders)
    orders = db.execute(orders_stmt).scalars().all()

    return orders

# Отримання замовлень поточного користувача

@router.get('/my_orders', response_model=list[OrderRead])
async def get_my_orders(db: Session = Depends(get_db), current_user: Users = Depends(get_current_user)):
    orders_stmt = select(Orders).where(Orders.user_id == current_user.id)
    orders = db.execute(orders_stmt).scalars().all()

    return orders

# Отримання замовлень, які виконуються певною командою

@router.get('/teams/{team_id}', response_model=list[OrderRead])
async def get_orders_by_team(team_id: int, db: Session = Depends(get_db)):
    orders_stmt = select(Orders).where(Orders.team_id == team_id)
    orders = db.execute(orders_stmt).scalars().all()

    return orders

# Отримання історії замовлень, які виконувала певна команда

@router.get('/history-completed/teams/{team_id}', response_model=list[OrderRead])
async def get_completed_orders_by_team(team_id: int, db: Session = Depends(get_db)):
    orders_stmt = select(Orders).where(Orders.team_id == team_id, Orders.status_id == 3)
    orders = db.execute(orders_stmt).scalars().all()

    return orders

# Cтворення нового замовлення

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_order(order: OrderCreate, 
                       db: Session = Depends(get_db),
                       current_user: Users = Depends(get_current_user)):
    service_stmt = select(Services).where(Services.id == order.service_id)
    service = db.execute(service_stmt).scalar_one_or_none()

    if not service:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                            detail=f"Послугу з ID {order.service_id} не знайдено")

    new_order = Orders(
        execution_date=order.execution_date,
        regularity=order.regularity,
        comment=order.comment,
        plot_id=order.plot_id,
        service_id=order.service_id,
        total_price=service.price,
        user_id=current_user.id,
        status_id=1
    )

    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    return JSONResponse(status_code=status.HTTP_201_CREATED, content={
        'status': 'success', 'message': 'Замовлення успішно створено'
    })

# Оновлення замовлення (для менеджера)

@router.put('/update_order/{order_id}')
async def update_order(order_id: int, order: OrderCreate, db: Session = Depends(get_db)):
    order_stmt = select(Orders).where(Orders.id == order_id)
    existing_order = db.execute(order_stmt).scalar_one_or_none()

    if not existing_order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                            detail=f"Замовлення з ID {order_id} не знайдено")

    service_stmt = select(Services).where(Services.id == order.service_id)
    service = db.execute(service_stmt).scalar_one_or_none()

    if not service:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                            detail=f"Послугу з ID {order.service_id} не знайдено")

    existing_order.execution_date = order.execution_date
    existing_order.regularity = order.regularity
    existing_order.comment = order.comment
    existing_order.plot_id = order.plot_id
    existing_order.service_id = order.service_id
    existing_order.total_price = service.price

    db.commit()
    db.refresh(existing_order)

    return JSONResponse(status_code=status.HTTP_200_OK, content={
        'status': 'success', 'message': 'Замовлення успішно оновлено'
    })

# Вибір команди для замовлення та оновлення статусу замовлення (для менеджера)

@router.patch('/choose_team/{team_id}')
async def choose_team_for_order(order_id: int, team_id: int, db: Session = Depends(get_db)):
    order_stmt = select(Orders).where(Orders.id == order_id)
    existing_order = db.execute(order_stmt).scalar_one_or_none()

    if not existing_order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                            detail=f"Замовлення з ID {order_id} не знайдено")

    existing_order.team_id = team_id
    existing_order.status_id = 2

    db.commit()
    db.refresh(existing_order)

    return JSONResponse(status_code=status.HTTP_200_OK, content={
        'status': 'success', 'message': 'Команда успішно вибрана для замовлення'
    })

# Оновлення статусу замовлення (для команди)

@router.patch('/status/{order_id}')
async def update_order_status(order_id: int, status_id: int, db: Session = Depends(get_db)):
    order_stmt = select(Orders).where(Orders.id == order_id)
    existing_order = db.execute(order_stmt).scalar_one_or_none()

    if not existing_order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                            detail=f"Замовлення з ID {order_id} не знайдено")

    existing_order.status_id = status_id

    db.commit()
    db.refresh(existing_order)

    return JSONResponse(status_code=status.HTTP_200_OK, content={
        'status': 'success', 'message': 'Статус замовлення успішно оновлено'
    })

# Отримання статусу виконання замовлення поточного користувача

@router.get('/order_status/{order_id}')
async def get_order_status(order_id: int, 
                           db: Session = Depends(get_db),
                           current_user: Users = Depends(get_current_user)
):
    
    order_stmt = select(Orders).where(Orders.id == order_id and Orders.user_id == current_user.id)
    existing_order = db.execute(order_stmt).scalar_one_or_none()

    if not existing_order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                            detail=f"Замовлення з ID {order_id} не знайдено у вашому профілі")
    
    status_stmt = select(OrderStatus).where(OrderStatus.id == existing_order.status_id)
    order_status = db.execute(status_stmt).scalar_one_or_none()

    return JSONResponse(status_code=status.HTTP_200_OK, content={
        'status': 'success', 'order_status_name': order_status.name
    })