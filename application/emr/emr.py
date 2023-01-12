from flask import Blueprint, jsonify, make_response, render_template, request

import json


# models
from ..models.Mdl_emr import EMR, SOAPParser, generatePrescription, generateChargingForm
from ..models.Mdl_patient import Patient
from ..models.Mdl_employee import Employee

emr = Blueprint('emr',  __name__, template_folder="templates",
                static_folder="static")

emrObj = EMR()


@emr.route("/<string:id>")
def dashboard(id):
    return render_template("emr.html")


@emr.route("/template/<htmlFileName>", methods=["GET"])
def serve_html(htmlFileName):
    try:
        toServe = render_template(f"{htmlFileName}.html")
    except Exception:
        toServe = "No template found"
    return make_response(jsonify(toServe), 201)


@emr.route("/add", methods=["POST"])
def save():
    pass
    '''
        appointmentKey (date)
        category(e.g. vital-signs, HPI, etc.)
        data -> {}
        status (e.g complete, draft)

        2022-11-13: {
            vital-signs: {

            },
            HPI: {

            },

            labTestResults: {
                CBC: <file>
            }
        }
    '''


@emr.route("/getTemplates", methods=["POST"])
def getTemplates():
    if request.method == "POST":
        request_data = json.loads(request.data)
        doctorId = request_data["doctorId"]
        category = request_data["category"]
        templates = emrObj.getTemplates(
            filter={"doctor_id": doctorId}, fields={"_id": 0, "templates": 1})
        return make_response(jsonify({"data": templates["templates"][category]}), 201)


@emr.route("/SOAP/<string:checkupID>")
def SOAP(checkupID: str):
    if request.method == "GET":
        data: list = emrObj.retrieveCheckup(filter={"_id": checkupID})

        if not data:
            return make_response("No checkup found", 404)

        data: dict = data[0]
        patientObj = Patient()
        patientID: str = data['patientID']
        # GET HISTORY
        patientHistory: dict = patientObj.findPatient(
            filter={'_id': patientID}, returnFields={"_id": 0, "patientHistory": 1})[0]
        patientHistory = patientHistory['patientHistory']
        # ATTACH HISTORY
        data['patientHistory'] = patientHistory
        soapObj = SOAPParser(data)
        SOAPPdf = soapObj.generatePDF()
        return SOAPPdf


@emr.route("/prescription/<string:checkupID>")
def issuePrescription(checkupID):
    if request.method == "GET":
        data: list[dict] = emrObj.retrieveCheckup(filter={"_id": checkupID}, returnFields={
                                                  "plan": 1, "patientID": 1, "doctorID": 1, "completedDate": 1, "assessment.diagnosis": 1})

        if not data:
            return make_response("No checkup found", 404)

        data = data[0]

        dateCreated = data['completedDate']

        patientObj = Patient()
        patientBasicInformation = patientObj.findPatient(
            filter={"_id": data['patientID']}, returnFields={"basicInformation.name": 1, "basicInformation.bday": 1, "basicInformation.mobile": 1, "basicInformation.address": 1})

        if not patientBasicInformation:
            return make_response("Cannot find patient information", 404)

        patientBasicInformation = patientBasicInformation[0]['basicInformation']

        doctorObj = Employee()
        doctorInformation = doctorObj.retrieveEmployees(
            filter={"_id": data['doctorID']}, returnFields={"name": 1})

        if not doctorInformation:
            return make_response("Cannot find doctor information", 404)

        doctorInformation = doctorInformation[0]

        # FIXME:
        # return generatePrescription(data, patientBasicInformation[])
        prescription = generatePrescription(
            data, patientBasicInformation, doctorInformation, dateCreated)

        return prescription


@emr.route("/chargingForm/<string:checkupID>")
def issueChargingForm(checkupID):
    if request.method == "GET":
        data: list[dict] = emrObj.retrieveCheckup(filter={"_id": checkupID}, returnFields={
            "patientID": 1, "doctorID": 1, "completedDate": 1, "servicesPerformed": 1})

        if not data:
            return make_response("No checkup found", 404)

        data = data[0]

        dateCreated = data['completedDate']

        patientObj = Patient()
        patientBasicInformation = patientObj.findPatient(
            filter={"_id": data['patientID']}, returnFields={"basicInformation.name": 1, })

        if not patientBasicInformation:
            return make_response("Cannot find patient information", 404)

        patientBasicInformation = patientBasicInformation[0]['basicInformation']

        doctorObj = Employee()
        doctorInformation = doctorObj.retrieveEmployees(
            filter={"_id": data['doctorID']}, returnFields={"name": 1})

        if not doctorInformation:
            return make_response("Cannot find doctor information", 404)

        doctorInformation = doctorInformation[0]

        result = generateChargingForm(
            data['servicesPerformed'], patientInfo=patientBasicInformation, doctorInfo=doctorInformation, dateCreated=dateCreated)

        return result
