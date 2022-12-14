from flask import Flask, Blueprint, make_response, jsonify

# MODELS
from ..models.Mdl_doctor import Doctor

doctorAPI = Blueprint("doctorAPiI", __name__)

# INSTANTIATE MODELS
doctorObj = Doctor()


@doctorAPI.route("/<string:doctorID>/patients")
def getAvailablePatients(doctorID):
    availablePatients = doctorObj.availablePatients(doctorID)

    if availablePatients:
        return make_response(jsonify(availablePatients), 200)
    return make_response(jsonify(availablePatients), 500)
