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

# FIXME: INSTEAD OF ENTITY FOR DOCTOR IS EMPLOYEE, ASSIGN THE CORRECT ENTTIY FOR USER-ROLE AUTHENTICATION


@authAPI.route("/login/<string:entity>", methods=["POST"])
def loginAttempt(entity: str):
    # FOR VERIFYING LOGIN CREDENTIALS
    if request.method == "POST":
        dbName = entity
        loginCred = json.loads(request.data)
        if entity == 'secretary' or entity == 'doctor':
            dbName = 'employee'
        loginObj = Login(entity=dbName)
        result = loginObj.login(loginCred=loginCred)
        print(result)
        # IF THE LOGIN CREDENTIAL IS CORRECT
        if result:
            loginData = result[0]
            # SAVE SESSION IF NOT ADMIN
            session['id'] = loginData['_id']
                
            if dbName == 'patient':
                session['name'] = loginData['basicInformation']['name']
            elif dbName == 'employee':
                session['name'] = loginData['name']

            session['entity'] = entity
            session['loggedIn'] = True
            print(result)
            return make_response(jsonify(result), 201)
        return make_response(jsonify(result), 401)
