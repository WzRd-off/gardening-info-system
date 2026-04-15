from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.utils.database import get_db
from app.utils.security import get_current_user
from app.models.orders import Orders
from app.models.orderstatus import OrderStatus
from app.models.users import Users
from app.models.services import Services
from app.schemas.orders import OrderCreate, OrderOut, OrderResponse

router = APIRouter(prefix="/orders", tags=["Orders"])

# Отримання всіх замовлень
@router.get("/", response_model=list[OrderResponse])
async def get_orders(db: Session = Depends(get_db)):
    return db.execute(
        select(Orders)
        .options(
            joinedload(Orders.user),
            joinedload(Orders.status),
            joinedload(Orders.plot),
            joinedload(Orders.service)
        )
    ).unique().scalars().all()

# Отримання замовлень поточного користувача
@router.get('/my_orders', response_model=list[OrderResponse])
async def get_my_orders(
    db: Session = Depends(get_db), 
    current_user: Users = Depends(get_current_user)
    ):
    return db.execute(
        select(Orders)
        .where(Orders.user_id == current_user.id)
        .options(
            joinedload(Orders.user),
            joinedload(Orders.status),
            joinedload(Orders.plot),
            joinedload(Orders.service)
        )
    ).unique().scalars().all()

# Отримання замовлень, які виконуються певною командою
@router.get('/teams/{team_id}', response_model=list[OrderResponse])
async def get_orders_by_team(
    team_id: int, 
    db: Session = Depends(get_db)
    ):
    return db.execute(
        select(Orders)
        .where(Orders.team_id == team_id)
        .options(
            joinedload(Orders.user),
            joinedload(Orders.status),
            joinedload(Orders.plot),
            joinedload(Orders.service)
        )
    ).unique().scalars().all()

# Отримання історії замовлень, які виконувала певна команда
@router.get('/history-completed/teams/{team_id}', response_model=list[OrderResponse])
async def get_completed_orders_by_team(
    team_id: int, 
    db: Session = Depends(get_db)
    ):
    return db.execute(
        select(Orders)
        .where(Orders.team_id == team_id, Orders.status_id == 3)
        .options(
            joinedload(Orders.user),
            joinedload(Orders.status),
            joinedload(Orders.plot),
            joinedload(Orders.service)
        )
    ).unique().scalars().all()

# Cтворення нового замовлення
@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_order(
    order: OrderCreate, 
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user)
    ):
    service = db.execute(select(Services).where(Services.id == order.service_id)).scalar_one_or_none()
    if not service:
        raise HTTPException(status_code=404, detail=f"Послугу з ID {order.service_id} не знайдено")
    
    new_order = Orders(
        comment=order.comment,
        plot_id=order.plot_id,
        service_id=order.service_id,
        user_id=current_user.id,
        status_id=1, # 'отримано'
        execution_date=order.execution_date,
        regularity=order.regularity,
        total_price=order.total_price 
    )

    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    return {'id': new_order.id, 'status': 'success', 'message': 'Замовлення створено'}

# Оновлення замовлення (для менеджера)
@router.put('/update_order/{order_id}')
async def update_order(
    order_id: int, 
    order: OrderCreate, 
    db: Session = Depends(get_db)
    ):
    existing_order = db.execute(select(Orders).where(Orders.id == order_id)).scalar_one_or_none()
    if not existing_order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Замовлення не знайдено")

    service = db.execute(select(Services).where(Services.id == order.service_id)).scalar_one_or_none()
    if not service:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Послугу не знайдено")

    existing_order.comment = order.comment
    existing_order.plot_id = order.plot_id
    existing_order.service_id = order.service_id

    db.commit()
    return JSONResponse(status_code=status.HTTP_200_OK, content={'status': 'success', 'message': 'Замовлення оновлено'})

# Вибір команди для замовлення та оновлення статусу замовлення (для менеджера)
@router.patch('/choose_team/{team_id}')
async def choose_team_for_order(
    order_id: int, 
    team_id: int, 
    db: Session = Depends(get_db)
    ):
    existing_order = db.execute(select(Orders).where(Orders.id == order_id)).scalar_one_or_none()
    if not existing_order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Замовлення не знайдено")

    existing_order.team_id = team_id
    existing_order.status_id = 2 # 'в роботі' или 'в дорозі'
    db.commit()
    return JSONResponse(status_code=status.HTTP_200_OK, content={'status': 'success', 'message': 'Команда призначена'})

# Оновлення статусу замовлення (для команди)
@router.patch('/status/{order_id}')
async def update_order_status(
    order_id: int, 
    status_id: int, 
    db: Session = Depends(get_db)
    ):
    existing_order = db.execute(select(Orders).where(Orders.id == order_id)).scalar_one_or_none()
    if not existing_order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Замовлення не знайдено")

    existing_order.status_id = status_id
    db.commit()
    return JSONResponse(status_code=status.HTTP_200_OK, content={'status': 'success', 'message': 'Статус оновлено'})

# Отримання статусу виконання замовлення поточного користувача
@router.get('/order_status/{order_id}')
async def get_order_status(
    order_id: int, 
    db: Session = Depends(get_db), 
    current_user: Users = Depends(get_current_user)
    ):
    existing_order = db.execute(select(Orders).where(Orders.id == order_id, Orders.user_id == current_user.id)).scalar_one_or_none()
    
    if not existing_order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Замовлення не знайдено")
    
    order_status = db.execute(select(OrderStatus).where(OrderStatus.id == existing_order.status_id)).scalar_one_or_none()
    return JSONResponse(status_code=status.HTTP_200_OK, content={'status': 'success', 'order_status_name': order_status.name})