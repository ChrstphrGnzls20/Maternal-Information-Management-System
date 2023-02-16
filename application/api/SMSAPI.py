from flask import Blueprint, make_response, jsonify, request

import os, json
from ..models.Mdl_sms import SMS

SMSAPI = Blueprint("SMSAPI", __name__)

smsObj = SMS()

@SMSAPI.route("/")
def smsIndex():
    result = smsObj.checkConnection()
    print(result)
    return make_response(jsonify(result))

@SMSAPI.route("/queue", methods=["POST"])
def insertSMSToQueue():
    if request.method == "POST":
        print(request.data)
        toQueue = json.loads(request.data)

        appointmentID = toQueue.get('appointmentID', None)
        patientID = toQueue.get("patientID", None)
        patientName = toQueue.get("patientName", None)
        doctorID = toQueue.get("doctorID", None)
        date = toQueue.get("date", None)

        print(toQueue)
        if appointmentID and patientID and patientName and doctorID and date:
            result = smsObj.createNewScheduledSMS(appointmentID, patientID, patientName, date)
            return make_response(jsonify(result), 200)
        return make_response(jsonify({}),403)

    return make_response(jsonify({}),500)

@SMSAPI.route("/sendSMS", methods=["POST"])
def sendSMS():
    if request.method == "POST":
        payload = json.loads(request.data)
        number = payload["number"]
        message = payload["message"]

        result = smsObj.sendSMS(number, message)
        print(result)
        return make_response(jsonify(result))
    
# TEST
@SMSAPI.route("/test")
def test():
    return make_response(jsonify(smsObj.checkQueue()),200)
