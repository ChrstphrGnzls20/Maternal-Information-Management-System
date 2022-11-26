from pymongo import ReturnDocument
from ..extensions import mongo
import json


class Admin(object):
    def __init__(self) -> None:
        self.dbName = "admin"

    def retrieveAdmins(self, filter: dict = {}, returnFields: dict = {}):
        collection = mongo.db[self.dbName]
        result = collection.find(filter, returnFields)
        resultArray = []
        for employee in result:
            resultArray.append(employee)
        return resultArray
