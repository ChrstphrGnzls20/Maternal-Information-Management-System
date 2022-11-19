from pymongo import ReturnDocument
from ..extensions import mongo
import json


class Appointment(object):
    def __init__(self) -> None:
        self.dbName = "appointment"

    def retrieveAppointments(self, filter: object = {}) -> json:
        collection = mongo.db[self.dbName]
        resultsArr = []
        results = collection.find(filter)
        for result in results:
            resultsArr.append(result)

        return json.dumps(resultsArr)

    def addAppointment(self, data: dict) -> dict:
        collection = mongo.db[self.dbName]
        collection.insert_one(data)
        return data


'''
    collection.find({_id: patientID})
    _id: patient's _id
    doctor: doctor's _id,
    appointments: [
        {
            date: value,    
            time: value,
            status: Confirmed|Pending|Cancelled
        }
    ]


'''
