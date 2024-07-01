  
import os
from flask_admin import Admin
from .models import db, Paciente, Doctor, BloodPressure, BloodPressureRange, Availability, Appointment, BloodTest, BloodRange, RecommendationBloodPresure, RecommendationBloodTest, Review, Specialties, Contact
from flask_admin.contrib.sqla import ModelView

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')

    
    # Add your models here, for example this is how we add a the User model to the admin
    admin.add_view(ModelView(Paciente, db.session))
    admin.add_view(ModelView(Doctor, db.session))
    admin.add_view(ModelView(Review, db.session))
    admin.add_view(ModelView(Specialties, db.session))
    admin.add_view(ModelView(BloodPressure, db.session))
    admin.add_view(ModelView(BloodPressureRange, db.session))
    admin.add_view(ModelView(Availability, db.session))
    admin.add_view(ModelView(Appointment, db.session))
    admin.add_view(ModelView(BloodTest, db.session))
    admin.add_view(ModelView(RecommendationBloodTest, db.session))
    admin.add_view(ModelView(RecommendationBloodPresure, db.session))
    admin.add_view(ModelView(BloodRange, db.session))
    admin.add_view(ModelView(Contact, db.session))
   
    
    # You can duplicate that line to add mew models
    # admin.add_view(ModelView(YourModelName, db.session))