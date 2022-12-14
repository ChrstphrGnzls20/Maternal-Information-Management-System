from ..extensions import mongo
import json
import shortuuid
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
import re

# IMPORT NEEDED MODELS
from .Mdl_employee import Employee
from .Mdl_patient import Patient


class SOAPParser(object):
    def __init__(self, data: list) -> None:
        self.data = data

    # HELPERS
    @staticmethod
    def camelToSentenceCase(string: str) -> str:
        if string:
            result = re.sub('([A-Z])', r' \1', string)
            # return result[:1].upper() + result[1:].lower()
            return result.lower()
        return ""

    @staticmethod
    def calculateAge(bday: datetime) -> int:
        now = datetime.utcnow()
        now = now.date()

        parsedBday = datetime.strptime(bday, "%m/%d/%Y")

        # Get the difference between the current date and the birthday
        age = relativedelta(now, parsedBday)
        age = age.years

        return age

    def fillSOAPHeader(self):
        resultObject = {}
        try:
            completedDate = self.data['completedDate']
            doctorID = str(self.data['doctorID'])
            patientID = self.data['patientID']

            docObj = Employee()
            provider = docObj.retrieveEmployees(
                filter={"_id": doctorID}, returnFields={"_id": 0, "name": 1})[0]
            provider = provider['name']

            patientObj = Patient()
            patient = patientObj.findPatient(filter={"_id": patientID}, returnFields={
                "_id": 0, "basicInformation.name": 1, "basicInformation.bday": 1})[0]

            patientName = patient['basicInformation']['name']

            # PARSE DATE
            date = datetime.fromisoformat(
                completedDate).date().strftime(format="%B %d, %Y")
            time = datetime.fromisoformat(
                completedDate).time().strftime(format="%I:%M %p")

            # APPEND TO RESULT
            resultObject['date'] = date
            resultObject['time'] = time
            resultObject['provider'] = provider
            resultObject['patient'] = patientName
            # CALCULATE AGE
            resultObject['age'] = self.calculateAge(
                patient['basicInformation']['bday'])

        except Exception as ex:
            print(ex)
        finally:
            return resultObject

    def interpretVitalSigns(self) -> dict:
        resultObject = {}
        try:
            vitalSigns = self.data['vitalSigns']
            requiredFields = ['height', 'weight',
                              'temperature', 'bloodPressure', 'heartRate']
            for key, value in vitalSigns.items():
                if key in requiredFields:
                    resultObject[key] = f'{value}'
        except Exception as ex:
            print(ex)
        finally:
            return resultObject

    def interpretSubjective(self) -> dict:
        resultObject = {
            'HPI': {},
            'ROS': {},
        }
        resultForHPI = {}
        GTPAL = {}
        resultForROS = {}

        try:

            HPI = self.data['HPI'] or {}
            patientHistory = self.data['patientHistory']
            pregnancyHistory = patientHistory['pregnancyHistory'] or []
            ROS = self.data['reviewOfSystems'] or {}

            # HPI
            if HPI:

                for key, value in HPI.items():
                    key = self.camelToSentenceCase(key)

                    if isinstance(value, list):
                        continue

                    resultForHPI[key] = self.camelToSentenceCase(value)

            # PREGNANCY HISTORY
            if pregnancyHistory:
                GTPAL = {
                    'G': 0,
                    'T': 0,
                    'P': 0,
                    'A': 0,
                    'L': 0
                }
                for item in pregnancyHistory:
                    GTPAL['G'] += 1

                    durationOfPreg = item['durationOfPregnancy']
                    if durationOfPreg != 'full term':
                        GTPAL['P'] += 1
                    else:
                        GTPAL['T'] += 1

                    presentHealth = item['presentHealth']
                    if not presentHealth.lower() == 'deceased':
                        GTPAL['L'] += 1
                    else:
                        GTPAL['A'] += 1

            # ROS
            if ROS:
                positiveStr = ""
                negativeStr = ""
                for category, items in ROS.items():
                    category = self.camelToSentenceCase(category)
                    positives = []
                    negatives = []
                    for key, value in items.items():
                        if "notes" in key.lower():
                            pass
                        elif value.lower() == "yes":
                            positives.append(self.camelToSentenceCase(key))
                        else:
                            negatives.append(self.camelToSentenceCase(key))
                    if len(positives):
                        positiveStr = (", ").join(positives)
                    if len(negatives):
                        negativeStr = (", ").join(negatives)
                    resultForROS[category] = {}
                    resultForROS[category]['negatives'] = negativeStr
                    resultForROS[category]['positives'] = positiveStr

        except Exception as ex:
            print(ex)
            print("ERROR")
        finally:
            # APPEND TO RESULT
            resultObject['HPI'] = resultForHPI
            resultObject['pregnancyHistory'] = GTPAL
            resultObject['ROS'] = resultForROS
            return resultObject

    def interpretObjective(self) -> dict:
        resultObject = {}
        try:
            PE = self.data['physicalExamination']
            generalPE = PE['general']

            resultForGenPE = []

            for item in generalPE:
                tempObj = {}
                for key, value in item.items():
                    key = self.camelToSentenceCase(key)
                    tempObj[key] = self.camelToSentenceCase(value)

                resultForGenPE.append(tempObj)

            # APPEND TO RESULT
            resultObject['general PE'] = resultForGenPE
        except Exception as ex:
            print(ex)
        finally:
            return resultObject

    def interpretAssessment(self) -> dict:
        resultObject = {}

        try:
            assessment = self.data['assessment']
            for key, value in assessment.items():
                key = self.camelToSentenceCase(key)
                resultObject[key] = value
        except Exception as ex:
            print(ex)
        finally:
            return resultObject

    def interpretPlan(self) -> dict:
        resultObject = {}
        try:
            plan = self.data['plan']
            prescription: list = plan['prescription']
            carePlan = plan['carePlan']
            laboratory = self.data['laboratory'] or {}

            # LABORATORY
            if laboratory:
                tests = laboratory['tests']
                laboratory['tests'] = ', '.join(tests)

            # PRESCRIPTION
            resultForPrescription = []
            if prescription:
                try:
                    for index, item in enumerate(prescription):
                        tempObj = {}
                        for key, value in item.items():
                            if key == "medicinePeriod":
                                # COMPUTE MEDICINE AMOUNT
                                tempObj['medicineAmount'] = int(
                                    prescription[index]['medicineFrequency']) * value

                                value = int(value)
                                if value % 30 == 0:
                                    value = f'{value // 30} month/s'
                                elif value % 7 == 0:
                                    value = f'{value // 7} month/s'
                            tempObj[key] = value

                        resultForPrescription.append(tempObj)
                except Exception as ex:
                    print(ex)

            # CARE PLAN
            resultForPlan = {}
            for key, value in carePlan.items():
                if key == 'followUpDate':
                    # PARSE DATE
                    date = datetime.fromisoformat(value.replace(
                        "Z", "")) + timedelta(hours=8)
                    parsedDate = date.strftime(format="%B %d, %Y")
                    parsedTime = date.strftime(format="%I:%M %p")

                    value = {'date': parsedDate, "time": parsedTime}

                key = self.camelToSentenceCase(key)
                resultForPlan[key] = value

            # APPEND TO RESULT
            resultObject['laboratory'] = laboratory
            resultObject['carePlan'] = resultForPlan
            resultObject['prescription'] = resultForPrescription

        except Exception as ex:
            print(ex)
        finally:
            return resultObject


class EMR(object):
    def __init__(self) -> None:
        pass

    def generateCheckupID(self) -> str:
        carePlanID = shortuuid.ShortUUID().random(length=10)
        results = self.retrieveCheckup(filter={"_id": carePlanID})
        if not len(list(results)):
            return carePlanID
        return self.generateCheckupID()

    @staticmethod
    def getTemplates(filter: dict, fields: dict) -> dict:
        collection = mongo.db.autocomplete
        result = collection.find_one(filter, fields)
        return result

    def retrieveCheckup(self, filter: dict, returnFields: dict = {}) -> list:
        collection = mongo.db["checkup"]
        results = collection.find(filter, returnFields)
        resultsArray = []

        for result in results:
            resultsArray.append(result)

        return resultsArray

    def addNewCheckup(self, data: dict) -> dict:
        data['_id'] = self.generateCheckupID()
        data['completedDate'] = str(datetime.now().isoformat())
        collection = mongo.db['checkup']
        inserted_id = collection.insert_one(data).inserted_id

        if inserted_id:
            return data
        return {}


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