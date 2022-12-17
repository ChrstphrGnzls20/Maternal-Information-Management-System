# models
from ..models.Mdl_patient import Patient

from flask import Blueprint, request, make_response, jsonify
import json

patientAPI = Blueprint('patientAPI', __name__)


# instantiate model
patientObj = Patient()


@patientAPI.route("/<string:patientID>", methods=["GET"])
@patientAPI.route("/", methods=["POST"])
def addOrRetrievePatient(patientID=None):
    # FOR RETRIEVING PATIENT WITH THE GIVEN PATIENT ID
    if request.method == "GET" and patientID:
        limit = int(request.args.get("limit", 0))
        pageNumber = int(request.args.get("page", 0))
        result = patientObj.findPatient(
            {"_id": patientID}, limit=limit, pageNumber=pageNumber)
        if result:
            return make_response(jsonify(result), 201)

    # FOR ADDING NEW PATIENT UPON REGISTRATION
    elif request.method == "POST":
        # save data to db
        data = json.loads(request.data)

        print(json.dumps(data, indent=2))
        result = patientObj.register(data)
        if result:
            return make_response(jsonify(result), 201)
    return make_response(jsonify({"errorMsg": "There was an error processing your request. Please try again later."}, 500))


@patientAPI.route("/<string:patientID>/pmh", methods=["GET"])
def retrievePastMedicalHistory(patientID):
    if request.method == "GET":
        result = patientObj.findPatient(filter={"_id": patientID}, returnFields={
                                        "_id": 0, "patientHistory.pastMedicalHistory": 1})
        if result:
            return make_response(jsonify(result), 201)
    return make_response(jsonify({"errorMsg": "There was an error processing your request. Please try again later."}, 500))


@patientAPI.route("/<string:patientID>/history", methods=["GET", "PATCH"])
def updateOrRetrievePatientHistory(patientID):
    if request.method == "PATCH":
        data: list[dict] = json.loads(request.data)
        # ASSUMING WE NEED TO UPDATE THE WHOLE PATIENT HISTORY
        updateObj = data
        result = patientObj.updatePatientHistory(
            patientID=patientID, updateObject=updateObj)

        if result:
            return make_response(jsonify(result), 201)
        return make_response(jsonify({"errorMsg": "There was an error processing your request. Please try again later."}, 401))

    elif request.method == "GET":
        result = patientObj.findPatient(
            filter={"_id": patientID}, returnFields={"patientHistory": 1})

        if result:
            return make_response(jsonify(result), 201)
        return make_response(jsonify({"errorMsg": "There was an error processing your request. Please try again later."}, 401))
        # TODO: BUILD ENDPOINT FOR EDITING PATIENT FOR FUTURE USE
