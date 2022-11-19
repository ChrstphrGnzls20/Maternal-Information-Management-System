from flask import Blueprint, jsonify, make_response, render_template, request, session, redirect

import json

# models
from ..models.Mdl_emr import EMR

emr = Blueprint('emr',  __name__, template_folder="templates",
                static_folder="static")

emrObj = EMR()


@emr.route("/")
def dashboard():
    return render_template("emr.html")


@emr.route("/<htmlFileName>", methods=["GET"])
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
