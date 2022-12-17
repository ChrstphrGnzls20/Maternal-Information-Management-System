"""Imported Libraries"""
# Imported Libraries
from ..extensions import mail
from ..extensions import mongo
# from ..extensions import client
from pymongo import ReturnDocument
# from uuid import uuid4
import shortuuid
from passlib.hash import sha256_crypt
import random
from flask_mail import Message
from datetime import datetime

"""Local extensions"""


# for OTP

# password hashing

# uuid

"""
Model for patient transactions:
- login 
- register 
- OTP generation and verification 
- account modification (TODO: implement)
"""

collection = mongo['patient']


class Patient(object):
    def __init__(self):
        self.OTP = 0
        self.patientPerPage = 5  # FOR PAGINATION

    def getRandomPatientID(self) -> str:
        patientID = shortuuid.ShortUUID().random(length=10)
        results = self.findPatient(filter={"_id": patientID})
        if not len(list(results)):
            return patientID
        return self.getRandomPatientID()

    def generateOTP(self, email: str) -> None:
        self.OTP = random.randrange(100000, 999999)
        htmlMsgToSend = f"""
            <p>Your OTP is: <strong>{self.OTP}</strong></p>
            <p><strong>NOTE: DO NOT SHARE THIS TO ANYONE</strong></p>
        """
        # send OTP via GMAIL
        msg = Message(subject="DO NOT SHARE YOUR OTP",
                      recipients=[f"{email}"], html=htmlMsgToSend)
        # TODO: for testing purpose only
        # msg = Message(subject="DO NOT SHARE YOUR OTP",
        #               recipients=["gayoc85423@ishyp.com"], html=htmlMsgToSend)

        mail.send(msg)

    def verifyOTP(self, unverifiedOTP: str) -> bool:
        print(self.OTP)
        return str(unverifiedOTP) == str(self.OTP)

    def register(self, data: dict) -> str:
        # collection = mongo.db.patient

        # attach additional information
        data['_id'] = self.getRandomPatientID()
        data['registeredDate'] = str(datetime.now().isoformat())

        # password hashing
        data['password'] = sha256_crypt.encrypt(data['password'])

        result = collection.insert_one(data)
        return result.inserted_id

    def findPatient(self, filter: dict, returnFields: dict = {}, limit: int = 0, pageNumber: int = 0) -> list:
        # print(client.list_database_names())
        # collection = mongo['patient']
        # collection = mongo.db.patient
        print(filter)
        resultArray = []
        results = collection.find(filter, returnFields).limit(limit).skip(
            ((pageNumber - 1) * self.patientPerPage) if pageNumber > 0 else 0)
        for result in results:
            resultArray.append(result)
        # print(resultArray)
        return resultArray

    def updatePatientStatus(self, patientID: str, status: str) -> None:
        # collection = mongo.db.patient
        try:
            collection.update_one(filter={"_id": patientID}, update={
                                  '$set': {'status': status}}, upsert=True)
        except Exception as ex:
            print(ex)

    def addNewCheckupID(self, patientID: str, checkupID: str) -> list:
        # collection = mongo.db.patient
        try:
            collection.update_one(filter={"_id": patientID}, update={
                                  '$addToSet': {'checkupIDs': checkupID}})
            newCheckupIDs = collection.find(
                {"_id": patientID}, {"_id": 0, "checkupIDs": 1})

            return newCheckupIDs
        except Exception as ex:
            print(ex)

    def updatePatientHistory(self, patientID: str, updateObject: list[dict]):
        try:
            resultArray = []
            for item in updateObject:
                keys = list(item.keys())
                for key in keys:
                    print(f'patientHistory.{key}')
                    updateQuery = {}
                    result = collection.find(
                        {"_id": patientID, f'patientHistory.{key}': {"$exists": True}})
                    if len(list(result)):
                        collection.find_one_and_update(filter={"_id": patientID}, update={
                                                       '$set': {f'patientHistory.{key}': item[key]}})
                    else:
                        collection.find_one_and_update(filter={"_id": patientID}, update={
                                                       '$set': {f'patientHistory.{key}': item[key]}}, upsert=True)
                print(key)
                resultArray.append([])
            return resultArray
        except Exception as ex:
            print(ex)

    # def editPatient(self, _id: str, updatedData: dict) -> dict:
    #     # TODO: when license ID is edited, check for existing to avoid record dupllication
    #     collection = mongo.db['patient']
    #     updateQuery = {}
    #     prevData = collection.find_one({"_id": _id})

    #     if not prevData:
    #         return {}
    #     for key in updatedData.keys():
    #         if (updatedData[key] != prevData[key]):
    #             updateQuery[key] = updatedData[key]
    #     try:
    #         result = collection.find_one_and_update(
    #             findQuery, {"$set": updateQuery}, return_document=ReturnDocument.AFTER)
    #         # structuredData = {"code": "SUCCESS",
    #         #                   "data": json.loads(json.dumps(result))}
    #     except Exception:
    #         result = {}
    #     finally:
    #         return result

        # try:
        #     collection.find_one_or_404(filter, return_fields)
        #     return {
        #         "code": "EXISTS",
        #         "errorMsg": "Email already exists! Go to login <a href='/patient/login' style='color: inherit'>here.</a>"
        #     }

        # except Exception:
        #     return {"code": "SUCCESS"}

    # def login(self, loginCred: dict) -> dict:
    #     collection = mongo.db.patient
    #     resultArray = []
    #     try:
    #         result = collection.find_one_or_404(
    #             {"email": loginCred['email']}, {"_id": 1, "email": 1, "password": 1})
    #         if result:
    #             if sha256_crypt.verify(loginCred['password'], result['password']):
    #                 result.pop('password')
    #                 resultArray.append(result)
    #     except Exception as ex:
    #         print(ex)
    #     finally:
    #         return resultArray
        # try:
        #     result = collection.find_one_or_404(
        #         {"email": loginCred['email']}, {"_id": 1, "email": 1, "password": 1})
        #     if result:
        #         if sha256_crypt.verify(loginCred['password'], result['password']):
        #             result.pop('password')
        #             return {"code": "SUCCESS", "data": result}
        #         return {"code": "FAILURE", "errorMsg": "Incorrect password!"}
        # except Exception:
        #     return {"code": "FAILURE", "errorMsg": "Email does not exists! Register <a href='/register' style='color: inherit'>here.</a>"}

    # for testing

    def deleteAll(self) -> None:
        collection = mongo.db.patient
        collection.delete_many({})
