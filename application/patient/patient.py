from ..models.Mdl_emr import EMR
from ..models.Mdl_patient import Patient
from ..models.Mdl_appointment import Appointment
from flask import Blueprint, render_template, session, redirect, request, make_response, jsonify, session
from ..extensions import login_required
import datetime

patient = Blueprint('patient', __name__, template_folder="templates",
                    static_folder="static")

# MODELS

patientObj = Patient()
appointmentObj = Appointment()

sidebarItems = [
    {
        "label": "DASHBOARD",
        "icon": "bi bi-house-door",
        "route": "/patient/",
    },
    {
        "label": "APPOINTMENTS",
        "icon": "bi bi-calendar-week",
        "route": "/patient/appointments",
    },
    {
        "label": "CONSULTATIONS",
        "icon": "bi bi-calendar-week",
        "route": "/patient/consultations",
    },
]


@patient.route("/register/")
def startRegister():
    diseasesList = [
        {"name": "cv19", "label": "Covid 19"},
        {"name": "arthritis", "label": "Athritis"},
        {"name": "diabetes", "label": "Diabetes"},
        {"name": "highBloodPressure", "label": "High Blood Pressure"},
        {"name": "heartDisease", "label": "Heart Disease"},
        {"name": "thyroidDisease", "label": "Thyroid Disease"},
        {"name": "eatingDisorder", "label": "Eating Disorder"},
        {"name": "bloodTransfusions", "label": "Blood Transfusions"},
        {"name": "hiv", "label": "HIV+"},
        {"name": "bronchitis", "label": "Bronchitis"},
        {"name": "emphysema", "label": "Emphysema"},
        {"name": "athma", "label": "Asthma"},
        {"name": "epilepsy", "label": "Epilepsy"},
        {"name": "liverDiseases", "label": "Liver Diseases"},
        {"name": "hepatitis", "label": "Hepatitis"},
        {"name": "gallstones", "label": "Gallstones"},
        {"name": "kidneyDisease", "label": "Kidney Disease"},
        {"name": "ovarianCancer", "label": "Ovarian Cancer"},
        {"name": "endometrialCancer", "label": "Endometrial Cancer"},
        {"name": "breastCancer", "label": "Breast Cancer"},
        {"name": "colonCancer", "label": "Colon Cancer"},
    ]

    return render_template('register.html', diseasesList=diseasesList)


@patient.route('/register/success')
def registerSuccess():
    return render_template("register-success.html")


@patient.route('/')
@login_required
def dashboard():
    # if session.get('id') and session.get("entity") == 'patient':
        print(session)
        content = [
            {
                'idx': 0,
                'title': "Can I have a Pap smear on my period?",
                'body': "Yes, however it is recommended to avoid if at all possible. The blood may cover up the cells, which need to be examined. Try to schedule your Pap test when you are off your period or when you do not have a heavy flow.",
            },
            {
                'idx': 1,
                'title': "How often do i need Pap smear?",
                'body': "Women with a healthy, normal immune system between the ages of 21 and 29 need a Pap smear every two years. \n \n Between the ages of 30 and 64, a Pap test should be given every three to five years based on the patient’s HPV status and past medical history. \n  \n After 65 you may not need a Pap test anymore. \n \n Women with certain medical conditions or who are pregnant may require additional Pap testing.",
            },
            {
                'idx': 2,
                'title': "What should I do if I miss a birth conntrol pill?",
                'body': "Birth control pills should be taken at the same time every day. \n\n If you realize that you have forgotten to take your pill that day, take it as soon as possible. \n\nIf you do not realize until the next day, take two pills at your normal time. Birth control loses its effect when it is not taken every day, it is recommended to use a backup form of contraception after missing a day.",
            },

            {
                'idx': 3,
                'title': "Should I be tested for Human Papillomavirus (HPV)?",
                'body': "Starting at age 30, women should have an HPV test along with their Pap test.",
            },
            {
                'idx': 4,
                'title': "When should I make my first prenatal appointment?",
                'body': "If you believe you are pregnant, you should schedule an appointment to confirm at once. Your first prenatal appointment should be within six to eight weeks after your last menstrual cycle.",
            },
            {
                'idx': 5,
                'title': "Can I exercise while pregnant?",
                'body': "If you already have a regular exercise program, you may continue your exercise routine if approved by our medical staff. You should not start a strenuous workout regimen and stay away from activities with high risk of falling or injury. Remember to always be hydrated during your workout.",
            },
            {
                'idx': 6,
                'title': "Can I drink caffeine while pregnant?",
                'body': "Caffeine intake should be limited during pregnancy. Do not drink more than 200 mg a day (around two cups of coffee).",
            },
        ]
        return render_template("dashboard.html", contentTemplate="/faq.html", content=content, sidebarItems=sidebarItems, activeSidebar="DASHBOARD", name=session.get('name'))
    # return redirect("/login/patient")


@patient.route('/appointments/')
@login_required
def homeAppointment():
    if session.get('id') and session.get("entity") == 'patient':
        return render_template("dashboard.html", contentTemplate="/home-appointment.html",  sidebarItems=sidebarItems, activeSidebar="APPOINTMENTS", name=session.get('name'))
    return redirect("/login/patient")


@patient.route('/appointments/create')
@login_required
def createAppointment():
    if session.get('id') and session.get("entity") == 'patient':
        return render_template("dashboard.html", contentTemplate="/create-appointment.html",  sidebarItems=sidebarItems, activeSidebar="APPOINTMENTS", clinicians=appointmentObj.getAvailableClinicians(), name=session.get('name'))
    return redirect("/login/patient")


@patient.route("/consultations")
@login_required
def homeConsultations():
    if session.get('id') and session.get("entity") == 'patient':
        id = session.get('id')
        emrObj = EMR()
        checkups = emrObj.retrieveCheckup(filter={"patientID": id}, returnFields={
            "plan": 1, "assessment.diagnosis": 1, "completedDate": 1})

        for checkup in checkups:
            checkup['completedDate'] = datetime.datetime.fromisoformat(
                checkup['completedDate']).strftime("%B %d, %Y")

            prescription = checkup['plan']['prescription']
            resultForPrescription = []
            for index, item in enumerate(prescription):
                tempObj = {}
                for key, value in item.items():
                    if key == "medicinePeriod":
                        # COMPUTE MEDICINE AMOUNT
                        tempObj['medicineAmount'] = int(
                            prescription[index]['medicineFrequency']) * int(value)

                        value = int(value)
                        if value % 30 == 0:
                            value = f'{value // 30} month/s'
                        elif value % 7 == 0:
                            value = f'{value // 7} week/s'
                    tempObj[key] = value
                resultForPrescription.append(tempObj)

            checkup['plan']['prescription'] = resultForPrescription

            print(checkup)

        return render_template("dashboard.html", contentTemplate="/home-consultations.html",  sidebarItems=sidebarItems, activeSidebar="CONSULTATIONS", checkups=checkups, name=session.get('name'))
    return redirect("/login/patient")

