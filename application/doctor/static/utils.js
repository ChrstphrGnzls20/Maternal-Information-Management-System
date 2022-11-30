let selectedAppointmentID = "";

function generateAppointmentTrs(appointment) {
  let statusEl = "";
  let scheduleDate = moment(appointment.appointmentDate).format("LL");
  let scheduleTime = moment(appointment.appointmentDate).format("hh:mm a");
  let createdDate = moment(appointment.createdDate).format("LL");

  if (appointment.status === "pending") {
    statusEl = `
      <div class="btn-group position-static">
        <span type="button" class="border-0 p-0 fw-bold btn btn-white dropdown-toggle text-capitalize text-warning" data-bs-toggle="dropdown" aria-expanded="false">
          ${appointment.status}
        </span>
        <ul class="dropdown-menu ">
            <li><a class="dropdown-item" id='reject-appointment-btn' href="" data-appointment-id=${appointment._id} data-bs-toggle="modal" data-bs-target="#rejectApptModal">Reject Appointment</a></li>
            <li><a class="dropdown-item" id='accept-appointment-btn' href="" data-appointment-id=${appointment._id} data-bs-toggle="modal" data-bs-target="#acceptApptModal">Accept Appointment</a></li>
        </ul>
      </div>`;
  } else if (
    appointment.status === "canceled" ||
    appointment.status === "rejected"
  ) {
    statusEl = `
      <div class="btn-group">
        <span type="button" class="border-0 p-0 fw-bold btn btn-white dropdown-toggle text-capitalize text-danger" data-bs-toggle="dropdown" aria-expanded="false">
          ${appointment.status}
        </span>
        <ul class="dropdown-menu">
          <li><a class="dropdown-item view-rejection-details" data-appointment-id=${appointment._id} data-appointment-status=${appointment.status} data-bs-toggle="modal" data-bs-target="#rejectSummaryModal" >View</a></li>
        </ul>
      </div>`;
  } else {
    statusEl = `<p class="fw-bold text-capitalize text-success me-3 mb-0">${appointment.status}</p>`;
  }
  return ` <tr style="line-height: 40px;">
      <th scope="row" class="text-center">${appointment._id}</th>
      <td class="text-center">${appointment.patient_name}</td>
      <td class="text-center">${scheduleDate}</td>
      <td class="text-center">${scheduleTime}</td>
      <td class="text-center">${createdDate}</td>
      <!-- <td>Pending</td> -->
      <td class="text-center">
          ${statusEl}
      </td>
  </tr>`;
}

function editAppointment(selectedAppointmentID, payload) {
  console.log();
  $.ajax({
    method: "PATCH",
    url: `${API_BASE_URL}/appointments/${selectedAppointmentID}`,
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify(payload),
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
}

let fetchDoctorAppointments = (doctorID, searchParams) => {
  return $.ajax({
    method: "GET",
    url: `${API_BASE_URL}/appointments/doctor/${doctorID}?${searchParams}`,
    contentType: "application/json",
    dataType: "json",
  });
};

function filterTable(data, patientName = "", appointmentStatus = "") {
  let appointmentsTableBody = $(".appointments-table tbody");
  appointmentsTableBody.empty();
  appointmentsTableBody.append("<tr></tr>");
  if (!patientName && !appointmentStatus) {
    data.forEach(function (item) {
      let tr = generateAppointmentTrs(item);
      appointmentsTableBody.append(tr);
    });
    return;
  }
  console.log(patientName, appointmentStatus);

  const nameRegex = new RegExp(patientName, "i");
  const statusRegex = new RegExp(appointmentStatus, "i");
  data.forEach(function (item) {
    if (
      item.patient_name.search(nameRegex) > -1 &&
      item.status.search(statusRegex) > -1
    ) {
      let tr = generateAppointmentTrs(item);
      appointmentsTableBody.append(tr);
    }
  });
}

// function viewAppointmentSummaryModal(appointment) {
//   let modalBody = $("#rejectSummaryModal .modal-body");
//   let rejectionNote = appointment.additionalInfo.note
//     ? appointment.additionalInfo.note
//     : "Not specified";
//   let dateModified = moment(appointment.additionalInfo.dateModified).format(
//     "LL"
//   );
//   let timeModified = moment(appointment.additionalInfo.dateModified).format(
//     "hh:mm a"
//   );
//   let content = `
//       <p>Appoinment <b>${appointment._id}</b> was rejected by <b>${appointment.doctor_name}</b> on <b>${dateModified} at ${timeModified}</b>.</p>
//       <p class="mb-0 fw-bold">Reason:</p>
//       <p>${rejectionNote}</p>`;

//   // APPEND FORMATTED CONTENT TO MODAL
//   modalBody.empty();
//   modalBody.append(content);
// }
function viewAppointmentSummaryModal(appointment, status) {
  let modalBody = $("#rejectSummaryModal .modal-body");
  let rejectionNote = appointment.additionalInfo.note
    ? appointment.additionalInfo.note
    : "Not specified";
  let dateModified = moment(appointment.additionalInfo.dateModified).format(
    "LL"
  );
  let timeModified = moment(appointment.additionalInfo.dateModified).format(
    "hh:mm a"
  );
  let toBeDisplayedName =
    status === "rejected"
      ? `${appointment.doctor_name} (You)`
      : appointment.patient_name;

  let content = `
      <p>Appoinment <b>${appointment._id}</b> was ${appointment.status} by <b>${toBeDisplayedName}</b> on <b>${dateModified} at ${timeModified}</b>.</p>
      <p class="mb-0 fw-bold">Reason:</p>
      <p>${rejectionNote}</p>`;

  // APPEND FORMATTED CONTENT TO MODAL
  modalBody.empty();
  modalBody.append(content);
}
