from pymongo import ReturnDocument
from ..extensions import mongo
import shortuuid
from datetime import datetime
import functools

# IMPORT PATIENT CLASS FOR NEEDED FUNCTIONS
from .Mdl_doctor import Doctor

doctorObj = Doctor()


class MissingAttributeError(Exception):
    pass


def requires(*required_attrs):
    def wrapper(method):

        @functools.wraps(method)
        def inner_wrapper(self, *args, **kargs):
            if not all(hasattr(self, attr) for attr in required_attrs):
                raise MissingAttributeError()
            return method(self, *args, **kargs)

        return inner_wrapper
    return wrapper


class Schedule(object):
    def __init__(self) -> None:
        pass

    # GENERATE A RANDOM EMPLOYEE ID (WITH LENGTH OF 6 CHARS) IF AND ONLY IF THE EMPLOYEE IS A SECRETARY
    def __generateRandomScheduleID(self) -> str:
        patientID = shortuuid.ShortUUID().random(length=6)
        results = self.findSchedule(filter={"_id": patientID})
        if not len(list(results)):
            return patientID
        return self.__generateRandomScheduleID()

    def findSchedule(self, filter: dict = {}, returnFields: dict = {}):
        collection = mongo.db.schedule

        try:
            resultsArray = []

            results = collection.find(filter, returnFields)

            for result in results:
                resultsArray.append(result)

            return resultsArray
        except Exception as ex:
            print(ex)

    def addSchedule(self, scheduleDetails: dict) -> dict:
        collection = mongo.db.schedule

        scheduleDetails['_id'] = self.__generateRandomScheduleID()
        scheduleDetails['createdDate'] = datetime.utcnow()

        collection.insert_one(scheduleDetails)

        return scheduleDetails
