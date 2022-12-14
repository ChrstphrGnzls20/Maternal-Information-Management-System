from flask import Blueprint, Flask, jsonify, make_response, request, render_template
import json
import pdfkit

# MODELS
from ..models.Mdl_emr import EMR, CarePlan

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
def retrieveCheckup(patientID, checkupID=None):
    if request.method == "GET":
        print(patientID)
        if checkupID == None:
            result = emrObj.retrieveCheckup(filter={"patientID": patientID})
        else:
            result = emrObj.retrieveCheckup(
                filter={"_id": checkupID, "patientID": patientID})

        return make_response(jsonify(result), 200)
    return make_response(jsonify(result), 405)


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


@emrAPI.route("/getPDF")
def getPDF():
    config = pdfkit.configuration(
        wkhtmltopdf="D:\\wkhtmltopdf\\bin\\wkhtmltopdf.exe")
    html = render_template("prescription-pdf.html", name="WAYNE", age="21")

    pdf = pdfkit.from_string(html, False, configuration=config)
    response = make_response(pdf)
    response.headers['content-Type'] = 'application/pdf'
    response.headers['content-Disposition'] = 'inline: filename=hello.pdf'
    return response
