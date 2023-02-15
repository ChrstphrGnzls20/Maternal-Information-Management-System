from ..extensions import mongo
import json
from passlib.hash import sha256_crypt


class Login(object):
    # OBJECT FOR HANDLING USER LOGIN
    def __init__(self, entity: str) -> None:
        self.dbName = entity

    def login(self, loginCred: dict) -> dict:
        collection = mongo[self.dbName]
        resultArray = []
        try:
            if self.dbName == 'patient':
                result = collection.find_one(
                    {"email": loginCred['email']}, {"_id": 1, "email": 1, "password": 1, "basicInformation.name": 1})
            elif self.dbName == 'admin':
                result = collection.find_one(
                    {"email": loginCred['email']}, {"_id": 1, "email": 1, "password": 1,})
            else:
                result = collection.find_one(
                    {"email": loginCred['email']}, {"_id": 1, "email": 1, "password": 1, "name": 1})
            if result:
                if sha256_crypt.verify(loginCred['password'], result['password']):
                    result.pop('password')
                    resultArray.append(result)
        except Exception as ex:
            print(ex)
        finally:
            print(resultArray)
            return resultArray
