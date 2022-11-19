from ..extensions import mongo
import json


class EMR(object):
    def __init__(self) -> None:
        pass

    @staticmethod
    def getTemplates(filter: dict, fields: dict) -> dict:
        collection = mongo.db.autocomplete
        result = collection.find_one(filter, fields)
        return result
