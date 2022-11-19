from pymongo import ReturnDocument
from ..extensions import mongo
import json
from passlib.hash import sha256_crypt


class Employee(object):
    def __init__(self) -> None:
        pass

    def login(self, loginCred: dict) -> dict:
        collection = mongo.db.employee
        print(loginCred)
        try:
            result = collection.find_one_or_404({"email": loginCred['email']}, {
                "_id": 1, "email": 1, "pwd": 1, "role": 1})
            if result:
                if sha256_crypt.verify(loginCred['pwd'], result['pwd']):
                    result.pop('pwd')
                    return {"code": "SUCCESS", "data": result}
                return {"code": "FAILURE", "errorMsg": "Incorrect password!"}
        except Exception:
            return {"code": "FAILURE", "errorMsg": "Email does not exists! Register <a href='/register' style='color: inherit'>here.</a>"}

    @staticmethod
    def retrieveEmployees(filter={}, fields={"_id": 0}) -> dict:
        collection = mongo.db.employee
        result = collection.find(filter, fields)
        employees = []
        for employee in result:
            employees.append(employee)
        return employees

    @staticmethod
    def retrieveSpecificEmployees(filter) -> dict:
        collection = mongo.db.employee
        resultArray = collection.find(
            filter, {"_id": 0})

        resultArrayLength = len(resultArray)

        if resultArrayLength > 0:
            structuredData = {"code": "SUCCESS",
                              "data": json.loads(json.dumps(resultArray))}
            return structuredData
        return {"code": "NOT FOUND"}

    @staticmethod
    def retrieveEmployeesWithFilter(filter={}) -> dict:
        collection = mongo.db.employee
        resultArray = list(collection.find(filter, {"_id": 0}))
        resultArrayLength = len(resultArray)
        employeeArray = []
        if resultArrayLength > 0:
            for result in resultArray:
                employeeArray.append(result)
            structuredData = {"code": "SUCCESS",
                              "data": json.loads(json.dumps(employeeArray))}
            # print(structuredData)
            return structuredData
        return {"code": "NO EMPLOYEES FOUND"}

    def addEmployee(self, employee: dict) -> dict:
        collection = mongo.db.employee
        try:
            collection.find_one_or_404({"licenseID": employee['licenseID']})
            return {"code": "EXISTS", "errMsg": "Employee is already registered!"}
        except Exception:
            del employee['pwd2']

            # password hashing
            employee['pwd'] = sha256_crypt.encrypt(employee['pwd'])
            collection.insert_one(employee)
            return {"code": "SUCCESS"}

    def editEmployee(self, licenseID: str, currData: dict) -> dict:
        # TODO: when license ID is edited, check for existing to avoid record dupllication
        collection = mongo.db.employee
        findQuery = {"licenseID": licenseID}
        updateQuery = {}
        prevData = collection.find_one(findQuery)

        if not prevData:
            return {"code": "NOT FOUND"}
        for key in currData.keys():
            if (currData[key] != prevData[key]):
                updateQuery[key] = currData[key]

        try:
            result = collection.find_one_and_update(
                findQuery, {"$set": json.loads(json.dumps(updateQuery))}, {"_id": 0}, return_document=ReturnDocument.AFTER)
            structuredData = {"code": "SUCCESS",
                              "data": json.loads(json.dumps(result))}
            return structuredData
        except Exception:
            return {"code": "FAILED TO UPDATE"}
