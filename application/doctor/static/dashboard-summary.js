$(function () {
  let doctorID = localStorage.getItem("id");
  let patients = [];
  let searchParams = $.param({
    sortKey: "createdDate",
    sortDirection: -1,
    limit: 5,
  }); // TO SORT THE TABLE BY LATEST CREATED DATE
  let appointments = [];

  function computeEDDFromLMP(_id, LMP) {
    LMP = moment(LMP, "MM/DD/YYYY");

    let EDD;
    let clonedLMP = LMP.clone();
    EDD = clonedLMP.add(7, "days");
    EDD = EDD.subtract(3, "months");
    EDD = EDD.add(1, "years");

    // console.log(_id, LMP.format("MM/DD/YYYY"), EDD.format("MM/DD/YYYY"));
    return EDD;
  }

  // EDD SHOULD BE TYPE OF MOMENT; RETURNS THE NUMBER OF TRIMESTER
  function computeTrimesterFromEDD(EDD) {
    let thirdTrimester = EDD.clone().subtract(13, "weeks");
    let secondTrimester = thirdTrimester.clone().subtract(13, "weeks");
    let firstTrimester = secondTrimester.clone().subtract(13, "weeks");

    // if (thirdTrimester.isSameOrAfter(moment())) {
    //   return 3;
    // } else if (secondTrimester.isSameOrAfter(moment())) {
    //   return 2;
    // } else if (firstTrimester.isSameOrAfter(moment())) {
    //   return 1;
    // } else {
    //   return null;
    // }

    if (
      moment().isBetween(firstTrimester, secondTrimester.clone().add(1, "days"))
    ) {
      return 1;
    } else if (
      moment().isBetween(secondTrimester, thirdTrimester.clone().add(1, "days"))
    ) {
      return 2;
    } else if (thirdTrimester.isSameOrBefore(moment())) {
      return 3;
    } else {
      return null;
    }
  }

  fetchDoctorAppointments(doctorID, searchParams)
    .then(function (response) {
      let data = response;

      console.log(data);
      let appointmentsTableBody = $(".appointment-summary-table tbody");

      let pending = 0;
      let accepted = 0;
      let completed = 0;
      data.forEach(function (item) {
        appointments.push(item);
        // item["patient_id"] = doctorID;
        // TO SHOW APPOINTMENTS WITH STATUS OF PENDING
        if (item["status"] === "pending") {
          pending++;
        } else if (item["status"] === "accepted") {
          accepted++;
        }
        let tr = generateAppointmentTrs(item);
        appointmentsTableBody.append(tr);

        // UPDATE APPOINTMENT SUMMARY CARD
        $(".appointment-summary-card[id=pending] p").text(pending);
        $(".appointment-summary-card[id=accepted] p").text(accepted);
        $(".appointment-summary-card[id=completed] p").text(completed);
      });
    })
    .catch(function (xhr) {
      console.log(xhr);
    });

  fetchPatients(doctorID)
    .then(function (response) {
      console.log(response);
      let data = response;
      data.forEach(function (item) {
        let patient = {
          _id: item._id,
          name: item.basicInformation.name,
          lastVisitDate: item.recentVisit,
          mobile: item.basicInformation.mobile,
          monitoringStatus: item.status,
        };
        patients.push(patient);

        if (item["LMP"] !== undefined) {
          let EDD = computeEDDFromLMP(item._id, item["LMP"]);
          patient["trimester"] = computeTrimesterFromEDD(EDD.clone());
          monthToday = new Date().getMonth();
          monthOfEDD = EDD.month();

          let expectedPatient = {
            name: item.basicInformation.name,
            lastVisitDate: item.recentVisit,
            mobile: item.basicInformation.mobile,
            monitoringStatus: item.status,
          };

          if (parseInt(monthToday) === parseInt(monthOfEDD)) {
            let tr = generateExpectedPatientTr(expectedPatient);

            let expectedPatientTableBody = $(
              ".expected-patient-summary-table tbody"
            );

            expectedPatientTableBody.append(tr);
          }
        }

        let tr = generatePatientTr(patient);

        let patientTableBody = $(".patient-summary-table tbody");

        patientTableBody.append(tr);
      });
    })
    .catch(function (xhr) {
      console.log(xhr);
    });

  $(".appointment-summary-table").on(
    "click",
    "#reject-appointment-btn, #accept-appointment-btn",
    function () {
      selectedAppointmentID = $(this).attr("data-appointment-id");
    }
  );

  // WHEN THE USER ACCEPTS THE APPOINTMENT
  $("#confirm-accept-appointment-btn").on("click", function () {
    console.log("accepted!!!");
    editAppointment(selectedAppointmentID, {
      status: "accepted",
      additionalInfo: {},
    });

    let selectedAppointment = appointments.filter(
      (appt) => appt._id == selectedAppointmentID
    )[0];

    queueSMS(
      selectedAppointment._id,
      selectedAppointment.doctor_id,
      selectedAppointment.patient_id,
      selectedAppointment.patient_name,
      selectedAppointment.appointmentDate
    )
      .then(function (response) {
        console.log(response);
      })
      .catch(function (xhr) {
        console.log(xhr);
      });
  });

  // WHEN THE USER REJECTS THE APPOINTMENT
  $("#confirm-reject-appointment-btn").on("click", function (e) {
    e.preventDefault();
    console.log("rejected!!!");

    let note = $("#rejectionReason").val();

    let followUpDateVal = $("#follow-up-datepicker").val();
    let followUpTimeVal = $("#follow-up-time").val();

    if (followUpDateVal && followUpTimeVal) {
      let followUpDateTime = new Date(
        `${followUpDateVal} ${followUpTimeVal}`
      ).toISOString();

      let selectedAppointment = appointments.filter(
        (appt) => appt._id === selectedAppointmentID
      )[0];

      console.log(selectedAppointment);

      let newAppointment = {
        patient_id: selectedAppointment.patient_id,
        doctor_id: selectedAppointment.doctor_id,
        appointmentDate: followUpDateTime,
      };

      console.log(newAppointment);

      createFollowUpAppointment(newAppointment)
        .then(function (response) {
          let { _id } = response;

          let payload = {
            status: "accepted",
            additionalInfo: {
              note: "AUTOGENERATED: Pre-approved follow-up appointment.",
            },
          };

          preApproveAppointment(_id, payload)
            .then(function (_) {
              queueSMS(
                _id,
                selectedAppointment.doctor_id,
                selectedAppointment.patient_id,
                selectedAppointment.patient_name,
                followUpDateTime
              )
                .then(function (_) {
                  editAppointment(selectedAppointmentID, {
                    status: "rejected",
                    additionalInfo: {
                      note: note,
                      modifierID: doctorID,
                    },
                  });
                })
                .catch(function (xhr) {
                  console.log(xhr);
                });
              console.log(_id);
            })
            .catch(function (xhr) {
              console.log(xhr);
            });
        })
        .catch(function (xhr) {
          console.log(xhr);
        });
    } else {
      editAppointment(selectedAppointmentID, {
        status: "rejected",
        additionalInfo: {
          note: note,
          modifierID: doctorID,
        },
      });
    }
  });

  // WHEN THE USER TRIES TO VIEW THE REJECTED APPOINTMENT
  $(".appointment-summary-table").on(
    "click",
    ".view-rejection-details",
    function () {
      selectedAppointmentID = $(this).attr("data-appointment-id");
      let status = $(this).attr("data-appointment-status");

      let selectedAppointment = {};
      appointments.forEach(function (item) {
        if (item._id === selectedAppointmentID) {
          selectedAppointment = { ...item };
        }
      });

      viewAppointmentSummaryModal(selectedAppointment, status);
    }
  );
});
