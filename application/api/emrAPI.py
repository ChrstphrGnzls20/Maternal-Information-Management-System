from flask import Flask, Blueprint, make_response, jsonify, request

emrAPI = Blueprint("emrAPI", __name__)


@emrAPI.route("/<string:checkupID>/<string:category>/<string:subCategory>/<string:subsubCategory>", methods=["GET", "POST"])
@emrAPI.route("/<string:checkupID>/<string:category>/<string:subCategory>", methods=["GET", "POST"])
@emrAPI.route("/<string:checkupID>/<string:category>", methods=["GET", "POST"])
@emrAPI.route("/<string:checkupID>", methods=["GET"])
def index(checkupID: str, category: str = None, subCategory: str = None, subsubCategory: str = None):

    return make_response(jsonify("HELLO"))
