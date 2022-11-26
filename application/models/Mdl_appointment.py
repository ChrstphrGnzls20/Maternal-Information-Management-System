from pymongo import ReturnDocument
from ..extensions import mongo
import json
import shortuuid
from datetime import datetime
import pytz

# DOCTOR MODEL FOR RETRIEVING DOCTOR'S INFORMATION
from .Mdl_doctor import Doctor

# INSTANTIATE MODEL
# employeeObj = Employee()


class Appointment(object):
    def __init__(self) -> None:
        self.dbName = "appointment"

    def generateAppointmentID(self) -> str:
        appointmentID = shortuuid.ShortUUID().random(length=15)
        results = self.retrieveAppointments(filter={"_id": appointmentID})
        print(results)
        if not len(list(results)):
            return appointmentID
        return self.generateAppointmentID()

    def retrieveAppointments(self, filter: dict = {}, returnFields: dict = {}) -> list:
        collection = mongo.db[self.dbName]
        resultsArr = []
        results = collection.find(filter, returnFields)
        for result in results:
            resultsArr.append(result)

        return resultsArr

    def getAvailableClinicians(self) -> list:
        collection = mongo.db.employee
        results = collection.find(
            {"role": "doctor", "status": "active"}, {"_id": 1, "name": 1})
        resultArr = []
        for result in results:
            resultArr.append(result)
        print(resultArr)
        return resultArr

    def addAppointment(self, data: dict) -> dict:
        collection = mongo.db[self.dbName]
        data["_id"] = self.generateAppointmentID()
        data["createdDate"] = str(datetime.now().isoformat())
        data["status"] = "pending"
        collection.insert_one(data)
        return data

    def cancelAppointment(self, appointmentID: str) -> dict:
        collection = mongo.db[self.dbName]
        try:
            result = collection.find_one_and_update(
                {"_id": appointmentID}, {"$set": {"status": "cancelled"}}, return_document=ReturnDocument.AFTER)
        except Exception:
            result = {}
        finally:
            return result


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
