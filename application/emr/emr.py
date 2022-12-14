from flask import Blueprint, jsonify, make_response, render_template, request

import json

import pdfkit

# models
from ..models.Mdl_emr import EMR, SOAPParser

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
        soapObj = SOAPParser(data)
        # INTERPRETATION BEGINS
        headers = soapObj.fillSOAPHeader()
        vitals = soapObj.interpretVitalSigns()
        subjective = soapObj.interpretSubjective()
        objective = soapObj.interpretObjective()
        assessment = soapObj.interpretAssessment()
        plan = soapObj.interpretPlan()

        print(json.dumps(objective, indent=2))

        # rendered = render_template(
        #     "SOAP.html", headers=headers, vitals=vitals, subjective=subjective, HPI=subjective['HPI'], generalPE=objective['general PE'], assessment=assessment, plan=plan)
        rendered = render_template(
            "SOAP.html", headers=headers, vitals=vitals, subjective=subjective, objective=objective, assessment=assessment, plan=plan)
        pdf = pdfkit.from_string(rendered, False)
        response = make_response(pdf)
        response.headers['content-Type'] = 'application/pdf'
        response.headers['content-Disposition'] = f"inline: filename='{data['_id']}'.pdf"
        return response

        return rendered
