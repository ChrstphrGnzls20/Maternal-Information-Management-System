from flask import Blueprint, render_template, session

login = Blueprint('login', __name__, template_folder="templates",
                  static_folder="static")


# for testing
# @login.route('/delete_all')
# def deleteAll():
#     patientObj.deleteAll()
#     return "DELETED"


@login.route('/<string:entity>')
def loginPage(entity):
    session.clear()
    return render_template("login.html", title="Login", entity=entity)


# ADD ROLE TO LOGIN CREDENTIAL FOR A MORE SECURED LOGIN


# @auth.route('/<entity>/login/attempt', methods=["POST"])
# def loginAttempt(entity):
#     if request.method == "POST":
#         loginCred = json.loads(request.data)
#         if entity == "patient":
#             result = patientObj.login(loginCred)
#         else:
#             result = employeeObj.login(loginCred)
#         if result['code'] == "SUCCESS":
#             if entity == "patient":
#                 session['_id'] = result['data']['_id']
#                 session['userRole'] = 'patient'
#             else:
#                 session['_id'] = result['data']['_id']
#                 session['userRole'] = result['data']['userRole']
#             return make_response(jsonify(result), 201)
#         else:
#             return make_response(jsonify(result), 201)


# @auth.route('/register/')
# def startRegister():
#     diseasesList = [
#         {"name": "cv19", "label": "Covid 19"},
#         {"name": "arthritis", "label": "Athritis"},
#         {"name": "diabetes", "label": "Diabetes"},
#         {"name": "highBloodPressure", "label": "High Blood Pressure"},
#         {"name": "heartDisease", "label": "Heart Disease"},
#         {"name": "thyroidDisease", "label": "Thyroid Disease"},
#         {"name": "eatingDisorder", "label": "Eating Disorder"},
#         {"name": "bloodTransfusions", "label": "Blood Transfusions"},
#         {"name": "hiv", "label": "HIV+"},
#         {"name": "bronchitis", "label": "Bronchitis"},
#         {"name": "emphysema", "label": "Emphysema"},
#         {"name": "athma", "label": "Asthma"},
#         {"name": "epilepsy", "label": "Epilepsy"},
#         {"name": "liverDiseases", "label": "Liver Diseases"},
#         {"name": "hepatitis", "label": "Hepatitis"},
#         {"name": "gallstones", "label": "Gallstones"},
#         {"name": "kidneyDisease", "label": "Kidney Disease"},
#         {"name": "ovarianCancer", "label": "Ovarian Cancer"},
#         {"name": "endometrialCancer", "label": "Endometrial Cancer"},
#         {"name": "breastCancer", "label": "Breast Cancer"},
#         {"name": "colonCancer", "label": "Colon Cancer"},
#     ]

#     return render_template('register.html', diseasesList=diseasesList)


# to check if email exists in db


# @auth.route('/register/check-email', methods=["GET", "POST"])
# def checkEmailDuplication():
#     if request.method == "POST":
#         email = json.loads(request.data)
#         print(email)
#         # check if username exists in db
#         result = patientObj.findPatient(filter=email, return_fields={
#             "_id": 0, "email": 1})
#         # if it does not exists
#         if (result['code'] == "SUCCESS"):
#             # response = make_response()
#             # response.status_code = 404
#             # response.headers = {'code': "ERROR"}
#             # generate OTP to be sent to GMAIL when valid
#             patientObj.generateOTP(email)
#             return make_response(jsonify(result), 201)
#         else:
#             return make_response(jsonify(result), 201)
#     elif request.method == "GET":
#         return "Bad request"

# @auth.route("/auth/<string:entity>/check-email/<string:email>", methods=["GET"])
# def checkEmail(entity, email):
#     '''
#         EXPECTS AN ENTITY WHICH SPECIFY WHAT DATABASE TO LOOK FOR AND THE EMAIL TO CHECK
#     '''
#     if request.method == "GET":
#         if entity == "patient":
#             result = patientObj.findPatient({"email": email}, {})
#             if result:
#                 # RETURNS AN ERROR CODE 409 (CONFLICT) WHEN THE EMAIL ALREADY EXISTS IN THE DATABASE
#                 return make_response(jsonify({"errorMsg": "Email already exists! Go to login <a href='/patient/login' style='color: inherit'>here.</a>"}), 409)
#             patientObj.generateOTP(email)
#             return make_response(jsonify([]), 201)

    # @auth.route("/register/new_otp", methods=["POST"])
    # def newOTP():
    #     if request.method == "POST":
    #         email = json.loads(request.data)
    #         print(email)
    #         patientObj.generateOTP(email)
    #         return make_response(jsonify({'code': "SUCCESS"}), 201)


# @auth.route("/auth/verify-otp/<string:unverifiedOTP>", methods=["GET"])
# def verifyOTP(unverifiedOTP):
#     if request.method == "GET":
#         result = patientObj.verifyOTP(unverifiedOTP)
#         print(result)
#         if result:
#             return make_response(jsonify({'code': "SUCCESS"}), 201)
#         return make_response(jsonify({"errorMsg": "Incorrect OTP!"}), 422)


# @auth.route('/register/data', methods=["GET", "POST"])
# def handleRegister():
#     if request.method == "POST":
#         # save data to db
#         data = request.data

#         jsonData = json.loads(data)
#         print(json.dumps(jsonData, indent=2))
#         patientObj.register(jsonData)
#         response = {'code': "SUCCESS"}
#         return make_response(jsonify(response), 201)
#     elif request.method == "GET":
#         return "Bad request"


# @auth.route('/register/success')
# def registerSuccess():
#     return render_template("register-success.html")


# NOTE: for testing
