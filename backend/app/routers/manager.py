import os
import uuid
import shutil
from pathlib import Path
from decimal import Decimal
from typing import Annotated, Optional
from fastapi import Depends, HTTPException, UploadFile, status, File, Form
from fastapi.routing import APIRouter
from fastapi.responses import JSONResponse
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.schemas.services import ServiceRead
from app.utils.database import get_db
from app.models.services import Services

router = APIRouter(prefix='/manager', tags=['Manager'])

@router.get('/services', response_model=list[ServiceRead])
def get_services(db: Session = Depends(get_db)):
    services_stmt = select(Services)
    services = db.execute(services_stmt).scalars().all()

    return services

@router.post('/services', status_code=status.HTTP_201_CREATED)
async def create_service(
    name: Annotated[str, Form()],
    price: Annotated[Decimal, Form()],
    description: Annotated[str, Form()] = None,
    upload_file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    temp_dir = Path('image/services')
    temp_dir.mkdir(parents=True, exist_ok=True)

    file_extension = Path(upload_file.filename).suffix
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = temp_dir / unique_filename

    try:
        with file_path.open('wb') as buffer:
            shutil.copyfileobj(upload_file.file, buffer)
    except Exception:
        raise HTTPException(status_code=500, detail="Помилка при збереженні файлу")

    image_url = f"/image/services/{unique_filename}"

    new_service = Services(
        name=name,
        description=description,
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
    upload_file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    #Шукаємо існуючу послугу в базі
    stmt = select(Services).where(Services.id == service_id)
    service = db.execute(stmt).scalars().first()

    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Послугу з ID {service_id} не знайдено"
        )

    #Обробка нового файлу (якщо він завантажений)
    if upload_file:
        if service.image_url:
            old_file_path = Path(service.image_url.lstrip('/'))
            if old_file_path.exists():
                os.remove(old_file_path)

        # Зберігаємо новий файл
        temp_dir = Path('static/services')
        temp_dir.mkdir(parents=True, exist_ok=True)
        
        file_extension = Path(upload_file.filename).suffix
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = temp_dir / unique_filename

        with file_path.open('wb') as buffer:
            shutil.copyfileobj(upload_file.file, buffer)
        
        service.image_url = f"/static/services/{unique_filename}"

    if name is not None:
        service.name = name
    if price is not None:
        service.price = price
    if description is not None:
        service.description = description

    db.commit()
    db.refresh(service)
    
    return service

@router.delete('/services/{service_id}')
async def delete_service(service_id: int, db: Session = Depends(get_db)):
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