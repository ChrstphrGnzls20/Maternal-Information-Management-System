$(function () {
  let selectedAppointmentID = "";

  $("#appointments-table").on("click", "#cancel-appointment-btn", function () {
    selectedAppointmentID = $(this).attr("data-appointment-id");
    let cancellationsAvailable =
      3 - localStorage.getItem("cancellationMadeToday");
    $(".cancellation-number").html(
      `Are you sure you want to <b>cancel</b> this appointment? <br/> You only have <b>${cancellationsAvailable} cancellation/s </b> that can be made today.`
    );
  });

  $("#confirm-cancel-appointment-btn").on("click", function () {
    if (localStorage.getItem("cancellationMadeToday") > 2) {
      let modal = $("#existingAppointmentModal");
      let modalBody = $("#existingAppointmentModal .modal-body");
      modalBody.empty();
      modalBody.append(`
      <p>You have canceled several appointments today. </p> 
      <p>Please try again tomorrow.</p>`);
      $(modal).modal("show");
      return;
    }
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
          modifierID: localStorage.getItem("id"),
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
