from pymongo import ReturnDocument
from ..extensions import mongo
import json
from passlib.hash import sha256_crypt
import shortuuid


class Employee(object):
    # A CLASS FOR EXECUTING EMPLOYEE'S FUNCTIONS (ADD, EDIT)
    def __init__(self) -> None:
        self.dbName = "employee"
        self.employeePerPage = 5  # FOR PAGINATION

    # GENERATE A RANDOM EMPLOYEE ID (WITH LENGTH OF 6 CHARS) IF AND ONLY IF THE EMPLOYEE IS A SECRETARY
    def generateRandomEmpID(self) -> str:
        patientID = shortuuid.ShortUUID().random(length=6)
        results = self.retrieveEmployees(filter={"_id": patientID})
        if not len(list(results)):
            return patientID
        return self.generateRandomEmpID()

    def retrieveEmployees(self, filter: dict = {}, returnFields: dict = {}, limit: int = 0, pageNumber: int = 0) -> list:
        collection = mongo.db[self.dbName]
        result = collection.find(filter, returnFields).limit(limit).skip(
            ((pageNumber - 1) * self.employeePerPage) if pageNumber > 0 else 0)
        employees = []
        for employee in result:
            employees.append(employee)
        return employees

    def addEmployee(self, employeeData: dict) -> str:
        collection = mongo.db[self.dbName]
        try:
            result = self.retrieveEmployees(
                filter={"_id": employeeData["_id"]})
        except KeyError:
            employeeData["_id"] = self.generateRandomEmpID()
            result = self.retrieveEmployees(
                filter={"_id": employeeData["_id"]})

        # IF THE RECORD ALREADY EXISTS
        if result:
            return {}
        del employeeData['pwd2']
        # password hashing
        employeeData['password'] = sha256_crypt.encrypt(
            employeeData['password'])
        result = collection.insert_one(employeeData)
        return employeeData

    def editEmployee(self, _id: str, updatedData: dict) -> dict:
        # TODO: when license ID is edited, check for existing to avoid record dupllication
        collection = mongo.db[self.dbName]
        findQuery = {"_id": _id}
        updateQuery = {}
        prevData = collection.find_one(findQuery)

        if not prevData:
            return {}
        for key in updatedData.keys():
            if (updatedData[key] != prevData[key]):
                updateQuery[key] = updatedData[key]
        try:
            result = collection.find_one_and_update(
                findQuery, {"$set": updateQuery}, return_document=ReturnDocument.AFTER)
            # structuredData = {"code": "SUCCESS",
            #                   "data": json.loads(json.dumps(result))}
        except Exception:
            result = {}
        finally:
            return result

        # try:
        #     collection.find_one_or_404({"licenseID": employee['licenseID']})
        #     return {"code": "EXISTS", "errMsg": "Employee is already registered!"}
        # except Exception:
        #     del employee['pwd2']

        #     # password hashing
        #     employee['pwd'] = sha256_crypt.encrypt(employee['pwd'])
        #     collection.insert_one(employee)
        #     return {"code": "SUCCESS"}

        # def retrieveSpecificEmployees(self, filter) -> dict:
        #     collection = mongo.db[self.dbName]
        #     resultArray = collection.find(
        #         filter, {"_id": 0})

        #     resultArrayLength = len(resultArray)

        #     if resultArrayLength > 0:
        #         structuredData = {"code": "SUCCESS",
        #                           "data": json.loads(json.dumps(resultArray))}
        #         return structuredData
        #     return {"code": "NOT FOUND"}

        # def retrieveEmployeesWithFilter(self, filter={}) -> dict:
        #     collection = mongo.db[self.dbName]
        #     resultArray = list(collection.find(filter, {"_id": 0}))
        #     resultArrayLength = len(resultArray)
        #     employeeArray = []
        #     if resultArrayLength > 0:
        #         for result in resultArray:
        #             employeeArray.append(result)
        #         structuredData = {"code": "SUCCESS",
        #                           "data": json.loads(json.dumps(employeeArray))}
        #         # print(structuredData)
        #         return structuredData
        #     return {"code": "NO EMPLOYEES FOUND"}

        # def editEmployee(self, licenseID: str, currData: dict) -> dict:
        #     # TODO: when license ID is edited, check for existing to avoid record dupllication
        #     collection = mongo.db[self.dbName]
        #     findQuery = {"licenseID": licenseID}
        #     updateQuery = {}
        #     prevData = collection.find_one(findQuery)

        #     if not prevData:
        #         return {"code": "NOT FOUND"}
        #     for key in currData.keys():
        #         if (currData[key] != prevData[key]):
        #             updateQuery[key] = currData[key]

        #     try:
        #         result = collection.find_one_and_update(
        #             findQuery, {"$set": json.loads(json.dumps(updateQuery))}, {"_id": 0}, return_document=ReturnDocument.AFTER)
        #         structuredData = {"code": "SUCCESS",
        #                           "data": json.loads(json.dumps(result))}
        #         return structuredData
        #     except Exception:
        #         return {"code": "FAILED TO UPDATE"}

        # def login(self, loginCred: dict) -> dict:
        #     collection = mongo.db[self.dbName]
        #     resultArray = []
        #     try:
        #         result: dict = collection.find_one_or_404(
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
        #     result = collection.find_one_or_404({"email": loginCred['email']}, {
        #         "_id": 1, "email": 1, "pwd": 1, "role": 1})
        #     if result:
        #         if sha256_crypt.verify(loginCred['pwd'], result['pwd']):
        #             result.pop('pwd')
        #             return {"code": "SUCCESS", "data": result}
        #         return {"code": "FAILURE", "errorMsg": "Incorrect password!"}
        # except Exception:
        #     return {"code": "FAILURE", "errorMsg": "Email does not exists! Register <a href='/register' style='color: inherit'>here.</a>"}
