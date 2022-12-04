$(function () {
  let doctorID = localStorage.getItem("id");
  let searchParams = $.param({
    sortKey: "createdDate",
    sortDirection: -1,
    limit: 5,
  }); // TO SORT THE TABLE BY LATEST CREATED DATE
  let appointments = [];

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
        item["patient_id"] = doctorID;
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
  });

  // WHEN THE USER REJECTS THE APPOINTMENT
  $("#confirm-reject-appointment-btn").on("click", function () {
    let note = $("#rejectionReason").val();
    editAppointment(selectedAppointmentID, {
      status: "rejected",
      additionalInfo: {
        note: note,
      },
    });
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
