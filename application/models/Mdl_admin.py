from pymongo import ReturnDocument
from ..extensions import mongo
import json
from passlib.hash import sha256_crypt

collection = mongo['admin']
class Admin(object):
    def __init__(self) -> None:
        self.dbName = "admin"
    
    def addAdmin(self, payload):
        unhashedPassword = payload.get("password", None)

        if unhashedPassword and payload.get("email", None):
            payload['password'] = sha256_crypt.encrypt(payload['password'])

        collection.insert_one(payload)

        return payload

    def retrieveAdmins(self, filter: dict = {}, returnFields: dict = {}):
        
        result = collection.find(filter, returnFields)
        resultArray = []
        for employee in result:
            resultArray.append(employee)
        return resultArray
