"""initial_base

Revision ID: 5f50e6b95e2a
Revises: 
Create Date: 2026-03-29 17:50:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5f50e6b95e2a'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Сначала создаем независимые справочники
    op.create_table('roles',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_roles_id'), 'roles', ['id'], unique=False)

    op.create_table('order_statuses',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_order_statuses_id'), 'order_statuses', ['id'], unique=False)

    op.create_table('services',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('price', sa.Numeric(precision=10, scale=2), nullable=True),
        sa.Column('image_url', sa.String(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_services_id'), 'services', ['id'], unique=False)

    # 2. Создаем таблицы с циклической зависимостью БЕЗ внешних ключей
    op.create_table('teams',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('efficiency_rating', sa.Float(), nullable=True),
        sa.Column('leader_id', sa.Integer(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_teams_id'), 'teams', ['id'], unique=False)

    op.create_table('users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('username', sa.String(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('password_hash', sa.String(), nullable=False),
        sa.Column('phone', sa.String(), nullable=True),
        sa.Column('role_id', sa.Integer(), nullable=True),
        sa.Column('team_id', sa.Integer(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)

    # 3. Создаем остальные таблицы
    op.create_table('garden_plots',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('address', sa.String(), nullable=False),
        sa.Column('area', sa.Float(), nullable=False),
        sa.Column('features', sa.Text(), nullable=True),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_garden_plots_id'), 'garden_plots', ['id'], unique=False)

    op.create_table('orders',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('execution_date', sa.Date(), nullable=False),
        sa.Column('regularity', sa.String(), nullable=True),
        sa.Column('comment', sa.Text(), nullable=True),
        sa.Column('total_price', sa.Numeric(precision=10, scale=2), nullable=True),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('plot_id', sa.Integer(), nullable=True),
        sa.Column('service_id', sa.Integer(), nullable=True),
        sa.Column('status_id', sa.Integer(), nullable=True),
        sa.Column('team_id', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['plot_id'], ['garden_plots.id'], ),
        sa.ForeignKeyConstraint(['service_id'], ['services.id'], ),
        sa.ForeignKeyConstraint(['status_id'], ['order_statuses.id'], ),
        sa.ForeignKeyConstraint(['team_id'], ['teams.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_orders_id'), 'orders', ['id'], unique=False)

    op.create_table('plants',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('plant_type', sa.String(), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('plot_id', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['plot_id'], ['garden_plots.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_plants_id'), 'plants', ['id'], unique=False)

    op.create_table('payments',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('amount', sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column('payment_date', sa.Date(), nullable=False),
        sa.Column('status', sa.String(), nullable=False),
        sa.Column('order_id', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['order_id'], ['orders.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_payments_id'), 'payments', ['id'], unique=False)

    op.create_table('schedule',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('scheduled_date', sa.Date(), nullable=False),
        sa.Column('order_id', sa.Integer(), nullable=True),
        sa.Column('team_id', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['order_id'], ['orders.id'], ),
        sa.ForeignKeyConstraint(['team_id'], ['teams.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_schedule_id'), 'schedule', ['id'], unique=False)

    # 4. ФИНАЛЬНЫЙ ШАГ: Добавляем внешние ключи для Users и Teams
    op.create_foreign_key('fk_users_role', 'users', 'roles', ['role_id'], ['id'])
    op.create_foreign_key('fk_users_team', 'users', 'teams', ['team_id'], ['id'])
    op.create_foreign_key('fk_teams_leader', 'teams', 'users', ['leader_id'], ['id'])


def downgrade() -> None:
    # Удаляем ключи, чтобы можно было удалить таблицы
    op.drop_constraint('fk_teams_leader', 'teams', type_='foreignkey')
    op.drop_constraint('fk_users_team', 'users', type_='foreignkey')
    op.drop_constraint('fk_users_role', 'users', type_='foreignkey')
    
    op.drop_table('schedule')
    op.drop_table('payments')
    op.drop_table('plants')
    op.drop_table('orders')
    op.drop_table('garden_plots')
    op.drop_table('users')
    op.drop_table('teams')
    op.drop_table('services')
    op.drop_table('order_statuses')
    op.drop_table('roles')