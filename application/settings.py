
class Settings:
    MONGO_URI = 'mongodb://localhost:27017/MCIMS'
    # FOR PRODUCTION USE BELOW CONNECTION TO MONGO ATLAS
    # MONGO_URI = 'mongodb+srv://cbgonzales:Ninefinity09@mcims.tbko90w.mongodb.net/?retryWrites=true&w=majority'
    DEBUG = True
    SESSION_PERMANENT = False
    SESSION_TYPE = "filesystem"

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
