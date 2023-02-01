from application import init_app


app = init_app()

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)

# TO RUN THE APPLICATION UNDER VIRTUALENV RUN 
# source "c:/Users/Christopher/Desktop/Caps 1 System/env/Scripts/activate"