  
import os
from flask_admin import Admin
from .models import db, Paciente, Doctor, BloodPressure, Range, Recommendation, Availability, Appointment, BloodTest
from flask_admin.contrib.sqla import ModelView

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')

    
    # Add your models here, for example this is how we add a the User model to the admin
    admin.add_view(ModelView(Paciente, db.session))
    admin.add_view(ModelView(Doctor, db.session))
    admin.add_view(ModelView(BloodPressure, db.session))
    admin.add_view(ModelView(Range, db.session))
    admin.add_view(ModelView(Availability, db.session))
    admin.add_view(ModelView(Appointment, db.session))
    admin.add_view(ModelView(BloodTest, db.session))
    admin.add_view(ModelView(Recommendation, db.session))
    # You can duplicate that line to add mew models
    # admin.add_view(ModelView(YourModelName, db.session))