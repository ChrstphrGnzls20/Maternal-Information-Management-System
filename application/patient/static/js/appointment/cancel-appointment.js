$(function () {
  let selectedAppointmentID = "";
  let patientID = localStorage.getItem("id");

  $("#appointments-table").on("click", "#cancel-appointment-btn", function () {
    selectedAppointmentID = $(this).attr("data-appointment-id");
  });

  $("#confirm-cancel-appointment-btn").on("click", function () {
    let cancelReason = $("#cancelReason").val();

    $.ajax({
      method: "PATCH",
      url: `${API_BASE_URL}/appointments/${selectedAppointmentID}`,
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify({
        status: "canceled",
        additionalInfo: {
          note: cancelReason,
        },
      }),
    })
      .done(function (response) {
        // IF SUCCESSFULLY CANCELLED AN APPOINTMENT, REDIRECT BACK TO APPOINTMENTS TABLE
        if (response) {
          location.reload();
        }
      })
      .catch(function (xhr) {
        console.log(xhr);
      });
  });
});
