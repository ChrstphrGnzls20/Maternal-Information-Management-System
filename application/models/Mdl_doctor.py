from pymongo import ReturnDocument
from ..extensions import mongo
import json

# IMPORT PATIENT CLASS FOR NEEDED FUNCTIONS
from .Mdl_patient import Patient

patientObj = Patient()


class Doctor(object):
    def __init__(self) -> None:
        self.dbName = "doctor"

    # def retrieveDoctors(self, filter: dict = {}, returnFields: dict = {}):
    #     collection = mongo.db[self.dbName]
    #     result = collection.find(filter, returnFields)
    #     resultArray = []
    #     for employee in result:
    #         resultArray.append(employee)
    #     return resultArray

    def availablePatients(self, doctorID: str):
        results = patientObj.findPatient(filter={}, returnFields={
                                         "basicInformation": 1, "assignedDoctor": 1, "lastVisitDate": 1, "monitoringStatus": 1})
        resultArray = []
        for patient in results:
            if 'assignedDoctor' in patient:
                if patient['assignedDoctor'] == doctorID:
                    resultArray.append(patient)
                    continue
            resultArray.append(patient)

        return resultArray
