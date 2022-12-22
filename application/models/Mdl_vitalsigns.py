from ..extensions import mongo
from pymongo import ReturnDocument
from datetime import datetime

collection = mongo['VS-queue']


class VitalSigns(object):
    def __init__(self) -> None:
        pass

    def findVitalSigns(self, patientID) -> dict:
        result = collection.find_one(filter={"id": patientID})

        return result

    def addVitalSigns(self, payload: dict) -> dict:
        try:
            payload['createdDate'] = str(datetime.now())
            result = collection.insert_one(payload)
            return result
        except Exception as ex:
            print(ex)
