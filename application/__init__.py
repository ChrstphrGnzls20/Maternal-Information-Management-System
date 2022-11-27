import json
from flask import Flask, render_template, url_for, request, redirect, session

# session
from flask_session import Session

# blueprints
from application.login.login import login
from application.patient.patient import patient
from application.admin.admin import admin
from application.emr.emr import emr
from application.address.address import address
from application.api.api import api
from application.doctor.doctor import doctor

"""Extensions/Plugins"""
# pymongo
from .extensions import mongo
# flask_mail
from .extensions import mail

# settings
from .settings import Settings


"""
GMAIL ACCOUNT USED
email: maternityclinicis@gmail.com
password: maternityclinic123
code: tpjyiprychvuuafv
"""


def init_app():
    """Initialize the core application."""

    app = Flask(__name__)

    """Set application configuration using Settings object"""
    app.config.from_object(Settings)

    """Initialize Session"""
    Session(app)

    """Initialize plugins"""
    mongo.init_app(app)
    # TODO: implement OTP using flask_mail
    mail.init_app(app)

    with app.app_context():
        # Include routes
        app.register_blueprint(login, url_prefix='/login')
        app.register_blueprint(patient, url_prefix="/patient")
        app.register_blueprint(admin, url_prefix="/admin")
        app.register_blueprint(doctor, url_prefix="/doctor")
        app.register_blueprint(address, url_prefix="/address")
        app.register_blueprint(emr, url_prefix="/emr")
        app.register_blueprint(api, url_prefix='/api')
    # from . import models

    @app.route('/')
    def index():
        return render_template('index.html')

    @app.route('/logout')
    def logout():
        session.clear()

        return redirect("/")

    return app


# if __name__ == "__main__":
#     app.config.from_object(Config)
#     app.run()


# @app.route('/<entity>/login', methods=["GET", "POST"])
# def login(entity):
#     return render_template("login.html", title="Login", entity=entity)


# @app.route('/register/')
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


# # to check if email exists in db
# @app.route('register/check-email', methods=["GET", "POST"])
# def checkEmailDuplication():
#     if request.method == "POST":
#         # check if username exists in db
#         return
#     elif request.method == "GET":
#         return "Bad request"


# @app.route('/register/data', methods=["GET", "POST"])
# def handleRegister():
#     if request.method == "POST":
#         data = request.data
#         jsonData = json.loads(data)
#         print(json.dumps(jsonData, indent=2))
#         response = {'code': "SUCCESS"}
#         return make_response(jsonify(response), 201)
#     elif request.method == "GET":
#         return "Bad request"


# @app.route('/register/success')
# def registerSuccess():
#     return render_template("register-success.html")


# @app.route('/<entity>/dashboard/')
# def dashboard(entity):
#     if entity == "patient":
#         content = [
#             {
#                 'idx': 0,
#                 'title': "Can I have a Pap smear on my period?",
#                 'body': "Yes, however it is recommended to avoid if at all possible. The blood may cover up the cells, which need to be examined. Try to schedule your Pap test when you are off your period or when you do not have a heavy flow.",
#             },
#             {
#                 'idx': 1,
#                 'title': "How often do i need Pap smear?",
#                 'body': "Women with a healthy, normal immune system between the ages of 21 and 29 need a Pap smear every two years. \n \n Between the ages of 30 and 64, a Pap test should be given every three to five years based on the patient’s HPV status and past medical history. \n  \n After 65 you may not need a Pap test anymore. \n \n Women with certain medical conditions or who are pregnant may require additional Pap testing.",
#             },
#             {
#                 'idx': 2,
#                 'title': "What should I do if I miss a birth conntrol pill?",
#                 'body': "Birth control pills should be taken at the same time every day. \n\n If you realize that you have forgotten to take your pill that day, take it as soon as possible. \n\nIf you do not realize until the next day, take two pills at your normal time. Birth control loses its effect when it is not taken every day, it is recommended to use a backup form of contraception after missing a day.",
#             },

#             {
#                 'idx': 3,
#                 'title': "Should I be tested for Human Papillomavirus (HPV)?",
#                 'body': "Starting at age 30, women should have an HPV test along with their Pap test.",
#             },
#             {
#                 'idx': 4,
#                 'title': "When should I make my first prenatal appointment?",
#                 'body': "If you believe you are pregnant, you should schedule an appointment to confirm at once. Your first prenatal appointment should be within six to eight weeks after your last menstrual cycle.",
#             },
#             {
#                 'idx': 5,
#                 'title': "Can I exercise while pregnant?",
#                 'body': "If you already have a regular exercise program, you may continue your exercise routine if approved by our medical staff. You should not start a strenuous workout regimen and stay away from activities with high risk of falling or injury. Remember to always be hydrated during your workout.",
#             },
#             {
#                 'idx': 6,
#                 'title': "Can I drink caffeine while pregnant?",
#                 'body': "Caffeine intake should be limited during pregnancy. Do not drink more than 200 mg a day (around two cups of coffee).",
#             },
#         ]
#         sidebarItems = [
#             {
#                 "label": "DASHBOARD",
#                 "icon": "bi bi-house-door",
#                 "route": f"/{entity}/dashboard/",
#                 "active": "true",
#             },
#             {
#                 "label": "APPOINTMENT",
#                 "icon": "bi bi-calendar-week",
#                 "route": f"/{entity}/dashboard/appointment",
#                 "active": "false",
#             },
#         ]
#         return render_template("dashboard.html", contentTemplate="./partials/patient-dashboard/faq.html", content=content, sidebarItems=sidebarItems)


# @app.route('/<entity>/dashboard/appointment/')
# def homeAppointment(entity):
#     sidebarItems = [
#         {
#             "label": "DASHBOARD",
#             "icon": "bi bi-house-door",
#             "route": f"/{entity}/dashboard/",
#             "active": "false",
#         },
#         {
#             "label": "APPOINTMENT",
#             "icon": "bi bi-calendar-week",
#             "route": f"/{entity}/dashboard/appointment",
#             "active": "true",
#         },
#     ]

#     appointments = [
#         {
#             "ref": 1,
#             "practitioner": "Kevin Hart",
#             "scheduleDate": "08/15/2022",
#             "scheduleTime": "12:00pm",
#             "status": "Done"
#         },
#         {
#             "ref": 2,
#             "practitioner": "Kevin Hart",
#             "scheduleDate": "08/17/2022",
#             "scheduleTime": "12:00pm",
#             "status": "Pending"
#         }
#     ]
#     return render_template("dashboard.html", contentTemplate="./partials/patient-dashboard/home-appointment.html",  sidebarItems=sidebarItems, appointments=appointments)


# @app.route('/<entity>/dashboard/appointment/create')
# def createAppointment(entity):
#     sidebarItems = [
#         {
#             "label": "DASHBOARD",
#             "icon": "bi bi-house-door",
#             "route": f"/{entity}/dashboard/",
#             "active": "active",
#         },
#         {
#             "label": "APPOINTMENT",
#             "icon": "bi bi-calendar-week",
#             "route": f"/{entity}/dashboard/appointment",
#             "active": "true",
#         },
#     ]
#     return render_template("dashboard.html", contentTemplate="./partials/patient-dashboard/create-appointment.html",  sidebarItems=sidebarItems)
