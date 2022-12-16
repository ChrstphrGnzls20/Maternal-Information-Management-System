# Flask-pymongo
from flask_mail import Mail
from flask_pymongo import PyMongo
from pymongo import MongoClient

# mongo = PyMongo()
mongo = MongoClient(
    'mongodb+srv://cgonzales:maternityclinic@mcims.o6iroqu.mongodb.net/?retryWrites=true&w=majority')

# mongo = mongo.MCIMS
mongo = mongo['MCIMS']

# flask_mail
mail = Mail()
