import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from alembic import context

from app.database import Base
from app.models.gardenplots import GardenPlots
from app.models.orders import Orders
from app.models.orderstatus import OrderStatus
from app.models.payments import Payments
from app.models.plants import Plants
from app.models.roles import Roles
from app.models.schedules import Schedules
from app.models.services import Services
from app.models.teams import Teams
from backend.app.models.users import Users

load_dotenv()

target_metadata = Base.metadata

def get_url():
    return os.getenv("DATABASE_URL")

def run_migrations_online() -> None:
    connectable = create_engine(get_url()) 
    with connectable.connect() as connection:
        context.configure(
            connection=connection, 
            target_metadata=target_metadata
        )
        with context.begin_transaction():
            context.run_migrations()