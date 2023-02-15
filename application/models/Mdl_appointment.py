from pymongo import ReturnDocument
from ..extensions import mongo
import json
import shortuuid
from datetime import datetime
import pytz

# DOCTOR MODEL FOR RETRIEVING DOCTOR'S INFORMATION
from .Mdl_patient import Patient
from .Mdl_employee import Employee
from .Mdl_sms import SMS

# INSTANTIATE MODEL
doctorObj = Employee()
patientObj = Patient()
smsObj = SMS()

collection = mongo['appointment']


class Appointment(object):
    def __init__(self) -> None:
        self.dbName = "appointment"
        self.appointmentPerPage = 5  # FOR PAGINATION

    def generateAppointmentID(self) -> str:
        appointmentID = shortuuid.ShortUUID().random(length=15)
        results = self.retrieveAppointments(filter={"_id": appointmentID})
        print(results)
        if not len(list(results)):
            return appointmentID
        return self.generateAppointmentID()

    def retrieveAppointments(self, filter: dict = {}, returnFields: dict = {}, limit: int = 0, pageNumber: int = 0, sort: tuple = ("_id", 1)) -> list:
        # collection = mongo.db[self.dbName]
        resultsArr = []
        results = collection.find(filter, returnFields).sort(sort[0], sort[1]).skip(
            ((pageNumber - 1) * self.appointmentPerPage) if pageNumber > 0 else 0).limit(limit)
        for result in results:
            # ATTACH DOCTOR'S NAME
            doctorID: str = result["doctor_id"]
            assignedDoctor = doctorObj.retrieveEmployees(
                filter={"_id": doctorID}, returnFields={"name": 1})[0]
            result['doctor_name'] = assignedDoctor['name']

            # ATTACH PATIENT'S NAME
            patientID: str = result["patient_id"]
            patient = patientObj.findPatient(filter={"_id": patientID}, returnFields={
                                             "basicInformation.name": 1})[0]
            # print(patient['basicInformation']['name'])
            result['patient_name'] = patient['basicInformation']['name']

            resultsArr.append(result)
        return resultsArr

    def getAvailableClinicians(self) -> list:
        # collection = mongo.db.employee
        collection = mongo['employee']

        results = collection.find(
            {"role": "doctor", "status": "active"}, {"_id": 1, "name": 1})
        resultArr = []
        for result in results:
            resultArr.append(result)
        print(resultArr)
        return resultArr

    def addAppointment(self, data: dict) -> dict:
        # collection = mongo.db[self.dbName]
        data["_id"] = self.generateAppointmentID()
        data["createdDate"] = str(datetime.now().isoformat())
        data["status"] = "pending"
        collection.insert_one(data)
        return data

    # def addFollowupAppoinment(self, data: dict) -> dict:
    #     collection = mongo.db[self.dbName]
    #     data["_id"] = self.generateAppointmentID()
    #     data["createdDate"] = str(datetime.now().isoformat())
    #     data["status"] = "accepted"
    #     collection.insert_one(data)
    #     return data

    def editAppointment(self, appointmentID: str, payload: dict) -> dict:
        # collection = mongo.db[self.dbName]
        try:
            # INSERT EXTRA INFORMATION
            print(payload)
            payload['additionalInfo']['dateModified'] = str(
                datetime.now().isoformat())
            result = collection.find_one_and_update(
                {"_id": appointmentID}, {"$set": payload}, return_document=ReturnDocument.AFTER)
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
