# models
from ..models.Mdl_patient import Patient
from ..models.Mdl_employee import Employee
from ..models.Mdl_login import Login

from flask import Blueprint, request, make_response, jsonify, session
import json

authAPI = Blueprint('authAPI', __name__)

# instantiate model
patientObj = Patient()


@authAPI.route("/<string:entity>/check-email/<string:email>")
def checkEmail(entity, email):
    # FOR CHECKING IF THE EMAIL ALREADY EXISTS IN THE DATABASE
    '''EXPECTS AN ENTITY WHICH SPECIFY WHAT DATABASE TO LOOK FOR AND THE EMAIL TO CHECK'''
    # if request.method == "GET":
    if entity == "patient":
        result = patientObj.findPatient({"email": email}, {})
        if result:
            # RETURNS AN ERROR CODE 409 (CONFLICT) WHEN THE EMAIL ALREADY EXISTS IN THE DATABASE
            return make_response(jsonify({"errorMsg": "Email already exists! Go to login <a href='/patient/login' style='color: inherit'>here.</a>"}), 409)
        patientObj.generateOTP(email)
        return make_response(jsonify([]), 201)


@authAPI.route("/otp/<string:otp>/verify")
def verifyOTP(otp):
    # FOR VERIFYING OTP SEND VIA EMAIL IF IT MATCHES TO THE TYPED-OTP
    result = patientObj.verifyOTP(otp)
    print(result)
    if result:
        return make_response(jsonify({'code': "SUCCESS"}), 201)
    return make_response(jsonify({"errorMsg": "Incorrect OTP!"}), 422)


@authAPI.route("/login/<string:entity>", methods=["POST"])
def loginAttempt(entity: str):
    # FOR VERIFYING LOGIN CREDENTIALS
    if request.method == "POST":
        loginCred = json.loads(request.data)
        print(loginCred)
        if entity != 'patient':
            entity = 'employee'
        loginObj = Login(entity=entity)
        result = loginObj.login(loginCred=loginCred)
        # IF THE LOGIN CREDENTIAL IS CORRECT
        if result:
            loginData = result[0]
            print(loginData)
            # SAVE SESSION
            session['_id'] = loginData['_id']
            if entity == "patient":
                session['userRole'] = 'patient'
            else:
                session['userRole'] = entity
            return make_response(jsonify(result), 201)
        return make_response(jsonify(result), 401)
