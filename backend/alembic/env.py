import os
from logging.config import fileConfig
from dotenv import load_dotenv
from sqlalchemy import engine_from_config
from sqlalchemy import pool
from alembic import context

from app.utils.database import Base
from app.models.gardenplots import GardenPlots
from app.models.orders import Orders
from app.models.orderstatus import OrderStatus
from app.models.payments import Payments
from app.models.plants import Plants
from app.models.roles import Roles
from app.models.schedules import Schedules
from app.models.services import Services
from app.models.teams import Teams
from app.models.users import Users

load_dotenv()

config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata

def run_migrations_offline() -> None:
    """Запуск миграций в 'offline' режиме."""
    url = os.getenv("DATABASE_URL")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    configuration = config.get_section(config.config_ini_section)
    configuration["sqlalchemy.url"] = os.getenv("DATABASE_URL")
    
    connectable = engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, 
            target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()
            
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()