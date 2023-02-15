from ..extensions import mongo
import json, requests, shortuuid
from requests import exceptions
from os import environ

from .Mdl_patient import Patient


collection = mongo['scheduledSMS']
API_KEY = environ.get("SEMAPHORE_API_KEY")
class SMS(object):
    def __init__(self) -> None:
        self.payload = {'apikey': API_KEY, 'sendername': "SEMAPHORE"}
    
    def getRandomSMSID(self) -> str:
        SMSID = shortuuid.ShortUUID().random(length=10)
        results = self.retrieveSMS(filter={"_id": SMSID})
        if not len(list(results)):
            return SMSID
        return self.getRandomSMSID()
    
    def retrieveSMS(self, filter: dict = {}, returnFields: dict = {}):
        result = collection.find(filter, returnFields)
        resultArray = []
        for sms in result:
            resultArray.append(sms)
        return resultArray

    def checkConnection(self):
        payload = {"apikey": API_KEY}
        r = requests.get(f"https://api.semaphore.co/api/v4/account?{json.dumps(payload)}")
        print(r.url)
        return r.json()
    
    def createNewScheduledSMS(self, appointmentID: str, patientID: str, patientName: str, scheduledDateStr: str ):
        payload = {
            "_id": self.getRandomSMSID(),
            "appointmentID": appointmentID,
            "patientID": patientID,
            "name": patientName,
            "date": scheduledDateStr,
        }
        insertedID = collection.insert_one(payload).inserted_id
        return insertedID

    def sendSMS(self, patientName, number):
        import datetime
        message = \
        f'''
        REMINDER FROM WE CARE POLYCLINIC AND LYING IN

        Hello {patientName},
        Your appointment is scheduled today, {datetime.datetime.now().strftime("%B %d, %Y")}.

        See you there!
        '''
        try:
            self.payload['apikey'] = API_KEY
            self.payload['number'] = number
            self.payload['message'] = message
            r = requests.post(f"https://api.semaphore.co/api/v4/messages", params=self.payload)
            r.raise_for_status()
            return r.json()
        except exceptions.HTTPError as err:
            raise SystemExit(err)
        
    def checkQueue(self):
        import datetime
        queue = self.retrieveSMS()
        result = []
        for item in queue:
            apptDatetime = item.get("date", None)
            if apptDatetime:
                apptDate = datetime.datetime.strptime(apptDatetime, "%Y-%m-%dT%H:%M:%S.%fZ").date()
                print(apptDate)
                if apptDate == datetime.datetime.now().date():
                    patientObj = Patient()
                    currentPatient = patientObj.findPatient(filter={"_id": item.get("patientID")}, returnFields={"_id": 0, "basicInformation.mobile": 1})[0].get("basicInformation")
                    number = currentPatient.get("mobile")

                    if number:
                        self.sendSMS(item.get('name'), number)
                        result.append(item)
        
        return result