"""added genre to books

Revision ID: 480946d02a4e
Revises: 
Create Date: 2024-11-01 15:21:29.714313

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '480946d02a4e'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('books', sa.Column('genre', sa.String(), nullable=True))


def downgrade() -> None:
    pass
