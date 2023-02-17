

from os import environ, path
from dotenv import load_dotenv

basedir = path.expanduser('~/Maternal-Information-Management-System')
load_dotenv(path.join(basedir, '.env'))

class Settings(object):
    MONGO_URI = environ.get("MONGO_URI")
    MONGO_CONNECT = False
    SESSION_PERMANENT = False
    SESSION_TYPE = "filesystem"

    # FLASK MAIL USING GMAIL SMTP
    MAIL_SERVER = "smtp.gmail.com"
    MAIL_PORT = 587
    MAIL_USERNAME = environ.get("MAIL_USERNAME")
    MAIL_PASSWORD = environ.get("MAIL_PASSWORD")
    MAIL_DEFAULT_SENDER = environ.get("MAIL_DEFAULT_SENDER")
    MAIL_USE_TLS = True
    MAIL_USE_SSL = False

    # SECRET KEY
    SECRET_KEY = environ.get("SECRET_KEY")

class DEVELOPMENT(Settings):
    ENV = "development"
    DEBUG = True
    MAIL_SUPPRESS_SEND = True
    TESTING = False 

class DEPLOYMENT(Settings):
    ENV = "production"
    DEBUG = False
    MAIL_SUPRESS_SEND = False
    TESTING = False