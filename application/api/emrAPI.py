from flask import Blueprint, Flask, jsonify, make_response, request, render_template
import json
import pdfkit

# MODELS
from ..models.Mdl_emr import EMR, CarePlan
from ..models.Mdl_patient import Patient
from ..models.Mdl_vitalsigns import VitalSigns

emrAPI = Blueprint("emrAPI", __name__)

# INSTANTIATE MODELS
emrObj = EMR()
carePlanObj = CarePlan()


# @emrAPI.route("/<string:checkupID>/<string:category>/<string:subCategory>/<string:subsubCategory>", methods=["GET", "POST"])
# @emrAPI.route("/<string:checkupID>/<string:category>/<string:subCategory>", methods=["GET", "POST"])
# @emrAPI.route("/<string:checkupID>/<string:category>", methods=["GET", "POST"])
# @emrAPI.route("/<string:checkupID>", methods=["GET"])
# def index(checkupID: str, category: str = None, subCategory: str = None, subsubCategory: str = None):

#     return make_response(jsonify("HELLO"))

@emrAPI.route("/", methods=["POST"])
def index():
    if request.method == "POST":
        print(request.data)
        data = json.loads(request.data)
        result = emrObj.addNewCheckup(data)

        if result:
            return make_response(jsonify(result), 200)
        return make_response(jsonify(result), 500)


@emrAPI.route("/<string:patientID>/<string:checkupID>")
@emrAPI.route("/<string:patientID>")
@emrAPI.route("/")
def retrieveCheckup(patientID=None, checkupID=None):
    if request.method == "GET":
        if patientID:
            print(patientID)
            if checkupID == None:
                result = emrObj.retrieveCheckup(
                    filter={"patientID": patientID})
            else:
                result = emrObj.retrieveCheckup(
                    filter={"_id": checkupID, "patientID": patientID})
        # FIXME:
        else:
            emrReturnFields = {
                "assessment.diagnosis": 1,
                "plan.carePlan": 1, "patientID": 1, "completedDate": 1
            }
            patientReturnFields = {"_id": 0, "basicInformation.name": 1,
                                   "basicInformation.mobile": 1, "basicInformation.bday": 1, }
            # patientReturnFields = {
            #     "_id": 0,
            #     "basicInformation": 1
            # }
            resultArray = []
            results = emrObj.retrieveCheckup(
                filter={}, returnFields=emrReturnFields)
            patientObj = Patient()
            for result in results:
                patientID = result['patientID']
                patientInfo = patientObj.findPatient(
                    filter={"_id": patientID}, returnFields=patientReturnFields)[0]

                patientInfo = patientInfo['basicInformation']
                # APPEND NECESSARY DETAILS
                result['patientName'] = patientInfo['name']
                result['bday'] = patientInfo['bday']
                result['mobile'] = patientInfo['mobile']

                resultArray.append(result)
            result = resultArray

        return make_response(jsonify(result), 200)
    return make_response(jsonify(result), 405)


@emrAPI.route("/vital-signs/<string:patientID>", methods=["GET"])
@emrAPI.route("/vital-signs", methods=["POST"])
def addOrRetrieveVitalSigns(patientID: str = None):
    vsObj = VitalSigns()
    if request.method == "POST":
        data = json.loads(request.data)

        result = vsObj.addVitalSigns(data)
        return make_response(jsonify(result), 200)

    elif request.method == "GET" and not patientID:
        result = vsObj.findVitalSigns(patientID=patientID)
        return make_response(jsonify(result), 200)

    return make_response(jsonify({}), 401)


@emrAPI.route("/care-plan/<string:doctorID>/<string:carePlanID>", methods=["GET"])
@emrAPI.route("/care-plan/<string:doctorID>", methods=["GET"])
def getCarePlan(doctorID: str, carePlanID: str = None):
    if request.method == "GET":
        if carePlanID:
            results = carePlanObj.getCarePlans(
                filter={"doctorID": doctorID, "_id": carePlanID})
        else:
            results = carePlanObj.getCarePlans(filter={"doctorID": doctorID})
        return make_response(jsonify(results), 200)
    return make_response(500)


@emrAPI.route("/care-plan", methods=["POST"])
def addCarePlan():
    if request.method == "POST":
        print(request.data)
        data = json.loads(request.data)
        result = carePlanObj.addCarePlan(data)

        if result:
            return make_response(jsonify(result), 200)
        return make_response(500)

# # FOR TESTING
# @emrAPI.route("/editCheckups")
# def editCheckups():
#     emrObj.editInitialCheckups()

#     return make_response(jsonify("SUCCESS"), 200)

# @emrAPI.route("/editPrescription")
# def editPrescription():
#     emrObj.editPrescription()

#     return make_response(jsonify("SUCCESS"), 200)