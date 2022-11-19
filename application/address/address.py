import requests
import json
from flask import Blueprint, render_template, request, make_response, jsonify, session, redirect


#import auth
# from . import auth

#import models
from application.models.Mdl_address import Address

addressObj = Address()

address = Blueprint('address', __name__)


@address.route("/<string:addressType>/<string:addressValue>/<string:addressToGet>")
@address.route("/<string:addressType>/<string:addressValue>")
@address.route("/<string:addressType>")
def addressAPI(addressType, addressValue=None, addressToGet=None):
    addressType = addressType.lower()

    exactKeys = [{"regions": "regCode"}, {"provinces": "provCode"}, {
        "cities": "citymunCode"}, {"barangays": "brgyCode"}]

    filterValue = ""

    if addressValue and addressToGet:
        for item in exactKeys:
            (key, value), = list(item.items())
            if key == addressType:
                filterValue = value
                break

        results = addressObj.getSpecific(
            addressToGet, filterValue, addressValue)

        print(results)
    elif addressValue and not addressToGet:
        print("Hello")
        for item in exactKeys:
            (key, value), = list(item.items())
            print(key, value)
            if key == addressType:
                filterValue = value
                break

        results = addressObj.getAllWithFilter(
            addressType, filterValue, addressValue)

    else:
        results = addressObj.getAll(addressType)

    # return "SUCCESS RESPONSE"
    return make_response(results, 201)
