from pymongo import ReturnDocument
from ..extensions import mongo
import json


class Address(object):
    def __init__(self):
        pass

    @staticmethod
    def getAll(addressType: str) -> json:
        # collection = mongo.db[addressType]
        collection = mongo[addressType]
        resultsArr = []
        results = collection.find({}, {"_id": 0})
        for result in results:
            resultsArr.append(result)

        return json.dumps(resultsArr)

    @staticmethod
    def getAllWithFilter(addressType, key, value):
        # collection = mongo.db[addressType]
        collection = mongo[addressType]

        resultsArr = []
        results = collection.find({key: value}, {"_id": 0})

        try:
            for result in results:
                resultsArr.append(result)
            return json.dumps(resultsArr)
        except Exception:
            resultsArr.append(result)
            return json.dumps(result)

    @staticmethod
    def getSpecific(addressType, key, value):
        print(addressType, key, value)
        # collection = mongo.db[addressType]
        collection = mongo[addressType]

        resultsArr = []
        results = collection.find({key: value}, {"_id": 0})

        try:
            for result in results:
                resultsArr.append(result)
            return json.dumps(resultsArr)
        except Exception:
            resultsArr.append(result)
            return json.dumps(result)
