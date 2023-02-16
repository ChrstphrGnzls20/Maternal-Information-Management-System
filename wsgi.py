from application import init_app

def appEntryPoint(environment="development"):
    app = init_app(environment)
    app.run()

if __name__ == "__main__":
    appEntryPoint()
    

# TO RUN THE APPLICATION UNDER VIRTUALENV RUN 
# source "c:/Users/Christopher/Desktop/Caps_1_System/env/Scripts/activate"