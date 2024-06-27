"""empty message

Revision ID: d0022fabe633
Revises: 
Create Date: 2024-06-27 00:24:36.481295

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd0022fabe633'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('blood_pressure_range',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=50), nullable=True),
    sa.Column('systolic_min', sa.Integer(), nullable=True),
    sa.Column('systolic_max', sa.Integer(), nullable=True),
    sa.Column('diastolic_min', sa.Integer(), nullable=True),
    sa.Column('diastolic_max', sa.Integer(), nullable=True),
    sa.Column('heart_rate_min', sa.Integer(), nullable=True),
    sa.Column('heart_rate_max', sa.Integer(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('blood_range',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=50), nullable=True),
    sa.Column('min_range', sa.Float(), nullable=True),
    sa.Column('max_range', sa.Float(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('doctor',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('nombre', sa.String(length=50), nullable=False),
    sa.Column('apellido', sa.String(length=50), nullable=False),
    sa.Column('especialidad', sa.String(length=50), nullable=True),
    sa.Column('email', sa.String(length=50), nullable=False),
    sa.Column('numero_de_telefono', sa.String(length=15), nullable=True),
    sa.Column('password', sa.String(length=80), nullable=False),
    sa.Column('direccion', sa.String(length=100), nullable=True),
    sa.Column('ciudad', sa.String(length=50), nullable=True),
    sa.Column('estado', sa.String(length=50), nullable=True),
    sa.Column('costo', sa.Float(), nullable=True),
    sa.Column('numero_de_licencia', sa.String(), nullable=True),
    sa.Column('is_active', sa.Boolean(), nullable=False),
    sa.Column('destacado', sa.Boolean(), nullable=False),
    sa.Column('foto_perfil', sa.String(length=255), nullable=True),
    sa.Column('numero_de_resenas', sa.Integer(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email')
    )
    op.create_table('paciente',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('email', sa.String(length=120), nullable=False),
    sa.Column('nombre', sa.String(length=120), nullable=False),
    sa.Column('apellido', sa.String(length=50), nullable=False),
    sa.Column('password', sa.String(length=80), nullable=False),
    sa.Column('numero_de_telefono', sa.String(length=15), nullable=True),
    sa.Column('fecha_de_nacimiento', sa.Date(), nullable=True),
    sa.Column('sexo', sa.String(length=10), nullable=True),
    sa.Column('is_active', sa.Boolean(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email')
    )
    op.create_table('availability',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('doctor_id', sa.Integer(), nullable=False),
    sa.Column('day_of_week', sa.Integer(), nullable=False),
    sa.Column('start_time', sa.Time(), nullable=False),
    sa.Column('end_time', sa.Time(), nullable=False),
    sa.Column('is_booked', sa.Boolean(), nullable=False),
    sa.ForeignKeyConstraint(['doctor_id'], ['doctor.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('blood_test',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('paciente_id', sa.Integer(), nullable=False),
    sa.Column('date', sa.DateTime(), nullable=False),
    sa.Column('glicemia', sa.Float(), nullable=True),
    sa.Column('colesterol', sa.Float(), nullable=True),
    sa.Column('trigliceridos', sa.Float(), nullable=True),
    sa.Column('hematocritos', sa.Float(), nullable=True),
    sa.Column('hemoglobina', sa.Float(), nullable=True),
    sa.ForeignKeyConstraint(['paciente_id'], ['paciente.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('recommendation_blood_pressure',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('blood_pressure_range_id', sa.Integer(), nullable=True),
    sa.Column('text', sa.Text(), nullable=False),
    sa.ForeignKeyConstraint(['blood_pressure_range_id'], ['blood_pressure_range.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('recommendation_blood_test',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('blood_range_id', sa.Integer(), nullable=True),
    sa.Column('text', sa.Text(), nullable=False),
    sa.ForeignKeyConstraint(['blood_range_id'], ['blood_range.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('review',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('doctor_id', sa.Integer(), nullable=False),
    sa.Column('comentario', sa.String(length=500), nullable=False),
    sa.Column('puntuacion', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['doctor_id'], ['doctor.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('specialties',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('doctor_id', sa.Integer(), nullable=False),
    sa.Column('especialidades', sa.String(length=255), nullable=False),
    sa.ForeignKeyConstraint(['doctor_id'], ['doctor.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('appointment',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('paciente_id', sa.Integer(), nullable=False),
    sa.Column('doctor_id', sa.Integer(), nullable=False),
    sa.Column('availability_id', sa.Integer(), nullable=False),
    sa.Column('message', sa.String(length=200), nullable=True),
    sa.Column('appointment_date', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['availability_id'], ['availability.id'], ),
    sa.ForeignKeyConstraint(['doctor_id'], ['doctor.id'], ),
    sa.ForeignKeyConstraint(['paciente_id'], ['paciente.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('blood_pressure',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('paciente_id', sa.Integer(), nullable=False),
    sa.Column('date', sa.DateTime(), nullable=False),
    sa.Column('systolic', sa.Integer(), nullable=False),
    sa.Column('diastolic', sa.Integer(), nullable=False),
    sa.Column('heart_rate', sa.Integer(), nullable=False),
    sa.Column('recommendation_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['paciente_id'], ['paciente.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['recommendation_id'], ['recommendation_blood_pressure.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('blood_pressure')
    op.drop_table('appointment')
    op.drop_table('specialties')
    op.drop_table('review')
    op.drop_table('recommendation_blood_test')
    op.drop_table('recommendation_blood_pressure')
    op.drop_table('blood_test')
    op.drop_table('availability')
    op.drop_table('paciente')
    op.drop_table('doctor')
    op.drop_table('blood_range')
    op.drop_table('blood_pressure_range')
    # ### end Alembic commands ###
