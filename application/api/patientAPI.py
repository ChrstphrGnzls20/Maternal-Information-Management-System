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
        result = patientObj.findPatient({"_id": patientID})
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

# TODO: BUILD ENDPOINT FOR EDITING PATIENT FOR FUTURE USE
