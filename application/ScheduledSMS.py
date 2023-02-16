# FOR DAILY TASK
from .extensions import mongo
import models.Mdl_sms as sms

smsObj = sms.SMS()

collection = mongo['scheduledSMS']

def checkQueue():
    queue = smsObj.retrieveSMS()

    for item in queue:
        print(item)

if __name__ == "main":
    checkQueue()