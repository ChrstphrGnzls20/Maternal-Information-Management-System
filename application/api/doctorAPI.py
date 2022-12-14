from flask import Flask, Blueprint, make_response, jsonify, request
import json

# MODELS
from ..models.Mdl_doctor import Doctor
from ..models.Mdl_schedule import Schedule


doctorAPI = Blueprint("doctorAPiI", __name__)

# INSTANTIATE MODELS
doctorObj = Doctor()
schedObj = Schedule()


@doctorAPI.route("/<string:doctorID>/patients")
def getAvailablePatients(doctorID):
    availablePatients = doctorObj.availablePatients(doctorID)

    if availablePatients:
        return make_response(jsonify(availablePatients), 200)
    return make_response(jsonify(availablePatients), 500)


@doctorAPI.route("/schedules/<string:doctorID>", methods=["GET", "POST"])
@doctorAPI.route("/schedules", methods=["POST"])
def addOrRetrieveSchedules(doctorID: str = None):
    if request.method == "POST":
        data: list[dict] = json.loads(request.data)

        requiredFields: dict = ['doctorID',
                                "scheduleDate", "startTime", "endTime"]

        if not data:
            return make_response(jsonify("Missing body!"), 400)

        if data:
            resultArray = []
            try:
                for item in data:
                    result = schedObj.addSchedule(item)
                    resultArray.append(result)
                    # if all(hasattr(item, attr) for attr in requiredFields):
                    #     result = schedObj.addSchedule(item)
                    # else:
                    #     return make_response(jsonify("Incomplete attributes!"), 400)
                return make_response(jsonify(resultArray), 200)
            except Exception as err:
                return make_response("An error has occurred: \n" + str(err), 500)
