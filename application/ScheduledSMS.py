# FOR DAILY TASK
import extensions as ex
from .models.Mdl_sms import SMS

smsObj = SMS()

collection = ex.mongo['scheduledSMS']

def checkQueue():
    queue = smsObj.retrieveSMS()

    for item in queue:
        print(item)

if __name__ == "main":
    checkQueue()