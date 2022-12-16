from flask import Flask, Blueprint, make_response, jsonify

# MODELS
from ..models.Mdl_employee import Employee
from ..models.Mdl_emr import EMR
from ..models.Mdl_clinicService import ClinicService
from ..models.Mdl_schedule import Schedule

# INSTANTIATE MODELS
doctorObj = Employee()
emrObj = EMR()
clinicServiceObj = ClinicService()
scheduleObj = Schedule()

reportAPI = Blueprint("reportAPI", __name__)


@reportAPI.route('/doctors-checkup-tally')
def doctorsCheckTally():
    doctors = doctorObj.retrieveEmployees(
        filter={"role": "doctor", "status": "active"}, returnFields={"name": 1})

    resultArray = []

    for doctor in doctors:
        tempObj = {}
        listOfCheckups = emrObj.retrieveCheckup(
            filter={"doctorID": doctor['_id']})

        listOfSchedule = scheduleObj.findSchedule(
            filter={"doctorID": doctor["_id"]})

        print(listOfSchedule)
        onTime = 0
        late = 0
        absent = 0

        for schedule in listOfSchedule:
            try:
                arrivalStatus = schedule['arrivalStatus'].lower()
                if arrivalStatus == "on time":
                    onTime += 1
                elif arrivalStatus == "late":
                    late += 1
                else:
                    absent += 1
            except:
                continue

        tempObj['doctorID'] = doctor["_id"]
        tempObj['doctorName'] = doctor['name']
        tempObj['checkUpNum'] = len(listOfCheckups)
        # ATTACH CLINIC ATTENDANCE
        tempObj['attendance'] = {
            'absent': absent,
            'late': late,
            'onTime': onTime
        }
        tempObj['absent'] = absent
        tempObj['late'] = late
        tempObj['onTime'] = onTime

        resultArray.append(tempObj)

    return make_response(jsonify(resultArray), 200)


@reportAPI.route("/clinic-service-tally")
def clinicServiceTally():
    clinicServices = clinicServiceObj.retrieveClinicServices(
        filter={}, returnFields={"name": 1, "price": 1})

    clinicServiceWithCount = [*clinicServices]
    listOfCheckups = emrObj.retrieveCheckup(
        filter={}, returnFields={"servicesPerformed": 1})
    for checkup in listOfCheckups:
        values = checkup['servicesPerformed']
        for service in values:
            for idx, clinicService in enumerate(clinicServices):

                if str(service) == str(clinicService['_id']):
                    try:
                        clinicServiceWithCount[idx]['count'] += 1
                    except KeyError:
                        clinicServiceWithCount[idx]['count'] = 1
                    break

    return make_response(jsonify(clinicServiceWithCount), 200)
