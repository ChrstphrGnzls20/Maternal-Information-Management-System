from ..models.Mdl_schedule import Schedule
from ..models.Mdl_emr import EMR
from ..models.Mdl_employee import Employee

import datetime
from flask import Flask, Blueprint, render_template, session, redirect

doctor = Blueprint("doctor", __name__, static_folder="static",
                   template_folder="templates")


sidebarItems = [
    {
        "label": "DASHBOARD",
        "icon": "bi bi-house-door",
        "route": "/doctor",
    },
    {
        "label": "APPOINTMENTS",
        "icon": "bi bi-calendar-week",
        "route": "/doctor/appointments",
    },
    {
        "label": "PATIENTS",
        "icon": "bi bi-calendar-week",
        "route": "/doctor/patients",
    },
    {
        "label": "SCHEDULE",
        "icon": "bi bi-calendar-week",
        "route": "/doctor/schedule",
    },
]


@doctor.route("/")
def doctorDashboard():
    print(session)
    if session.get('id') and session.get("entity") == "doctor":
        return render_template("dashboard.html", contentTemplate="/home.html", sidebarItems=sidebarItems, activeSidebar="DASHBOARD", name=session.get('name'))
    return redirect("/login/doctor")


@doctor.route("/appointments")
def appointments():
    if session.get('id') and session.get("entity") == "doctor":
        return render_template("dashboard.html", contentTemplate="/appointment.html", sidebarItems=sidebarItems, activeSidebar="APPOINTMENTS", name=session.get('name'))
    return redirect("/login/doctor")


@doctor.route("/patients")
def patients():
    if session.get('id') and session.get("entity") == "doctor":
        return render_template("dashboard.html", contentTemplate="/patient.html", sidebarItems=sidebarItems, activeSidebar="PATIENTS", name=session.get('name'))
    return redirect("/login/doctor")


@doctor.route("/schedule")
def schedule():
    if session.get('id') and session.get("entity") == "doctor":
        doctorID = session.get('id')
        schedObj = Schedule()
        events = schedObj.findSchedule(filter={"doctorID": doctorID})
        # print(events)
        # events = [
        #     {'id': '123', 'start': "2022-12-22", 'title': "random"}
        # ]
        return render_template("dashboard.html", contentTemplate="/schedule.html", sidebarItems=sidebarItems, activeSidebar="SCHEDULE", events=events, name=session.get('name'))
    return redirect("/login/doctor")


@doctor.route("/patients/facesheet/<string:patientID>")
def facesheet(patientID):
    if session.get('id') and session.get("entity") == "doctor":
        emrObj = EMR()
        doctorObj = Employee()
        checkUps = emrObj.retrieveCheckup(
            filter={"patientID": patientID}, returnFields={"doctorID": 1, "assessment.diagnosis": 1, "plan.prescription": 1, "completedDate": 1})
        parsedDateCheckups = []
        for checkup in checkUps:
            checkup['completedDate'] = datetime.datetime.fromisoformat(
                checkup['completedDate']).date().strftime(format="%B %d, %Y")
            doctorInfo = doctorObj.retrieveEmployees(
                filter={"_id": checkup['doctorID']}, returnFields={"name": 1})
            checkup['doctorName'] = doctorInfo[0]['name']
            checkup['diagnosis'] = checkup['assessment']['diagnosis']

            del checkup['assessment']
            parsedDateCheckups.append(checkup)
        return render_template("facesheet.html", checkUps=parsedDateCheckups, name=session.get('name'))
    return redirect("/login/doctor")
