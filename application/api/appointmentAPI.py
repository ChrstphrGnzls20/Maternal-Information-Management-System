# models
from ..models.Mdl_patient import Patient
from ..models.Mdl_appointment import Appointment

from flask import Blueprint, request, make_response, jsonify
import json

# instantiate model
patientObj = Patient()
appointmentObj = Appointment()

appointmentAPI = Blueprint('appointmentAPI', __name__)


@appointmentAPI.route("/<string:entity>/<string:userID>/<string:appointmentID>", methods=["GET", "PATCH"])
@appointmentAPI.route("/<string:entity>/<string:userID>", methods=["GET"])
def getAppointments(entity: str, userID: str, appointmentID: str = None):
    # IF USER IS NOT PATIENT NOR DOCTOR, THROWS A 401(UNAUTHORIZED) HTTP ERROR
    if entity not in ["patient", "doctor"]:
        return make_response(jsonify([]), 401)
    filterKey: str = f"{entity}_id"

    # FOR RETRIEVING ALL APPOINTMENTS THAT BELONGS TO A SPECIFIC USER
    if request.method == "GET":
        if not appointmentID:
            return make_response(appointmentObj.retrieveAppointments(filter={filterKey: userID}), 201)
        return make_response(appointmentObj.retrieveAppointments(filter={filterKey: userID, "_id": appointmentID}), 201)
    elif request.method == "PATCH":
        return make_response(jsonify("HELLO"))


@appointmentAPI.route("/", methods=["POST"])
def addAppointment():
    '''
        EXPECTS AND RETURNS A DICTIONARY OF SERVICE INFORMATION INSERTED
        FORMAT:
        {
            _id: autogenerated, 
            doctor_id: value,
            patient_id: value,
            date: value,
            time: value,
            createdDate: value,
        }
    '''
    if request.method == "POST":
        data = json.loads(request.data)
        result = appointmentObj.addAppointment(data)
        print(result)
        if result:
            return make_response(jsonify(result))

# TODO: CANCEL APPOINTMENT


@appointmentAPI.route("/<string:appointmentID>/cancel", methods=["PATCH"])
def cancelAppointment(appointmentID):
    if request.method == "PATCH":
        result = appointmentObj.cancelAppointment(appointmentID=appointmentID)
        if result:
            return make_response(jsonify(result), 201)
        return make_response(jsonify(result), 404)
