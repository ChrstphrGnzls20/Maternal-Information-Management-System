from flask import Blueprint

# BLUEPRINTS
from ..api.patientAPI import patientAPI
from ..api.authAPI import authAPI
from ..api.appointmentAPI import appointmentAPI
from ..api.employeeAPI import employeeAPI
from ..api.clinicServiceAPI import clinicServiceAPI
from ..api.emrAPI import emrAPI
from ..api.doctorAPI import doctorAPI
from ..api.reportAPI import reportAPI
from ..api.SMSAPI import SMSAPI

api = Blueprint("api", __name__)

api.register_blueprint(patientAPI, url_prefix='/patients')
api.register_blueprint(authAPI, url_prefix='/auth')
api.register_blueprint(appointmentAPI, url_prefix='/appointments')
api.register_blueprint(employeeAPI, url_prefix='/employees')
api.register_blueprint(clinicServiceAPI, url_prefix='/clinic-services')
api.register_blueprint(emrAPI, url_prefix='/emr')
api.register_blueprint(doctorAPI, url_prefix='/doctors')
api.register_blueprint(reportAPI, url_prefix='/reports')
api.register_blueprint(SMSAPI, url_prefix='/sms')


# IMPORTANT: ALL API ENDPOINTS MUST RETURN EITHER '[]' OR '[{}]'


@api.route("/")
def API():
    return "HELLO THERE FROM API BLUEPRINT"
