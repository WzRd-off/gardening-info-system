from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy import select
from sqlalchemy.orm import Session
from passlib.hash import bcrypt

from app.utils.database import get_db
from app.utils.security import get_current_user
from app.schemas.users import UserRead, UserUpdate, PasswordUpdate
from app.schemas.gardenplots import GardenPlotCreate, GardenPlotRead
from app.schemas.orders import OrderRead
from app.schemas.plants import PlantCreate, PlantOut
from app.models.users import Users
from app.models.gardenplots import GardenPlots
from app.models.orders import Orders
from app.models.plants import Plants
router = APIRouter(prefix="/profile", tags=["Profile"])

# Отримання профілю поточного користувача

@router.get("/my_profile", response_model=UserRead)
async def get_profile(сurrent_user = Depends(get_current_user)):
    return сurrent_user

# Оновлення профілю поточного користувача

@router.put("/update_profile")
async def update_profile(profile_data: UserUpdate,
                         db: Session = Depends(get_db), 
                         current_user = Depends(get_current_user)):
    
    if profile_data.email and profile_data.email != current_user.email:
        stmt = select(Users).where(Users.email == profile_data.email and Users.id != current_user.id)
        existing_user = db.execute(stmt).scalars().first()

        if existing_user:
            raise HTTPException(
                status_code=409,
                detail="Користувач з такою поштою вже існує"
            )
    
    current_user.username = profile_data.get("username", current_user.username)
    current_user.email = profile_data.get("email", current_user.email)
    current_user.phone = profile_data.get("phone", current_user.phone)

    db.commit()
    db.refresh(current_user)

    return JSONResponse(status_code=200, content={
        "status": "success",
        "message": "Профіль успішно оновлено"
    })

# Оновлення пароля поточного користувача

@router.put("/change-password")
async def change_password(
    pass_data: PasswordUpdate, 
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user)
):
    if not bcrypt.verify(pass_data.old_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Старий пароль введений невірно"
        )

    hashed_password = bcrypt.hash(pass_data.new_password)
    
    current_user.password_hash = hashed_password
    
    db.commit()
    db.refresh(current_user)

    return {"status": "success", "message": "Пароль успішно змінено"}

# Додавання ділянок до профілю користувача

@router.post('/add_plot')
async def add_plot(plot_data: GardenPlotCreate, 
                   db: Session = Depends(get_db),
                   current_user: Users = Depends(get_current_user)
):
    
    stmt = select(GardenPlots).where(GardenPlots.address == plot_data.address and GardenPlots.user_id == current_user.id)
    existing_plot = db.execute(stmt).scalars().first()

    if existing_plot:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                            detail="Ділянка з такою адресою вже існує у вашому профілі"
                            )

    new_plot = GardenPlots(
        address=plot_data.address,
        area=plot_data.area,
        features=plot_data.features,
        user_id=current_user.id
        )
    
    db.add(new_plot)
    db.commit()
    db.refresh(new_plot)

    return JSONResponse(status_code=201, content={
        'status': 'success',
        'message': 'Ділянка успішно додана до профілю'
    })
    
# Отримання ділянок поточного користувача

@router.get('/my_plots', response_model=list[GardenPlotRead])
async def get_my_plots(db: Session = Depends(get_db), 
                       current_user: Users = Depends(get_current_user)):
    stmt = select(GardenPlots).where(GardenPlots.user_id == current_user.id)
    return db.execute(stmt).scalars().all()

# Редагування ділянок

@router.put('/edit_plot/{plot_id}')
async def edit_plot(plot_id: int, 
                    plot_data: GardenPlotCreate, 
                    db: Session = Depends(get_db), 
                    current_user: Users = Depends(get_current_user)):
    
    stmt = select(GardenPlots).where(GardenPlots.id == plot_id and GardenPlots.user_id == current_user.id)
    plot = db.execute(stmt).scalars().first()

    if not plot:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Ділянка не знайдена у вашому профілі"
                            )

    plot.address = plot_data.address
    plot.area = plot_data.area
    plot.features = plot_data.features

    db.commit()
    db.refresh(plot)

    return JSONResponse(status_code=200, content={
        'status': 'success',
        'message': 'Ділянка успішно оновлена'
    })

# Видалення ділянок

@router.delete('/delete_plot/{plot_id}')
async def delete_plot(plot_id: int, 
                      db: Session = Depends(get_db),
                      current_user: Users = Depends(get_current_user)
):
    stmt = select(GardenPlots).where(GardenPlots.id == plot_id and GardenPlots.user_id == current_user.id)
    plot = db.execute(stmt).scalars().first()

    if not plot:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Ділянка не знайдена у вашому профілі"
                            )

    db.delete(plot)
    db.commit()

    return JSONResponse(status_code=200, content={
        'status': 'success',
        'message': 'Ділянка успішно видалена з профілю'
    })

# Отримання історії обслуговування ділянок поточного користувача

@router.get('/plots_history', response_model=list[OrderRead])
async def get_plots_history(db: Session = Depends(get_db), 
                            current_user: Users = Depends(get_current_user)):
    stmt = select(Orders).where(Orders.user_id == current_user.id and (Orders.status_id == 4 or Orders.status_id == 5))
    return db.execute(stmt).scalars().all()

@router.post("/my_plots/{plot_id}/plants", response_model=PlantOut, status_code=status.HTTP_201_CREATED)
def add_plant_to_plot(plot_id: int, plant: PlantCreate, db: Session = Depends(get_db), current_user: Users = Depends(get_current_user)):
    """
    Додавання рослини на конкретну ділянку клієнта.
    Перевіряє, чи існує ділянка і чи належить вона саме цьому авторизованому клієнту.
    """
    # Перевірка безпеки: шукаємо ділянку, яка належить поточному користувачу
    plot = db.query(GardenPlots).filter(GardenPlots.id == plot_id, GardenPlots.user_id == current_user.id).first()
    if not plot:
        raise HTTPException(status_code=404, detail="Ділянку не знайдено або у вас немає до неї доступу")
    
    new_plant = Plants(
        name=plant.name,
        description=plant.description,
        plot_id=plot_id
    )
    db.add(new_plant)
    db.commit()
    db.refresh(new_plant)
    return new_plant

@router.get("/my_plots/{plot_id}/plants", response_model=list[PlantOut])
def get_plants_on_plot(plot_id: int, db: Session = Depends(get_db), current_user: Users = Depends(get_current_user)):
    """
    Отримання списку всіх рослин на конкретній ділянці клієнта.
    """
    plot = db.query(GardenPlots).filter(GardenPlots.id == plot_id, GardenPlots.user_id == current_user.id).first()
    if not plot:
        raise HTTPException(status_code=404, detail="Ділянку не знайдено або у вас немає до неї доступу")
        
    plants = db.query(Plants).filter(Plants.plot_id == plot_id).all()
    return plants

@router.delete("/my_plots/{plot_id}/plants/{plant_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_plant_from_plot(plot_id: int, plant_id: int, db: Session = Depends(get_db), current_user: Users = Depends(get_current_user)):
    """
    Видалення рослини з ділянки.
    """
    plot = db.query(GardenPlots).filter(GardenPlots.id == plot_id, GardenPlots.user_id == current_user.id).first()
    if not plot:
        raise HTTPException(status_code=404, detail="Ділянку не знайдено або у вас немає до неї доступу")
        
    plant = db.query(Plants).filter(Plants.id == plant_id, Plants.plot_id == plot_id).first()
    if not plant:
        raise HTTPException(status_code=404, detail="Рослину не знайдено на цій ділянці")
        
    db.delete(plant)
    db.commit()
    return JSONResponse(status_code=204, content={
        'status': 'success', 'message': 'Рослина успішно видалена з ділянки'
    })