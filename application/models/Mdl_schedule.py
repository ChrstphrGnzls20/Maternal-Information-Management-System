from pymongo import ReturnDocument
from ..extensions import mongo
import shortuuid
from datetime import datetime, timezone
import pytz

# IMPORT PATIENT CLASS FOR NEEDED FUNCTIONS
from .Mdl_doctor import Doctor
from .Mdl_employee import Employee

doctorObj = Doctor()


class MissingAttributeError(Exception):
    pass


collection = mongo['schedule']


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

    # IMPORTANT: SAVE UTC DATE FROM FRONT END TO DB
    def findSchedule(self, filter: dict = {}, returnFields: dict = {}):
        # collection = mongo.db.schedule

        try:
            resultsArray = []

            results = collection.find(filter, returnFields)
            empObj = Employee()
            # local = pytz.timezone('Asia/Manila')
            for result in results:
                doctor = empObj.retrieveEmployees(
                    filter={"_id": result['doctorID']}, returnFields={"name": 1})[0]
                result['doctorName'] = doctor['name']

                # dateToString = datetime.strftime(
                #     result['start'], "%Y-%m-%d %H:%M:%S.%f")
                # utc = datetime.fromisoformat(dateToString)
                # localDate = local.localize(utc, is_dst=None)

                # localDateISOFormat = localDate.strftime("%Y-%m-%d %H:%M:%S %z")
                # print(localDateISOFormat)
                # local_time = result['start'].replace(
                #     tzinfo=pytz.utc).astimezone(result['start'])
                resultsArray.append(result)

            return resultsArray
        except Exception as ex:
            print(ex)

    def addSchedule(self, scheduleDetails: dict) -> dict:
        # collection = mongo.db.schedule

        try:
            localTz = pytz.timezone("Asia/Manila")
            scheduleDetails['_id'] = self.__generateRandomScheduleID()
            # scheduleDetails['start'] = datetime.strptime(
            #     scheduleDetails['start'], "%Y-%m-%dT%H:%M:%S")
            # scheduleDetails['start'] = datetime.strptime(scheduleDetails['start'],
            #                                              "%Y-%m-%dT%H:%M:%S%z")

            # localTime = scheduleDetails['start']
            # utc = localTime.replace(tzinfo=localTz)
            # localDate = utc.astimezone(localTz)
            # start = scheduleDetails['start']
            # localTime = datetime.fromisoformat(
            #     f'{start}'[:-1]).astimezone(tz=localTz)

            # print(localTime)
            # scheduleDetails['start'] = localTime

            # print(scheduleDetails['start'])
            # scheduleDetails['end'] = datetime(scheduleDetails['end'])
            scheduleDetails['createdDate'] = str(datetime.now())

            print(scheduleDetails)

            collection.insert_one(scheduleDetails)

            return scheduleDetails
        except Exception as ex:
            print(ex)

    def editSchedule(self, scheduleID: str, dataToUpdate: dict):
        # collection = mongo.db.schedule
        print(dataToUpdate)
        result = collection.find_one_and_update(
            filter={"_id": scheduleID}, update={'$set': dataToUpdate}, upsert=True, return_document=ReturnDocument.AFTER)
        return result
