"""merge multiple heads

Revision ID: 751b404a0bf1
Revises: add_status_payments, bd55d6d9161c
Create Date: 2026-05-27 15:15:26.814410

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '751b404a0bf1'
down_revision: Union[str, Sequence[str], None] = ('add_status_payments', 'bd55d6d9161c')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
