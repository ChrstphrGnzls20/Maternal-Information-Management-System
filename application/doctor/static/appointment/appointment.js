$(function () {
  let doctorID = localStorage.getItem("id");
  let appointments = [];
  let searchParams = $.param({
    sortKey: "createdDate",
    sortDirection: -1,
    limit: 5,
  }); // TO SORT THE TABLE BY LATEST CREATED DATE
  let nameFilter = "";
  let statusFilter = "";
  let selectedAppointmentID = "";
  fetchDoctorAppointments(doctorID, searchParams)
    .then(function (response) {
      let data = response;

      console.log(data);
      let appointmentsTableBody = $(".appointments-table tbody");

      let pending = 0;
      let accepted = 0;
      let completed = 0;
      data.forEach(function (item) {
        item["patient_id"] = doctorID;
        appointments.push(item);
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

  $(".appointments-table").on(
    "click",
    "#reject-appointment-btn, #accept-appointment-btn, #cancel-appointment-btn",
    function () {
      selectedAppointmentID = $(this).attr("data-appointment-id");
      console.log(selectedAppointmentID);
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
    console.log("rejected!!!");

    let note = $("#rejectionReason").val();
    // editAppointment(selectedAppointmentID, { status: "rejected", note: note });

    editAppointment(selectedAppointmentID, {
      status: "rejected",
      additionalInfo: {
        note: note,
        modifierID: doctorID,
      },
    });
  });

  // WHEN THE USER CANCELS THE APPOINTMENT
  $("#confirm-cancel-appointment-btn").on("click", function () {
    console.log("rejected!!!");

    let note = $("#cancelReason").val();
    // editAppointment(selectedAppointmentID, { status: "rejected", note: note });

    editAppointment(selectedAppointmentID, {
      status: "canceled",
      additionalInfo: {
        note: note,
        modifierID: doctorID,
      },
    });
  });

  // WHEN THE USER TRIES TO VIEW THE REJECTED APPOINTMENT
  $(".appointments-table").on("click", ".view-rejection-details", function () {
    selectedAppointmentID = $(this).attr("data-appointment-id");
    let selectedAppointment = {};
    let status = $(this).attr("data-appointment-status");

    appointments.forEach(function (item) {
      if (item._id === selectedAppointmentID) {
        selectedAppointment = { ...item };
      }
    });

    viewAppointmentSummaryModal(selectedAppointment, status);
  });

  // FOR FILTERING
  $("#search").on("keyup", function () {
    let value = $(this).val().toLowerCase();
    nameFilter = value;
    filterTable(appointments, nameFilter, statusFilter);
  });

  $("#sortSelect").on("change", function () {
    let value = $(this).val().toLowerCase();
    statusFilter = value;
    filterTable(appointments, nameFilter, statusFilter);
  });
});
