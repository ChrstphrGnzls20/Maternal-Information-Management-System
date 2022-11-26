$(function () {
  let selectedAppointmentID = "";
  let patientID = localStorage.getItem("id");

  $("#appointments-table").on("click", "#cancel-appointment-btn", function () {
    selectedAppointmentID = $(this).attr("data-appointment-id");
  });

  $("#confirm-cancel-appointment-btn").on("click", function () {
    console.log(`Appointment ID: ${selectedAppointmentID}`);
    console.log(`Patient ID: ${patientID}`);

    $.ajax({
      method: "PATCH",
      url: `${API_BASE_URL}/appointments/${selectedAppointmentID}/cancel`,
      contentType: "application/json",
      dataType: "json",
    })
      .done(function (response) {
        // IF SUCCESSFULLY CANCELLED AN APPOINTMENT, REDIRECT BACK TO APPOINTMENTS TABLE
        if (response) {
          location.href = "/patient/appointments";
        }
      })
      .catch(function (xhr) {
        console.log(xhr);
      });
  });
});
