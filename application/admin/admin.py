from flask import Blueprint, jsonify, make_response, render_template, request, session, redirect

import json
import copy
import datetime
# helpers for report
from ..api.reportAPI import patientCheckupTally, clinicServiceTallyWithDates, attendanceTallyForDoctors, doctorsCheckupTallyWithDates
import pdfkit

# models
from ..models.Mdl_employee import Employee
from ..models.Mdl_clinicService import ClinicService

admin = Blueprint('admin', __name__, template_folder="templates",
                  static_folder="static")

employeeObj = Employee()
serviceObj = ClinicService()

sidebarItems = [
    {
        "label": "DASHBOARD",
        "icon": "bi bi-house-door",
        "route": "/admin/",
    },
    {
        "label": "EMPLOYEES",
        "icon": "bi bi-calendar-week",
        "route": "/admin/employees",
    },
    {
        "label": "CLINIC SERVICES",
        "icon": "bi bi-calendar-week",
        "route": "/admin/clinic-rates",
    },
    {
        "label": "CLINIC REPORTS",
        "icon": "bi bi-file-earmark-bar-graph",
        "route": "/admin/reports",
    },
]


@admin.route("/")
def adminDashboard():
    return render_template("dashboard.html", contentTemplate="/adminDashboard.html", sidebarItems=sidebarItems, activeSidebar="DASHBOARD", employees=employeeObj.retrieveEmployees())


@admin.route("/employees")
def employees():
    # if not session.get('_id') and not session.get("role") == "admin":
    #     return redirect("/admin/login")
    return render_template("dashboard.html", contentTemplate="/employees.html", sidebarItems=sidebarItems, activeSidebar="EMPLOYEES", employees=employeeObj.retrieveEmployees())


@admin.route("/clinic-rates")
def clinicRatesDashboard():
    # if not session.get('_id') and not session.get("role") == "admin":
    #     return redirect("/admin/login")
    return render_template("dashboard.html", contentTemplate="/clinic-rates.html", sidebarItems=sidebarItems, activeSidebar="CLINIC SERVICES", services=serviceObj.retrieveClinicServices())


@admin.route("/reports")
def clinicReportsDashboard():
    return render_template("dashboard.html", contentTemplate="/clinic-reports.html",  sidebarItems=sidebarItems, activeSidebar="CLINIC REPORTS")


@admin.route('/patientVisit')
def generatePatientVisitReport():
    reportingMonth = request.args.get("month", None)
    reportingYear = request.args.get("year", None)

    result = patientCheckupTally().get_json()

    result = dict(
        sorted(result.items(), key=lambda item: int(item[0].split("/")[1])))

    if not reportingMonth or not reportingYear or not len(result.keys()) > 0:
        return make_response(jsonify({}), 404)

    dateKeys = list(result.keys())
    datesArray = []
    headers = []
    tempObj = {}
    firstDate = dateKeys[0]
    startingDay = firstDate.split("/")[1]
    idx = 0
    grandTotal = 0
    total = 0
    for date, value in result.items():
        weekday = datetime.datetime.strptime(date, "%m/%d/%Y").isoweekday()
        tempObj[weekday] = value
        total += value
        grandTotal += value
        if weekday == 6:
            tempObj['total'] = total
            datesArray.append(tempObj)
            tempObj = {}
            total = 0

            # attach headers
            headers.append(
                f''' {reportingMonth} {startingDay} - {date.split("/")[1]}, {reportingYear} ''')
            try:
                startingDay = dateKeys[idx + 1].split("/")[1]
            except IndexError:
                continue
        idx += 1
    else:
        tempObj['total'] = total
        datesArray.append(tempObj)
        headers.append(
            f''' {reportingMonth} {startingDay} - {date.split("/")[1]}, {reportingYear} ''')
        startingDay = dateKeys[-1].split("/")[1]

    rendered = render_template(
        'PDF/patientVisitReport.html', month=reportingMonth, year=reportingYear,
        data={'dateRange': headers, 'dates': datesArray, 'grandTotal': grandTotal})
    options = {'enable-local-file-access': None}
    pdf = pdfkit.from_string(rendered, False, options=options)
    response = make_response(pdf)
    response.headers['content-Type'] = 'application/pdf'
    filename = f'report-patientVisit-{reportingMonth}-{reportingYear}.pdf'
    response.headers[
        'content-Disposition'] = 'inline; filename="{}"'.format(filename)
    return response


@admin.route("/clinicServicesTally")
def generateClinicServiceTally():
    reportingMonth = request.args.get("month", None)
    reportingYear = request.args.get("year", None)

    result = clinicServiceTallyWithDates().get_json()
    if not reportingMonth or not reportingYear or not len(result) > 0:
        return make_response(jsonify({}), 404)

    rendered = render_template(
        'PDF/clinicServiceTallyReport.html', month=reportingMonth, year=reportingYear, clinicServices=result['clinicServices'], headers=result['headers'], servicesNameList=result['servicesList'])
    options = {'enable-local-file-access': None}
    pdf = pdfkit.from_string(rendered, False, options=options)
    response = make_response(pdf)
    response.headers['content-Type'] = 'application/pdf'
    filename = f'report-patientVisit-{reportingMonth}-{reportingYear}.pdf'
    response.headers[
        'content-Disposition'] = 'inline; filename="{}"'.format(filename)
    return response


@admin.route("/doctorsCheckupTally")
def generateDoctorsCheckupTally():
    reportingMonth = request.args.get("month", None)
    reportingYear = request.args.get("year", None)

    result = doctorsCheckupTallyWithDates().get_json()
    if not reportingMonth or not reportingYear or not len(result) > 0:
        return make_response(jsonify({}), 404)

    rendered = render_template(
        'PDF/doctorsCheckupTallyReport.html', month=reportingMonth, year=reportingYear, doctors=result['doctors'], headers=result['headers'], doctorsNameList=result['doctorsList'])
    # options = {'enable-local-file-access': None}
    # pdf = pdfkit.from_string(rendered, False, options=options)
    # response = make_response(pdf)
    # response.headers['content-Type'] = 'application/pdf'
    # filename = f'report-patientVisit-{reportingMonth}-{reportingYear}.pdf'
    # response.headers[
    #     'content-Disposition'] = 'inline; filename="{}"'.format(filename)
    # return response

    return rendered
