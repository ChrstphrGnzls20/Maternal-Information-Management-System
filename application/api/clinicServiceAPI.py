# models
from ..models.Mdl_clinicService import ClinicService

from flask import Blueprint, request, make_response, jsonify
import json

# INSTANTIATE MODEL
clinicServiceObj = ClinicService()

clinicServiceAPI = Blueprint('clinicServiceAPI', __name__)


@clinicServiceAPI.route("/generate-id", methods=["GET"])
def generateServiceID():
    '''
        RETURNS A DICTIONARY WITH SERVICE ID RANDOMLY GENERATED:
        FORMAT: { _id: value }
    '''
    if request.method == "GET":
        result = clinicServiceObj.generateID()
        return make_response(jsonify(result))


@clinicServiceAPI.route("/<int:serviceID>", methods=["GET", "PATCH"])
@clinicServiceAPI.route("/", methods=["GET", "POST"])
def serviceCRUD(serviceID=None):
    '''
        EXPECTS AND RETURNS A DICTIONARY OF SERVICE INFORMATION INSERTED
        FORMAT:
        {
            _id: value,
            name: value,
            description: value,
            price: value,
            status: value
        }
    '''
    if request.method == "GET":
        # FOR RETRIEVING SPECIFIC CLINIC SERVICE USING SERVICEID
        if serviceID:
            print(serviceID)
            result = clinicServiceObj.retrieveClinicServices(
                filter={"_id": serviceID})
        # FOR RETRIEVING ALL CLINIC SERVICE
        else:
            limit = int(request.args.get("limit", 0))
            pageNumber = int(request.args.get("page", 0))
            result = clinicServiceObj.retrieveClinicServices(
                limit=limit, pageNumber=pageNumber)
        return make_response(jsonify(result), 201)

    # FOR ADDING NEW CLINIC SERVICE
    elif request.method == "POST":
        data = json.loads(request.data)
        result = clinicServiceObj.addClinicService(data)
        if result:
            return make_response(jsonify(result), 201)
        return make_response(jsonify(result), 500)

    # FOR UPDATING A CLINIC SERVICE
    elif request.method == "PATCH":
        data = json.loads(request.data)
        result = clinicServiceObj.editClinicService(serviceID, data)
        if result:
            return make_response(jsonify(result), 201)
        return make_response(jsonify(result), 500)
