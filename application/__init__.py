from flask import Flask, render_template, redirect, session, request

# session
from flask_session import Session

# blueprints
from application.login.login import login
from application.patient.patient import patient
from application.admin.admin import admin
from application.emr.emr import emr
from application.address.address import address
from application.api.api import api
from application.doctor.doctor import doctor
from application.secretary.secretary import secretary

"""Extensions/Plugins"""
# pymongo, flask_mail, login_required decorator
from .extensions import mail, login_required

# settings
from .settings import DEPLOYMENT, DEVELOPMENT



def init_app(environment):
    """Initialize the core application."""

    app = Flask(__name__)

    """Set application configuration using Settings object"""
    if environment == 'deployment':
        app.config.from_object(DEPLOYMENT)
    else:
        app.config.from_object(DEVELOPMENT)

    import os
    print(os.environ.get("MONGO_URI"))
    """Initialize Session"""
    Session(app)

    """Initialize plugins"""
    # mongo.init_app(app)
    # TODO: implement OTP using flask_mail
    mail.init_app(app)

    with app.app_context():
        # Include routes
        app.register_blueprint(login, url_prefix='/login')
        app.register_blueprint(patient, url_prefix="/patient")
        app.register_blueprint(admin, url_prefix="/admin")
        app.register_blueprint(doctor, url_prefix="/doctor")
        app.register_blueprint(address, url_prefix="/address")
        app.register_blueprint(emr, url_prefix="/emr")
        app.register_blueprint(api, url_prefix='/api')
        app.register_blueprint(secretary, url_prefix='/secretary')

    @app.route('/')
    def index():
        session.clear()

        return render_template('index.html')

    @app.route('/logout')
    @login_required
    def logout():
        session.clear()

        return redirect("/")
    
    
    # FOR AUTOMATIC DEPLOYMENT eksdi
    @app.route('/update_server', methods=['POST'])
    def webhook():
        import git, os
        if request.method == 'POST':
            if request.method == 'POST':
                repo = git.Repo('./Maternal-Information-Management-System')
                o = repo.remotes.origin
                repo.heads.master.set_tracking_branch(o.refs.master)
                repo.heads.master.checkout()
                # blast any changes there (only if it wasn't checked out)
                repo.git.reset('--hard')
                # remove any extra non-tracked files (.pyc, etc)
                repo.git.clean('-xdf')
                o.pull()
                return '', 200
            else:
                return '', 400
    # @app.route("/git_update", methods=["POST"])
    # def updateProject():
    #     import git, os
    #     if request.method == "POST":
    #         print(os.getcwd())
    #         repo = git.Repo('./Maternal-Information-Management-System', search_parent_directories=True)
    #         # print(repo.working_tree_dir)
    #         origin = repo.remotes.origin
    #         # print(repo.remotes)
    #         repo.create_head('master', origin.refs.master).set_tracking_branch(origin.refs.master).checkout()
    #         origin.pull()
    #         return '', 200


    return app

    

