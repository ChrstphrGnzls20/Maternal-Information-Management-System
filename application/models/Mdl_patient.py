"""Imported Libraries"""
# Imported Libraries
from ..extensions import mail
from ..extensions import mongo
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


class Patient(object):
    def __init__(self):
        self.OTP = 0

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
        collection = mongo.db.patient

        # attach additional information
        data['_id'] = self.getRandomPatientID()
        data['registeredDate'] = datetime.utcnow()

        # password hashing
        data['password'] = sha256_crypt.encrypt(data['password'])

        result = collection.insert_one(data)
        return result.inserted_id

    def findPatient(self, filter: dict, returnFields: dict = {}) -> dict:
        collection = mongo.db.patient
        resultArray = []
        results = collection.find(filter, returnFields)
        for result in results:
            resultArray.append(result)
        return resultArray
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
