from flask import make_response, render_template
from ..extensions import mongo
import json
import shortuuid
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
import re
import pdfkit


# IMPORT NEEDED MODELS
from .Mdl_employee import Employee
from .Mdl_patient import Patient
from .Mdl_address import Address
from .Mdl_clinicService import ClinicService

# HELPERS


def calculateAge(bday: datetime) -> int:
    now = datetime.utcnow()
    now = now.date()

    parsedBday = datetime.strptime(bday, "%m/%d/%Y")

    # Get the difference between the current date and the birthday
    age = relativedelta(now, parsedBday)
    age = age.years

    return age


def generatePrescription(prescriptionData: dict, patientInfo: dict, doctorInfo: dict, dateAdministered: str) -> None:
    if not prescriptionData['plan']['prescription']:
        return make_response("No prescribed medicine", 404)
    prescription = prescriptionData['plan']['prescription']
    resultForPrescription = []
    for index, item in enumerate(prescription):
        tempObj = {}
        for key, value in item.items():
            if key == "medicinePeriod":
                # COMPUTE MEDICINE AMOUNT
                value = int(value)
                tempObj['medicineAmount'] = int(
                    prescription[index]['medicineFrequency']) * value

                if value % 30 == 0:
                    value = f'{value // 30} month/s'
                elif value % 7 == 0:
                    value = f'{value // 7} week/s'
            tempObj[key] = value
        resultForPrescription.append(tempObj)

    date = datetime.fromisoformat(
        dateAdministered).date().strftime(format="%B %d, %Y")

    age = calculateAge(patientInfo['bday'])

    patientInfo['age'] = age

    address: dict = patientInfo['address']
    addressObj = Address()

    # regVal = json.loads(addressObj.getSpecific("regions", "regCode", address['regions']))[0]['regDesc'].lower()
    # provinceVal = json.loads(addressObj.getSpecific(
    #     "provinces", "provCode", address['provinces']))[0]['provDesc'].lower()
    cityVal = json.loads(addressObj.getSpecific(
        "cities", "citymunCode", address['cities']))[0]['citymunDesc'].lower()
    barangayVal = json.loads(addressObj.getSpecific(
        "barangays", "brgyCode", address['barangays']))[0]['brgyDesc']
    streetAddress = address['street'].lower()

    addressStr = f'{streetAddress.title()} {barangayVal}, {cityVal.title()}'
    patientInfo['address'] = addressStr
    diagnosis = prescriptionData['assessment']['diagnosis']
    rendered = render_template(
        "prescription-pdf.html", date=date, patient=patientInfo, diagnosis=diagnosis, doctor=doctorInfo, prescription=resultForPrescription)

    pdf = pdfkit.from_string(rendered, False)
    response = make_response(pdf)
    response.headers['content-Type'] = 'application/pdf'
    filename = f'{datetime.date(datetime.now())} - prescription - {patientInfo["name"]}.pdf'
    response.headers[
        'content-Disposition'] = 'inline; filename="{}"'.format(filename)

    return response

    return rendered


def generateChargingForm(clinicServices: list, patientInfo: dict, doctorInfo: dict, dateCreated: str) -> None:
    print(clinicServices, patientInfo, doctorInfo, dateCreated)
    date = datetime.fromisoformat(
        dateCreated).date().strftime(format="%B %d, %Y")

    # FETCH NECESSARY INFO OF CLINIC SERVICES
    serviceObj = ClinicService()
    newClinicServiceInfo = []
    for service in clinicServices:
        service = int(service)
        completeServiceInfo = serviceObj.retrieveClinicServices(
            filter={"_id": service}, returnFields={"name": 1, "price": 1})
        if len(completeServiceInfo):
            newClinicServiceInfo.append(completeServiceInfo[0])

    print(newClinicServiceInfo)
    rendered = render_template(
        "chargingForm.html", patientInfo=patientInfo, doctorInfo=doctorInfo, date=date, clinicServices=newClinicServiceInfo)

    pdf = pdfkit.from_string(rendered, False)
    response = make_response(pdf)
    response.headers['content-Type'] = 'application/pdf'
    filename = f'{datetime.date(datetime.now())} - chargingForm - {patientInfo["name"]}.pdf'
    response.headers[
        'content-Disposition'] = 'inline; filename="{}"'.format(filename)
    return response


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

    # PRIVATE HELPER FUNCTIONS FOR CREATING PDF

    def __fillSOAPHeader(self):
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
            resultObject['age'] = calculateAge(
                patient['basicInformation']['bday'])

        except Exception as ex:
            print(ex)
        finally:
            return resultObject

    def __interpretVitalSigns(self) -> dict:
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

    def __interpretSubjective(self) -> dict:
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

    def __interpretObjective(self) -> dict:
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

    def __interpretAssessment(self) -> dict:
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

    def __interpretPlan(self) -> dict:
        resultObject = {}
        try:
            plan = self.data['plan']
            prescription: list = plan['prescription']
            carePlan = plan['carePlan']
            laboratory = self.data['laboratory'] or {}

            # LABORATORY
            if laboratory:
                pass
                # tests = laboratory['tests'] or []
                # if tests:
                #     laboratory['tests'] = ', '.join(tests)

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
                                    prescription[index]['medicineFrequency']) * int(value)

                                value = int(value)
                                if value % 30 == 0:
                                    value = f'{value // 30} month/s'
                                elif value % 7 == 0:
                                    value = f'{value // 7} week/s'
                            tempObj[key] = value

                        resultForPrescription.append(tempObj)
                except Exception as ex:
                    print(ex)

            # CARE PLAN
            resultForPlan = {}
            for key, value in carePlan.items():
                if key == 'followUpDate' and value:
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

    def generatePDF(self):
        # INTERPRETATION BEGINS
        headers = self.__fillSOAPHeader()
        vitals = self.__interpretVitalSigns()
        subjective = self.__interpretSubjective()
        objective = self.__interpretObjective()
        assessment = self.__interpretAssessment()
        plan = self.__interpretPlan()

        rendered = render_template(
            "SOAP.html", headers=headers, vitals=vitals, subjective=subjective, objective=objective, assessment=assessment, plan=plan)
        pdf = pdfkit.from_string(rendered, False)
        response = make_response(pdf)
        filename = f'{datetime.date(datetime.now())} - SOAP - {headers["patient"]}.pdf'
        response.headers['content-Type'] = 'application/pdf'
        response.headers['content-Disposition'] = 'inline; filename="{}"'.format(
            filename)

        return response


collection = mongo['checkup']


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
        collection = mongo['autocomplete']
        result = collection.find_one(filter, fields)
        return result

    def retrieveCheckup(self, filter: dict = {}, returnFields: dict = {}) -> list:
        # collection = mongo.db["checkup"]
        results = collection.find(filter, returnFields)
        resultsArray = []

        for result in results:
            resultsArray.append(result)

        return resultsArray

    def addNewCheckup(self, data: dict) -> dict:
        data['_id'] = self.generateCheckupID()
        data['completedDate'] = str(datetime.now().isoformat())
        # collection = mongo.db['checkup']
        inserted_id = collection.insert_one(data).inserted_id

        # ADD CHECKUP ID TO DOCUMENT OF PATIENT
        try:
            patientObj = Patient()
            patientObj.addNewCheckupID(data['patientID'], data["_id"])

            # PATIENT STATUS
            patientStatus = data['plan']['carePlan']['patientStatus']
            patientObj.updatePatientStatus(data['patientID'], patientStatus)

            if inserted_id:
                return data
        except Exception:
            return {}


carePlanCollection = mongo['careplan']


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
        # collection = mongo.db["careplan"]
        results = carePlanCollection.find(filter, returnFields)
        resultsArray = []

        for result in results:
            resultsArray.append(result)

        return resultsArray

    def addCarePlan(self, newCarePlan: dict) -> dict:
        # collection = mongo.db["careplan"]

        # ATTACH AUTO GENERATED ID
        newCarePlan["_id"] = self.generateCarePlanID()
        inserted_id = carePlanCollection.insert_one(newCarePlan).inserted_id

        if inserted_id:
            return newCarePlan

        return None
