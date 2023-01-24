from flask import Flask, Blueprint, make_response, jsonify, request
import datetime
import calendar
import json

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
def doctorsCheckupTally():
    startingMonth = request.args.get("month", None)
    startingYear = int(request.args.get("year", None))

    if startingMonth and startingYear:
        startingMonthInt = datetime.datetime.strptime(
            startingMonth, "%B").month

        doctors = doctorObj.retrieveEmployees(
            filter={"role": "doctor", "status": "active"}, returnFields={"name": 1})

        resultArray = []

        for doctor in doctors:
            tempObj = {}
            numberOfCheckups = 0
            listOfCheckups = emrObj.retrieveCheckup(
                filter={"doctorID": doctor['_id']})

            # listOfSchedule = scheduleObj.findSchedule(
            #     filter={"doctorID": doctor["_id"]})

            for checkup in listOfCheckups:
                checkupYear = datetime.datetime.fromisoformat(
                    checkup['completedDate']).year
                checkupMonth = datetime.datetime.fromisoformat(
                    checkup['completedDate']).month
                if checkupMonth == startingMonthInt and checkupYear == startingYear:
                    numberOfCheckups += 1

            # print(json.dumps(listOfSchedule, indent=2))
            # onTime = 0
            # late = 0
            # absent = 0

            # for schedule in listOfSchedule:
            #     try:
            #         arrivalStatus = schedule['arrivalStatus'].lower()
            #         if arrivalStatus == "on time":
            #             onTime += 1
            #         elif arrivalStatus == "late":
            #             late += 1
            #         else:
            #             absent += 1
            #     except:
            #         continue

            tempObj['doctorID'] = doctor["_id"]
            tempObj['doctorName'] = doctor['name']
            tempObj['checkUpNum'] = numberOfCheckups
            # # ATTACH CLINIC ATTENDANCE
            # tempObj['attendance'] = {
            #     'absent': absent,
            #     'late': late,
            #     'onTime': onTime
            # }
            # tempObj['absent'] = absent
            # tempObj['late'] = late
            # tempObj['onTime'] = onTime

            # del tempObj['absent']
            # del tempObj['late']
            # del tempObj['onTime']

            resultArray.append(tempObj)

        return make_response(jsonify(resultArray), 200)
    return make_response(jsonify({}), 500)


@reportAPI.route("/doctors-attendance")
def attendanceTallyForDoctors():
    startingMonth = request.args.get("month", None)
    startingYear = int(request.args.get("year", None))

    if startingMonth and startingYear:
        startingMonthInt = datetime.datetime.strptime(
            startingMonth, "%B").month
        doctors = doctorObj.retrieveEmployees(
            filter={"role": "doctor", "status": "active"}, returnFields={"name": 1})

        resultArray = []

        for doctor in doctors:
            tempObj = {}
            listOfSchedule = scheduleObj.findSchedule(
                filter={"doctorID": doctor["_id"]})

            print(json.dumps(listOfSchedule, indent=2))
            onTime = 0
            late = 0
            absent = 0

            for schedule in listOfSchedule:
                startSchedMonth = datetime.datetime.fromisoformat(
                    schedule['start']).month
                startSchedYear = datetime.datetime.fromisoformat(
                    schedule['start']).year

                if startSchedMonth != startingMonthInt or startSchedYear != startingYear:
                    continue

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

            # ATTACH CLINIC ATTENDANCE
            tempObj['doctorID'] = doctor["_id"]
            tempObj['doctorName'] = doctor['name']
            tempObj['attendance'] = {
                'absent': absent,
                'late': late,
                'onTime': onTime
            }
            tempObj['absent'] = absent
            tempObj['late'] = late
            tempObj['onTime'] = onTime

            del tempObj['absent']
            del tempObj['late']
            del tempObj['onTime']

            resultArray.append(tempObj)
        return make_response(jsonify(resultArray), 200)
    return make_response(jsonify({}), 500)


@reportAPI.route("/clinic-service-tally")
def clinicServiceTally():
    startingMonth = request.args.get("month", None)
    startingYear = int(request.args.get("year", None))

    if startingMonth and startingYear:
        startingMonthInt = datetime.datetime.strptime(
            startingMonth, "%B").month
        clinicServices = clinicServiceObj.retrieveClinicServices(
            filter={}, returnFields={"name": 1, "price": 1})

        clinicServiceWithCount = [*clinicServices]
        listOfCheckups = emrObj.retrieveCheckup(
            filter={}, returnFields={"servicesPerformed": 1, "completedDate": 1, })
        for checkup in listOfCheckups:
            checkupYear = datetime.datetime.fromisoformat(
                checkup['completedDate']).year
            checkupMonth = datetime.datetime.fromisoformat(
                checkup['completedDate']).month
            if checkupMonth != startingMonthInt or checkupYear != startingYear:
                continue
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
    return make_response(jsonify({}), 500)


@reportAPI.route("/number-of-patient-tally")
def patientCheckupTally():
    startingMonth = request.args.get("month", None)
    startingYear = int(request.args.get("year", None))

    if startingMonth and startingYear:
        startingMonthInt = datetime.datetime.strptime(
            startingMonth, "%B").month

        # numOfDaysInGivenMonth = calendar.monthrange(year, startingMonthInt)[1]

        listOfCheckups = emrObj.retrieveCheckup(
            filter={}, returnFields={"completedDate": 1})

        # create a dictionary with the days of the given month (NOTE: Sunday excluded)
        daysArray = calendar.monthcalendar(startingYear, startingMonthInt)

        daysDictionary = {}
        for weeks in daysArray:
            for idx, day in enumerate(weeks):

                if day != 0 and idx <= 5:
                    daysDictionary[f'{startingMonthInt}/{day}/{startingYear}'] = 0
                    continue

        # filter out dates based on the given month
        for checkup in listOfCheckups:
            checkupYear = datetime.datetime.fromisoformat(
                checkup['completedDate']).year
            checkupMonth = datetime.datetime.fromisoformat(
                checkup['completedDate']).month
            checkupDay = datetime.datetime.fromisoformat(
                checkup['completedDate']).day
            if checkupMonth == startingMonthInt and checkupYear == startingYear:
                daysDictionary[f'{startingMonthInt}/{checkupDay}/{startingYear}'] += 1
                # resultArray.append(checkup)

        return make_response(jsonify(daysDictionary), 200)
    return make_response(jsonify({}), 404)
