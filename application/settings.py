'''
ATLAS Email: cgonzalesmain@gmail.com
ATLAS PWD: Maternityclinic123

'''


class Settings:
    DEBUG = True
    # FOR PRODUCTION USE BELOW CONNECTION TO MONGO ATLAS
    # MONGO_URI = 'mongodb://localhost:27017/MCIMS'
    # username = urllib.parse.quote_plus('cbgonzales')
    # password = urllib.parse.quote_plus("Maternityclinic123")
    MONGO_URI = 'mongodb+srv://cgonzales:maternityclinic@mcims.o6iroqu.mongodb.net/?retryWrites=true&w=majority'
    # MONGO_URI = "mongodb+srv://cbgonzales:passwordpassword@cluster0.fndpseh.mongodb.net/?retryWrites=true&w=majority"
    MONGO_CONNECT = True
    SESSION_PERMANENT = False
    SESSION_TYPE = "filesystem"
    # dummy
    # GMAIL
    MAIL_SERVER = "smtp.gmail.com"
    MAIL_PORT = 587
    MAIL_USERNAME = "maternityclinicis@gmail.com"
    MAIL_PASSWORD = "tpjyiprychvuuafv"
    MAIL_DEFAULT_SENDER = "maternityclinicis@gmail.com"
    MAIL_USE_TLS = True
    MAIL_USE_SSL = False
    # turn off when testing
    MAIL_SUPPRESS_SEND = False
    TESTING = False
