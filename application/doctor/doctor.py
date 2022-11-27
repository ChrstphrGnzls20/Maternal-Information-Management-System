from flask import Flask, Blueprint, render_template

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
]


@doctor.route("/")
def doctorDashboard():
    return render_template("dashboard.html", contentTemplate="/home.html", sidebarItems=sidebarItems, activeSidebar="DASHBOARD")


@doctor.route("/patients")
def patientsDashboard():
    return render_template("dashboard.html", contentTemplate="/patient.html", sidebarItems=sidebarItems, activeSidebar="PATIENTS")
