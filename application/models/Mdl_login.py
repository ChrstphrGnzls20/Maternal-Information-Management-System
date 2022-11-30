from ..extensions import mongo
import json
from passlib.hash import sha256_crypt


class Login(object):
    # OBJECT FOR HANDLING USER LOGIN
    def __init__(self, entity: str) -> None:
        self.dbName = entity

    def login(self, loginCred: dict) -> dict:
        collection = mongo.db[self.dbName]
        resultArray = []
        try:
            result = collection.find_one_or_404(
                {"email": loginCred['email']}, {"_id": 1, "email": 1, "password": 1})
            if result:
                print(result)
                if sha256_crypt.verify(loginCred['password'], result['password']):
                    result.pop('password')
                    resultArray.append(result)
        except Exception as ex:
            print(ex)
        finally:
            return resultArray
        # result = collection.find_one_or_404(
        #     {"email": loginCred['email']}, {"_id": 1, "email": 1, "password": 1})
        # if result:
        #     print(result)
        #     if sha256_crypt.verify(loginCred['password'], result['password']):
        #         result.pop('password')
        #         resultArray.append(result)
        # return resultArray
