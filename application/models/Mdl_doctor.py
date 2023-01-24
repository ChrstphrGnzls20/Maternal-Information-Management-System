from pymongo import ReturnDocument
from ..extensions import mongo
import json
import datetime

# IMPORT PATIENT CLASS FOR NEEDED FUNCTIONS
from .Mdl_patient import Patient
from .Mdl_emr import EMR

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
                                         "basicInformation": 1, "assignedDoctor": 1, "lastVisitDate": 1, "status": 1})
        resultArray = []
        for patient in results:
            if 'assignedDoctor' in patient:
                if patient['assignedDoctor'] == doctorID:
                    resultArray.append(patient)
                    continue
            emrObj = EMR()
            patientCheckups = emrObj.retrieveCheckup(
                filter={"patientID": patient['_id']}, returnFields={"HPI": 1, "completedDate": 1})

            mostRecentCheckup = datetime.datetime(1800, 1, 1)
            for checkup in patientCheckups:
                dateOfCheckup = datetime.datetime.fromisoformat(
                    checkup['completedDate'])

                if mostRecentCheckup < dateOfCheckup:
                    mostRecentCheckup = dateOfCheckup

                HPI = checkup['HPI']

                if HPI['checkupType'] == "initial":
                    patient['LMP'] = HPI['LMP']

            if mostRecentCheckup == datetime.datetime(1800, 1, 1):
                mostRecentCheckup = None
            else:
                patient['recentVisit'] = datetime.datetime.strftime(
                    mostRecentCheckup, "%B %d, %Y")
            resultArray.append(patient)

        return resultArray
