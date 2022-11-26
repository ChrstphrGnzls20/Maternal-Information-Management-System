from flask import Blueprint, jsonify, make_response, render_template, request, session, redirect

import json

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
        "route": "/admin/dashboard/",
    },
    {
        "label": "EMPLOYEES",
        "icon": "bi bi-calendar-week",
        "route": "/admin/",
    },
    {
        "label": "CLINIC SERVICES",
        "icon": "bi bi-calendar-week",
        "route": "/admin/clinic-rates",
    },
]


# @admin.route("/admin/dashboard/employee")
# NOTE: use above, below is for testing only
@admin.route("/")
def dashboard():
    # if not session.get('_id') and not session.get("role") == "admin":
    #     return redirect("/admin/login")
    return render_template("dashboard.html", contentTemplate="/employees.html", sidebarItems=sidebarItems, activeSidebar="EMPLOYEES", employees=employeeObj.retrieveEmployees())


@admin.route("/clinic-rates")
def clinicRatesDashboard():
    # if not session.get('_id') and not session.get("role") == "admin":
    #     return redirect("/admin/login")
    return render_template("dashboard.html", contentTemplate="/clinic-rates.html", sidebarItems=sidebarItems, activeSidebar="CLINIC SERVICES", services=serviceObj.retrieveClinicServices())

#####################
#
# APIs
#
#####################

#####################
#
# EMPLOYEE
#
#####################


# @admin.route("/employee", methods=["GET", "POST"])
# def addOrRetrieveEmployee():
#     if request.method == "POST":
#         """
#             NOTE: Response structure:
#             - SUCCESS:
#             {
#                 code: "SUCCESS",
#                 data: {
#                     //inserted data
#                 }
#             }
#             - EXISTS:
#             {
#                 code: "EXISTS"
#             }
#         """
#         data = json.loads(request.data)
#         result = employeeObj.addEmployee(data)
#         if result['code'] == "EXISTS":
#             return make_response(jsonify(result), 500)
#         del data['_id']
#         result['data'] = data
#         return make_response(jsonify(result), 201)
#     else:
#         """
#             NOTE: Response structure:
#             [
#                 {
#                     "email": "sdfsdf@gmail.com",
#                     "fName": "Ron",
#                     "lName": "Marcos",
#                     "licenseID": "111111",
#                     "mName": "Carl",
#                     "mobile": "09123456789",
#                     "pwd": "123123",
#                     "pwd2": "123123",
#                     "role": "Secretary",
#                     "status": "Active"
#                 },
#                 ...
#             ]
#         """
#         result = employeeObj.retrieveEmployees()
#         print(json.dumps(result, indent=4))
#         return make_response(jsonify(result), 201)

# # TODO: fix API endpoint to make more generic


# @admin.route("/employee/search", methods=["POST"])
# def searchSpecificEmployees():
#     if request.method == "POST":
#         """
#             NOTE: Response structure:
#             [
#                 {
#                     "code": "SUCCESS",
#                     "data": {
#                         "email": "sdfsdf@gmail.com",
#                         "fName": "Ron",
#                         "lName": "Marcos",
#                         "licenseID": "111111",
#                         "mName": "Carl",
#                         "mobile": "09123456789",
#                         "pwd": "123123",
#                         "pwd2": "123123",
#                         "role": "Secretary",
#                         "status": "Active"
#                     }
#                 },
#                 ...
#             ]
#         """
#         filter = json.loads(request.data)

#         try:
#             if filter["role"] and filter["role"] == "All":
#                 del filter["role"]
#             result = employeeObj.retrieveEmployeesWithFilter(filter)
#         except Exception:
#             print(filter)
#             result = employeeObj.retrieveEmployeesWithFilter(filter)
#         return make_response(jsonify(result), 201)


# @admin.route("/employee/category/<category>", methods=["GET"])
# def searchEmployeesByCategory(category):
#     if request.method == "GET":
#         """
#             NOTE: Response structure:
#             {
#                 "code": "SUCCESS",
#                 "data": [
#                     {
#                         "email": "sdfsdf@gmail.com",
#                         "fName": "Ron",
#                         "lName": "Marcos",
#                         "licenseID": "111111",
#                         "mName": "Carl",
#                         "mobile": "09123456789",
#                         "pwd": "123123",
#                         "pwd2": "123123",
#                         "role": "Secretary",
#                         "status": "Active"
#                     },
#                     ...
#                 ]
#             }
#         """
#         if category == "All":
#             result = employeeObj.retrieveEmployeesWithFilter()
#         else:
#             result = employeeObj.retrieveEmployeesWithFilter(
#                 {"role": category})
#         return make_response(jsonify(result), 201)


# @admin.route("/employee/edit/<licenseID>", methods=["PATCH"])
# def editEmployee(licenseID):
#     # TODO: update employee by the POSTED data
#     if request.method == "PATCH":
#         """
#             NOTE: Response structure:
#             - SUCCESS
#             {
#                 "code": "SUCCESS"
#                 "data": {
#                     "email": "sdfsdf@gmail.com",
#                     "fName": "Ron",
#                     "lName": "Marcos",
#                     "licenseID": "111111",
#                     "mName": "Carl",
#                     "mobile": "09123456789",
#                     "pwd": "123123",
#                     "pwd2": "123123",
#                     "role": "Secretary",
#                     "status": "Active"
#                 }
#             }

#             - NOT FOUND
#             {
#                 "code": "SUCCESS"
#             }

#             - FAILED TO UPDATE
#             {
#                 "code": "FAILED TO UPDATE"
#             }
#         """
#         print(request.data)
#         data = json.loads(request.data)
#         result = employeeObj.editEmployee(licenseID, data)
#         return make_response(jsonify(result), 201)

#####################
#
# SERVICE
#
#####################
# TODO: the below endpoints are the updated endpoints format, edit all other endpoints to be consistent when responding/returning data

# NOTE: ALL ENDPOINTS MUST RESPOND EITHER [] or [...data]
# NOTE: HANDLE ERRORS WHEN RETRIEVING DATA (e.g. NO DATA RETURNED) IN THE FRONTEND


# @admin.route("/clinic-service/api/generateID", methods=["GET"])
# def generateServiceID():
#     '''
#         RETURNS A DICTIONARY WITH SERVICE ID RANDOMLY GENERATED:
#         FORMAT: { _id: value }
#     '''
#     if request.method == "GET":
#         result = serviceObj.generateID()
#         return make_response(jsonify(result))


# @admin.route("/clinic-service/api/add", methods=["POST"])
# def addService():
#     '''
#         EXPECTS AND RETURNS A DICTIONARY OF SERVICE INFORMATION INSERTED
#         FORMAT:
#         {
#             _id: value,
#             name: value,
#             description: value,
#             price: value,
#             status: value
#         }
#     '''
#     if request.method == "POST":
#         data = json.loads(request.data)
#         result = serviceObj.addClinicService(data)
#         return make_response(jsonify(result), 201)


# '''EXPECTS AN INTEGER SPECIFYING SERVICE ID TO FIND'''


# @admin.route("/clinic-service/api/<int:serviceID>", methods=["GET"])
# @admin.route("/clinic-service/api/", methods=["GET"])
# def retrieveClinicService(serviceID=None):
#     '''
#         RETURNS A DICTIONARY WITH THE SERVICE INFORMATION

#         FORMAT:
#         {
#             _id: value,
#             name: value,
#             description: value,
#             price: value,
#             status: value
#         }
#     '''
#     if request.method == "GET":
#         if serviceID:
#             result = serviceObj.retrieveClinicServices(
#                 filter={"_id": serviceID})
#         else:
#             result = serviceObj.retrieveClinicServices()
#         return make_response(jsonify(result), 201)


# '''EXPECTS AN INTEGER SPECIFYING SERVICE ID TO FIND'''


# @admin.route("/clinic-service/api/<int:serviceID>/edit", methods=["PATCH"])
# def editService(serviceID):
#     '''
#         RETURNS A DICTIONARY WITH THE UPDATED SERVICE INFORMATION
#         FORMAT:
#         {
#             _id: value,
#             name: value,
#             description: value,
#             price: value,
#             status: value
#         }
#     '''
#     if request.method == "PATCH":
#         data = json.loads(request.data)
#         result = serviceObj.editClinicService(serviceID, data)
#         print(result)
#         return make_response(jsonify(result), 201)
