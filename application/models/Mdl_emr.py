from ..extensions import mongo
import json
import shortuuid


class EMR(object):
    def __init__(self) -> None:
        pass

    @staticmethod
    def getTemplates(filter: dict, fields: dict) -> dict:
        collection = mongo.db.autocomplete
        result = collection.find_one(filter, fields)
        return result


class CarePlan(object):
    def __init__(self) -> None:
        pass

    def generateCarePlanID(self) -> str:
        carePlanID = shortuuid.ShortUUID().random(length=10)
        results = self.getCarePlans(filter={"_id": carePlanID})
        if not len(list(results)):
            return carePlanID
        return self.generateCarePlanID()

    def getCarePlans(self, filter: dict, returnFields: dict = {}) -> list:
        collection = mongo.db["careplan"]
        results = collection.find(filter, returnFields)
        resultsArray = []

        for result in results:
            resultsArray.append(result)

        return resultsArray

    def addCarePlan(self, newCarePlan: dict) -> dict:
        collection = mongo.db["careplan"]

        # ATTACH AUTO GENERATED ID
        newCarePlan["_id"] = self.generateCarePlanID()
        inserted_id = collection.insert_one(newCarePlan).inserted_id

        if inserted_id:
            return newCarePlan

        return None
