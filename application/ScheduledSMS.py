# FOR DAILY TASK
import extensions as ex
import models.Mdl_sms as sms

smsObj = sms.SMS()

collection = ex.mongo['scheduledSMS']

def checkQueue():
    queue = smsObj.retrieveSMS()

    for item in queue:
        print(item)

if __name__ == "main":
    checkQueue()