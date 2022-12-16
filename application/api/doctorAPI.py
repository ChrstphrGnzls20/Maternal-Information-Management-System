from flask import Flask, Blueprint, make_response, jsonify, request
import json

# MODELS
from ..models.Mdl_doctor import Doctor
from ..models.Mdl_schedule import Schedule
from ..models.Mdl_emr import EMR
from ..models.Mdl_employee import Employee


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


@doctorAPI.route("/schedules/<string:id>", methods=["GET", "POST", "PATCH"])
@doctorAPI.route("/schedules", methods=["GET", "POST"])
def addOrRetrieveSchedules(id: str = None):
    if request.method == "POST":
        data: list[dict] = json.loads(request.data)

        requiredFields: list = ['doctorID',
                                "start", "end"]

        if not data:
            return make_response(jsonify("Missing body!"), 400)

        if data:
            resultArray = []
            try:
                for item in data:
                    if all(attr in item for attr in requiredFields):
                        result = schedObj.addSchedule(item)
                        resultArray.append(result)

                    else:
                        return make_response(jsonify("Incomplete information!"), 400)
                return make_response(jsonify(resultArray), 200)
            except Exception as err:
                return make_response("An error has occurred: \n" + str(err), 500)

    elif request.method == "GET":
        if id:
            result = schedObj.findSchedule(filter={"doctorID": id})
        else:
            result = schedObj.findSchedule()
        return make_response(jsonify(result), 200)

    elif request.method == "PATCH":
        data: list[dict] = json.loads(request.data)

        if not data:
            return make_response(jsonify("Missing body!"), 400)

        try:
            result = schedObj.editSchedule(id, data)

            return make_response(jsonify(result), 200)
        except Exception as err:
            return make_response("An error has occurred: \n" + str(err), 500)
