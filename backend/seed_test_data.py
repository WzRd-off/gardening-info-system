from datetime import datetime, timedelta, timezone
from decimal import Decimal

from passlib.hash import bcrypt
from sqlalchemy import select

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
from app.utils.database import SessionLocal


def get_or_create_role(db, name: str) -> Roles:
    role = db.execute(select(Roles).where(Roles.name == name)).scalars().first()
    if role:
        return role
    role = Roles(name=name)
    db.add(role)
    db.flush()
    return role


def get_or_create_status(db, status_id: int, name: str) -> OrderStatus:
    status = db.execute(select(OrderStatus).where(OrderStatus.id == status_id)).scalars().first()
    if status:
        return status
    status = OrderStatus(id=status_id, name=name)
    db.add(status)
    db.flush()
    return status


def get_or_create_user(db, username: str, email: str, role_id: int, phone: str | None = None, team_id: int | None = None) -> Users:
    user = db.execute(select(Users).where(Users.email == email)).scalars().first()
    if user:
        return user
    user = Users(
        username=username,
        email=email,
        password_hash=bcrypt.hash("Password123!"),
        phone=phone,
        role_id=role_id,
        team_id=team_id,
    )
    db.add(user)
    db.flush()
    return user


def get_or_create_service(db, name: str, description: str, category: str, price: Decimal) -> Services:
    service = db.execute(select(Services).where(Services.name == name)).scalars().first()
    if service:
        return service
    service = Services(
        name=name,
        description=description,
        category=category,
        price=price,
        image_url="/images/services/demo.jpg",
    )
    db.add(service)
    db.flush()
    return service


def seed() -> None:
    db = SessionLocal()
    try:
        # Roles used by auth guards
        client_role = get_or_create_role(db, "Клієнт")
        manager_role = get_or_create_role(db, "Менеджер")
        team_role = get_or_create_role(db, "Бригада")

        # Order statuses used by workflows
        status_received = get_or_create_status(db, 1, "Отримано")
        status_way = get_or_create_status(db, 2, "В дорозі")
        status_progress = get_or_create_status(db, 3, "В роботі")
        status_done = get_or_create_status(db, 4, "Виконано")
        get_or_create_status(db, 5, "Проблема виконання")

        manager = get_or_create_user(
            db,
            username="Manager Test",
            email="manager.test@garden.local",
            role_id=manager_role.id,
            phone="+380500000001",
        )
        team_leader = get_or_create_user(
            db,
            username="Foreman Test",
            email="foreman.test@garden.local",
            role_id=team_role.id,
            phone="+380500000002",
        )
        client = get_or_create_user(
            db,
            username="Client Test",
            email="client.test@garden.local",
            role_id=client_role.id,
            phone="+380500000003",
        )

        team = db.execute(select(Teams).where(Teams.name == "Green Brigade")).scalars().first()
        if not team:
            team = Teams(name="Green Brigade", leader_id=team_leader.id)
            db.add(team)
            db.flush()

        if team_leader.team_id != team.id:
            team_leader.team_id = team.id

        plot = db.execute(
            select(GardenPlots).where(
                GardenPlots.user_id == client.id,
                GardenPlots.address == "Kyiv, Demo street 10",
            )
        ).scalars().first()
        if not plot:
            plot = GardenPlots(
                address="Kyiv, Demo street 10",
                area=120.5,
                features="Irrigation-ready, sunny area",
                user_id=client.id,
            )
            db.add(plot)
            db.flush()

        if not db.execute(select(Plants).where(Plants.plot_id == plot.id)).scalars().first():
            db.add(Plants(name="Rose", plot_id=plot.id))
            db.add(Plants(name="Lavender", plot_id=plot.id))

        lawn_service = get_or_create_service(
            db,
            name="Lawn maintenance",
            description="Mowing and lawn care package",
            category="Газон",
            price=Decimal("1200.00"),
        )
        irrigation_service = get_or_create_service(
            db,
            name="Irrigation setup",
            description="Installation and tuning of irrigation system",
            category="Система поливу",
            price=Decimal("4500.00"),
        )

        order_1 = db.execute(
            select(Orders).where(Orders.user_id == client.id, Orders.service_id == lawn_service.id)
        ).scalars().first()
        if not order_1:
            order_1 = Orders(
                user_id=client.id,
                team_id=team.id,
                status_id=status_progress.id,
                plot_id=plot.id,
                service_id=lawn_service.id,
                comment="Please finish before weekend",
                manager_instructions="Bring compact mower",
                regularity="weekly",
                total_price=Decimal("1200.00"),
                execution_date=datetime.now(timezone.utc) + timedelta(days=1),
            )
            db.add(order_1)
            db.flush()

        order_2 = db.execute(
            select(Orders).where(Orders.user_id == client.id, Orders.service_id == irrigation_service.id)
        ).scalars().first()
        if not order_2:
            order_2 = Orders(
                user_id=client.id,
                team_id=team.id,
                status_id=status_done.id,
                plot_id=plot.id,
                service_id=irrigation_service.id,
                comment="Need pressure optimization",
                manager_instructions="Check valves and controller",
                regularity="one-time",
                total_price=Decimal("4500.00"),
                execution_date=datetime.now(timezone.utc) - timedelta(days=2),
            )
            db.add(order_2)
            db.flush()

        if not db.execute(select(Schedules).where(Schedules.order_id == order_1.id)).scalars().first():
            db.add(
                Schedules(
                    scheduled_time=datetime.now(timezone.utc) + timedelta(days=1, hours=3),
                    order_id=order_1.id,
                    team_id=team.id,
                )
            )

        if not db.execute(select(Payments).where(Payments.order_id == order_2.id)).scalars().first():
            db.add(
                Payments(
                    amount=Decimal("3000.00"),
                    status="paid",
                    order_id=order_2.id,
                    team_id=team.id,
                )
            )
        if not db.execute(select(Payments).where(Payments.order_id == order_1.id)).scalars().first():
            db.add(
                Payments(
                    amount=Decimal("800.00"),
                    status="pending",
                    order_id=order_1.id,
                    team_id=team.id,
                )
            )

        db.commit()

        print("Seed completed.")
        print("manager.test@garden.local / Password123!")
        print("foreman.test@garden.local / Password123!")
        print("client.test@garden.local / Password123!")
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
