from flask import Blueprint, Flask, jsonify, make_response, request
import json

# MODELS
from ..models.Mdl_emr import EMR, CarePlan

emrAPI = Blueprint("emrAPI", __name__)

# INSTANTIATE MODELS
emrObj = EMR()
carePlanObj = CarePlan()


@emrAPI.route("/<string:checkupID>/<string:category>/<string:subCategory>/<string:subsubCategory>", methods=["GET", "POST"])
@emrAPI.route("/<string:checkupID>/<string:category>/<string:subCategory>", methods=["GET", "POST"])
@emrAPI.route("/<string:checkupID>/<string:category>", methods=["GET", "POST"])
@emrAPI.route("/<string:checkupID>", methods=["GET"])
def index(checkupID: str, category: str = None, subCategory: str = None, subsubCategory: str = None):

    return make_response(jsonify("HELLO"))


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
