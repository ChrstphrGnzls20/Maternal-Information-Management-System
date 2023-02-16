# FOR DAILY TASK
from ..extensions import mongo
from ..models.Mdl_sms import SMS

smsObj = SMS()

collection = mongo['scheduledSMS']

def checkQueue():
    queue = smsObj.retrieveSMS()

    for item in queue:
        print(item)

if __name__ == "main":
    checkQueue()