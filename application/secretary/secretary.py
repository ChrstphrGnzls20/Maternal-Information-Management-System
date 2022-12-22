from flask import Flask, Blueprint, render_template, session

secretary = Blueprint("secretary", __name__,
                      template_folder='templates', static_folder='static')

sidebarItems = [
    {
        "label": "DASHBOARD",
        "icon": "bi bi-house-door",
        "route": "/secretary",
    },
    # {
    #     "label": "VITAL SIGNS",
    #     "icon": "bi bi-calendar-week",
    #     "route": "/secretary/vital-signs",
    # },
]


@secretary.route("/")
def secretaryDashboard():
    return render_template("dashboard.html", contentTemplate="/secretaryHome.html", sidebarItems=sidebarItems, activeSidebar="DASHBOARD")


# @secretary.route("/vital-signs")
# def vitalSigns():
#     return render_template("dashboard.html", contentTemplate="/vitalSigns.html", sidebarItems=sidebarItems, activeSidebar="VITAL SIGNS")
