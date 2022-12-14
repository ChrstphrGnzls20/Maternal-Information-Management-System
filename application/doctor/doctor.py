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
    if not session.get('_id'):
        return redirect("/login/doctor")
    return render_template("dashboard.html", contentTemplate="/home.html", sidebarItems=sidebarItems, activeSidebar="DASHBOARD")


@doctor.route("/appointments")
def appointments():
    return render_template("dashboard.html", contentTemplate="/appointment.html", sidebarItems=sidebarItems, activeSidebar="APPOINTMENTS")


@doctor.route("/patients")
def patients():
    return render_template("dashboard.html", contentTemplate="/patient.html", sidebarItems=sidebarItems, activeSidebar="PATIENTS")


@doctor.route("/schedule")
def schedule():
    return render_template("dashboard.html", contentTemplate="/schedule.html", sidebarItems=sidebarItems, activeSidebar="SCHEDULE")


@doctor.route("/patients/facesheet/<string:id>")
def facesheet(id):
    return render_template("facesheet.html")