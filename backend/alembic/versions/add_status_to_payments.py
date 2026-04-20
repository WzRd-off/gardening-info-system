"""Add status to payments table

Revision ID: add_status_payments
Revises: e92f65191e03
Create Date: 2026-04-20 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'add_status_payments'
down_revision = 'e92f65191e03'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Добавляем колонку status с значением по умолчанию 'pending'
    op.add_column('payments', sa.Column('status', sa.String(20), nullable=False, server_default='pending'))


def downgrade() -> None:
    # Удаляем колонку status
    op.drop_column('payments', 'status')
