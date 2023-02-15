from flask import Blueprint, render_template, session, redirect, request, url_for

from ..extensions import login_required

login = Blueprint('login', __name__, template_folder="templates",
                  static_folder="static")


# for testing
# @login.route('/delete_all')
# def deleteAll():
#     patientObj.deleteAll()
#     return "DELETED"


@login.route('/<string:entity>')
def loginPage(entity):
    session.clear()
    currentPath = request.path.split("/")[1]

    validEntities = ['doctor', 'patient', 'secretary', 'admin', 'login']
    if not currentPath in validEntities:
        return redirect(url_for("index"))
    return render_template("login.html", title="Login", entity=entity)