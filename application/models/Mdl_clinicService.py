from pymongo import ReturnDocument
from ..extensions import mongo
import json
from passlib.hash import sha256_crypt
import random

# TODO: the below class is the updated format for models, edit all other classes/models to be consistent when responding/returning data


class ClinicService(object):
    def __init__(self):
        self._id = ""
        self.dbName = "clinicService"

    def generateID(self) -> dict:
        self._id = random.randrange(100000, 999999)
        results = self.retrieveClinicServices(filter={"_id": self._id})
        if not len(list(results)):
            return json.loads(json.dumps({"_id": self._id}))
        return self.generateID()

    def retrieveClinicServices(self, filter: object = {}) -> list:
        collection = mongo.db[self.dbName]
        # returnFields = {"_id": 0}
        resultArray = []
        # results = collection.find({}, returnFields)
        results = collection.find(filter)
        # results = collection.find(filter, returnFields)
        for result in results:
            resultArray.append(result)
        return resultArray

    def addClinicService(self, data: dict) -> dict:
        collection = mongo.db[self.dbName]
        data["_id"] = self._id
        collection.insert_one(data)
        return data

    def editClinicService(self, serviceID: int, newData: dict) -> dict:
        collection = mongo.db[self.dbName]
        newData["_id"] = serviceID
        # the function called returns an array with exactly one item
        prevData = self.retrieveClinicServices(filter={"_id": serviceID})[0]
        updateQuery = {}
        if not prevData:
            return {}
        for key in newData.keys():
            if (newData[key] != prevData[key]):
                updateQuery[key] = newData[key]

        try:
            result = collection.find_one_and_update(
                {"_id": serviceID}, {"$set": json.loads(json.dumps(updateQuery))}, return_document=ReturnDocument.AFTER)
            # structuredData = {"code": "SUCCESS",
            #   "data": json.loads(json.dumps(result))}
            return json.loads(json.dumps(result))
        except Exception:
            # return {"code": "FAILED TO UPDATE"}
            return {}
