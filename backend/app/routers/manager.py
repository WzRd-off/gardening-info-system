from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from sqlalchemy import select
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from sqlalchemy import select, cast, Date
from typing import List, Optional, Annotated
from decimal import Decimal
from pathlib import Path
from datetime import date
import uuid
import shutil
import os

from app.utils.database import get_db
from app.utils.security import get_current_manager, get_current_user

from app.models.users import Users
from app.models.orders import Orders
from app.models.services import Services
from app.models.schedules import Schedules 

from app.schemas.orders import OrderUpdate, OrderOut
from app.schemas.services import ServiceRead 
from app.schemas.schedules import ScheduleCreate, ScheduleOut
        

router = APIRouter(
    prefix="/manager",
    tags=["Manager"]
)

@router.get('/services', response_model=list[ServiceRead])
def get_services(
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user)
    ):
    """
    Отримання списку всіх доступних послуг.
    """
    services_stmt = select(Services)
    services = db.execute(services_stmt).scalars().all()

    return services

@router.post('/services', status_code=status.HTTP_201_CREATED)
async def create_service(
    name: Annotated[str, Form()],
    price: Annotated[Decimal, Form()],
    description: Annotated[str, Form()] = None,
    category: Annotated[str, Form()] = None,
    upload_file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_manager: Users = Depends(get_current_manager)
):
    """
    Створення нової послуги.
    Приймає текстові дані через форму (назва, ціна, опис) та файл зображення.
    Зберігає зображення локально на сервері та записує шлях у базу даних.
    """
    temp_dir = Path('images/services')
    temp_dir.mkdir(parents=True, exist_ok=True)

    file_extension = Path(upload_file.filename).suffix
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = temp_dir / unique_filename

    try:
        with file_path.open('wb') as buffer:
            shutil.copyfileobj(upload_file.file, buffer)
    except Exception:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Помилка при збереженні файлу")

    image_url = f"/images/services/{unique_filename}"

    new_service = Services(
        name=name,
        description=description,
        category=category,
        price=price,
        image_url=image_url
    )
    
    db.add(new_service)
    db.commit()
    db.refresh(new_service)
    
    return JSONResponse(status_code=status.HTTP_201_CREATED, content={
        'status': 'success', 'message': 'Сервіс успішно створено'
    })

@router.put('/services/{service_id}')
async def update_service(
    service_id: int,
    name: Annotated[Optional[str], Form()] = None,
    price: Annotated[Optional[Decimal], Form()] = None,
    description: Annotated[Optional[str], Form()] = None,
    category: Annotated[Optional[str], Form()] = None, 
    upload_file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_manager: Users = Depends(get_current_manager)
):
    """
    Оновлення існуючої послуги.
    Менеджер може частково змінити інформацію (наприклад, тільки ціну).
    Якщо передається новий файл зображення, старий файл автоматично видаляється з сервера.
    """
    # Шукаємо існуючу послугу в базі
    stmt = select(Services).where(Services.id == service_id)
    service = db.execute(stmt).scalars().first()

    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Послугу з ID {service_id} не знайдено"
        )

    # Обробка нового файлу (якщо він завантажений)
    if upload_file:
        if service.image_url:
            old_file_path = Path(service.image_url.lstrip('/'))
            if old_file_path.exists():
                os.remove(old_file_path)

        # Зберігаємо новий файл
        temp_dir = Path('images/services')
        temp_dir.mkdir(parents=True, exist_ok=True)
        
        file_extension = Path(upload_file.filename).suffix
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = temp_dir / unique_filename

        with file_path.open('wb') as buffer:
            shutil.copyfileobj(upload_file.file, buffer)
        
        service.image_url = f"/images/services/{unique_filename}"

    if name is not None:
        service.name = name
    if price is not None:
        service.price = price
    if description is not None:
        service.description = description
    if category is not None:
        service.category = category

    db.commit()
    db.refresh(service)
    
    return service

@router.delete('/services/{service_id}')
async def delete_service(
    service_id: int,
    db: Session = Depends(get_db),
    current_manager: Users = Depends(get_current_manager)
    ):
    """
    Видалення послуги.
    Видаляє запис з бази даних, а також фізично видаляє файл зображення з сервера,
    щоб не засмічувати дисковий простір.
    """
    stmt = select(Services).where(Services.id == service_id)
    service = db.execute(stmt).scalars().first()

    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Послугу з ID {service_id} не знайдено"
        )

    if service.image_url:
        file_path = Path(service.image_url.lstrip('/'))
        if file_path.exists():
            os.remove(file_path)

    db.delete(service)
    db.commit()
    
    return JSONResponse(status_code=status.HTTP_200_OK, content={
        'status': 'success', 'message': 'Сервіс успішно видалено'
    })

@router.get("/orders", response_model=List[OrderOut])
def get_all_orders(
    db: Session = Depends(get_db),
    current_manager: Users = Depends(get_current_manager)
    ):
    """
    Перегляд усіх замовлень у системі.
    Використовується менеджером для контролю ефективності та відстеження нових заявок.
    """
    orders = db.query(Orders).all()
    return orders

@router.patch("/orders/{order_id}")
def update_order_by_manager(
    order_id: int, 
    order_update: OrderUpdate, 
    db: Session = Depends(get_db),
    current_manager: Users = Depends(get_current_manager)
    ):
    """
    Управління замовленням менеджером.
    Дозволяє менеджеру:
    - Призначити бригаду виконавців (team_id) на замовлення.
    - Додати спеціальні інструкції для бригади (manager_instructions).
    """
    order = db.query(Orders).filter(Orders.id == order_id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Замовлення не знайдено")
    
    if order_update.team_id is not None:
        order.team_id = order_update.team_id
    if order_update.manager_instructions is not None:
        order.manager_instructions = order_update.manager_instructions
        
    db.commit()
    db.refresh(order)
    return JSONResponse(status_code=status.HTTP_200_OK, content={
        'status': 'success', 'message': 'Замовлення успішно оновлено'
    })

@router.post("/schedules", status_code=status.HTTP_201_CREATED)
def manage_schedule(
    schedule_data: ScheduleCreate, 
    db: Session = Depends(get_db),
    current_manager: Users = Depends(get_current_manager)
    ):
    """
    Додавання замовлення в розклад АБО перенесення дати (якщо розклад вже існує).
    """
    existing_schedule = db.query(Schedules).filter(Schedules.order_id == schedule_data.order_id).first()
    
    if existing_schedule:
        # Перенесення дати
        existing_schedule.scheduled_time = schedule_data.scheduled_time
        message = "Дату виконання замовлення успішно перенесено."
    else:
        # Створення нового запису в календарі
        new_schedule = Schedules(
            order_id=schedule_data.order_id, 
            scheduled_time=schedule_data.scheduled_time
        )
        db.add(new_schedule)
        message = "Замовлення успішно додано до розкладу."
        
    db.commit()
    return {"status": "success", "message": message}

@router.get("/schedules", response_model=List[ScheduleOut])
def get_schedules_for_calendar(
    db: Session = Depends(get_db),
    current_manager: Users = Depends(get_current_manager)
    ):
    """
    Отримання всіх розкладів для відображення календаря на фронтенді.
    """
    schedules = db.query(Schedules).all()
    return schedules

@router.get("/teams/{team_id}/workload")
def get_team_workload(
    team_id: int, 
    target_date: date, 
    db: Session = Depends(get_db),
    current_manager: Users = Depends(get_current_manager)
    ):
    """
    Розрахунок завантаженості бригади на конкретний день.
    Повертає відсоток завантаженості. 
    Припустимо, що ідеальне завантаження (100%) - це N замовлення на день.
    """
    # Шукаємо кількість замовлень для бригади на вказану дату
    # Зв'язуємо таблицю Orders та Schedules
    orders_count = db.query(Schedules).join(Orders).filter(
        Orders.team_id == team_id,
        cast(Schedules.scheduled_time, Date) == target_date
    ).count()
    
    MAX_ORDERS_PER_DAY = 3
    workload_percentage = min((orders_count / MAX_ORDERS_PER_DAY) * 100, 100)
    
    return {
        "team_id": team_id,
        "date": target_date,
        "assigned_orders": orders_count,
        "workload_percentage": round(workload_percentage, 1),
        "is_overloaded": orders_count >= MAX_ORDERS_PER_DAY
    }

@router.patch("/users/{user_id}/assign-team")
def assign_user_to_team(
    user_id: int, 
    team_id: int, 
    db: Session = Depends(get_db),
    current_manager: Users = Depends(get_current_manager)
    ):
    """
    Формування бригади. 
    Додає робітника (користувача) до вказаної бригади.
    """
    user = db.query(Users).filter(Users.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Користувача не знайдено")
        
    user.team_id = team_id
    db.commit()
    
    return {"status": "success", "message": f"Користувача успішно додано до бригади {team_id}"}