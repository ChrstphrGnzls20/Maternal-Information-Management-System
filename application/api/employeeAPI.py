# models
from ..models.Mdl_employee import Employee
# from ..models.Mdl_doctor import Doctor
# from ..models.Mdl_secretary import Secretary

from flask import Blueprint, request, make_response, jsonify
import json

# INSTANTIATE MODEL
# doctorObj = Doctor()
# secretaryObj = Secretary()
employeeObj = Employee()

employeeAPI = Blueprint('employeeAPI', __name__)

# 127.0.0.1:5000/api/employees?role=doctor


@employeeAPI.route("/<string:employeeID>", methods=["GET", "PATCH"])
@employeeAPI.route("/", methods=["GET", "POST"])
def employeeCRUD(employeeID: str = None):
    name: str = request.args.get("name", "")
    role: str = request.args.get("role", "")
    filter: dict = {"role": {"$regex": role, "$options": "i"},
                    "name": {"$regex": name, "$options": "i"}}
    returnFields: dict = {"pwd": 0, "email": 0}

    # FOR RETRIEVING ALL EMPLOYEES (WITH OR WITHOUT ROLE)
    if request.method == "GET" and not employeeID:
        limit = int(request.args.get("limit", 0))
        pageNumber = int(request.args.get("page", 0))
        result = employeeObj.retrieveEmployees(
            filter=filter, returnFields=returnFields, limit=limit, pageNumber=pageNumber)
        print(result)
        return make_response(jsonify(result), 201)

    elif employeeID:
        # FOR RETRIEVING SPECIFIC EMPLOYEE USING EMPLOYEE ID
        if request.method == "GET":
            additionalFilter = {"_id": employeeID}
            filter = {**filter, **additionalFilter}
            result = employeeObj.retrieveEmployees(
                filter=filter, returnFields=returnFields)

        # FOR UPDATING AN EMPLOYEE'S INFORMATION GIVEN THE EMPLOYEE ID
        elif request.method == "PATCH":
            data = json.loads(request.data)
            result = employeeObj.editEmployee(_id=employeeID, updatedData=data)

        return make_response(jsonify(result), 201)

    # FOR ADDING NEW EMPLOYEE
    elif request.method == "POST":
        data = json.loads(request.data)
        result = employeeObj.addEmployee(data)
        print(result)
        # if result['code'] == "EXISTS":
        #     return make_response(jsonify(result), 500)
        # del data['_id']
        # result['data'] = data
        if result:
            return make_response(jsonify(result), 201)
        return make_response(jsonify(result), 409)

        # doctors = doctorObj.retrieveDoctors(
        #     filter={"name": {"$regex": name, "$options": "i"}}, returnFields={"pwd": 0, "email": 0})
        # secretaries = secretaryObj.retrieveSecretaries(
        #     filter={"name": {"$regex": name, "$options": "i"}}, returnFields={"pwd": 0, "email": 0})
        # employeesArray = [*doctors, *secretaries]
        # return make_response(jsonify(employeesArray), 201)
    return make_response(jsonify([], 500))
