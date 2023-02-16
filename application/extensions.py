# Flask-pymongo
from flask_mail import Mail
from flask_pymongo import PyMongo
from pymongo import MongoClient
from os import environ

# mongo = PyMongo()
mongo = MongoClient(
    "mongodb+srv://cgonzales:maternityclinic@mcims.o6iroqu.mongodb.net/?retryWrites=true&w=majority", connectTimeoutMS=30000, socketTimeoutMS=None, connect=False, maxPoolsize=1, tls=True)
# print(mongo.server_info())

# mongo = mongo.MCIMS
mongo = mongo['MCIMS']
# flask_mail
mail = Mail()

#custom decorator for validating login credential
from functools import wraps
from flask import redirect, session, request

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kws):
        currentPath = request.path.split("/")[1]

        if session.get('loggedIn', None):
            return f(*args, **kws)

        return redirect((f"/login/{currentPath}"))

    return decorated_function

