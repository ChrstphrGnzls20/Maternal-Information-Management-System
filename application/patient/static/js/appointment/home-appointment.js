function generateAppointmentTrs(appointment) {
  let spanClass = "";
  let dropdownItems = "";
  let scheduleDate = moment(appointment.appointmentDate).format("LL");
  let scheduleTime = moment(appointment.appointmentDate).format("hh:mm a");

  if (appointment.status === "pending") {
    spanClass = "text-warning";
    dropdownItems = `<li><a class="dropdown-item" id='cancel-appointment-btn' href="" data-appointment-id=${appointment._id} data-bs-toggle="modal" data-bs-target="#cancelApptModal">Cancel Appointment</a></li>`;
  } else if (appointment.status === "cancelled") {
    spanClass = "text-danger";
    dropdownItems = `<li><a class="dropdown-item" href="#">View</a></li>`;
  } else {
    spanClass = "text-success";
    dropdownItems = `<li><a class="dropdown-item" href="#">View</a></li>`;
  }
  return ` <tr style="line-height: 40px;">
    <th scope="row" class="text-center">${appointment._id}</th>
    <td class="text-center">${appointment.doctor_id}</td>
    <td class="text-center">${scheduleDate}</td>
    <td class="text-center">${scheduleTime}</td>
    <!-- <td>Pending</td> -->
    <td class="text-center">
        <div class="btn-group">
            <span type="button" class="border-0 p-0 fw-bold btn btn-white dropdown-toggle ${spanClass}" data-bs-toggle="dropdown" aria-expanded="false" style="text-transform: capitalize;">
              ${appointment.status}
            </span>
            <ul class="dropdown-menu">
              ${dropdownItems}
            </ul>
          </div>
    </td>
</tr>`;
}

$(function () {
  let patientID = localStorage.getItem("id");
  $.ajax({
    method: "GET",
    url: `${API_BASE_URL}/appointments/patient/${patientID}`,
    contentType: "application/json",
    dataType: "json",
  })
    .done(function (response) {
      let data = response;
      let appointmentsTableBody = $("#appointments-table tbody");

      data.forEach(function (item) {
        item["patient_id"] = patientID;
        let tr = generateAppointmentTrs(item);
        appointmentsTableBody.append(tr);
      });
    })
    .catch(function (xhr) {
      console.log(xhr);
    });
});
