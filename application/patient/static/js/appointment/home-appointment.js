function generateAppointmentTrs(appointment) {
  let statusEl = "";
  let scheduleDate = moment(appointment.appointmentDate).format("LL");
  let scheduleTime = moment(appointment.appointmentDate).format("hh:mm a");

  if (appointment.status === "pending") {
    statusEl = `
    <div class="btn-group">
      <span type="button" class="border-0 p-0 fw-bold btn btn-white dropdown-toggle text-capitalize text-warning" data-bs-toggle="dropdown" aria-expanded="false">
        ${appointment.status}
      </span>
      <ul class="dropdown-menu">
        <li>
          <a class="dropdown-item" id='cancel-appointment-btn' href="" data-appointment-id=${appointment._id} data-bs-toggle="modal" data-bs-target="#cancelApptModal">Cancel Appointment</a>
        </li>
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
    statusEl = `
    <div class="btn-group">
      <span type="button" class="border-0 p-0 fw-bold btn btn-white dropdown-toggle text-capitalize text-success" data-bs-toggle="dropdown" aria-expanded="false">
        ${appointment.status}
      </span>
      <ul class="dropdown-menu">
        <li>
          <a class="dropdown-item" id='cancel-appointment-btn' href="" data-appointment-id=${appointment._id} data-bs-toggle="modal" data-bs-target="#cancelApptModal">Cancel Appointment</a>
        </li>
      </ul>
    </div>`;
    // statusEl = `<p class="fw-bold text-capitalize text-success me-3 mb-0">${appointment.status}</p>`;
  }
  return ` <tr style="line-height: 40px;">
    <th scope="row" class="text-center">${appointment._id}</th>
    <td class="text-center">${appointment.doctor_name}</td>
    <td class="text-center">${scheduleDate}</td>
    <td class="text-center">${scheduleTime}</td>
    <!-- <td>Pending</td> -->
    <td class="text-center">
        ${statusEl}
    </td>
</tr>`;
}

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
  let toBeDisplayedName;
  let userID = localStorage.getItem("id");
  if (
    status === "canceled" &&
    appointment.additionalInfo.modifierID === userID
  ) {
    toBeDisplayedName = `${appointment.patient_name} (You)`;
  } else if (status === "canceled" && appointment.patient_name !== userID) {
    toBeDisplayedName = `${appointment.doctor_name}`;
  } else {
    toBeDisplayedName = appointment.doctor_name;
  }
  // toBeDisplayedName =
  //   status === "rejected"
  //     ? appointment.doctor_name
  //     : `${appointment.patient_name} (You)`;

  let content = `
      <p>Appoinment <b>${appointment._id}</b> was ${appointment.status} by <b>${toBeDisplayedName}</b> on <b>${dateModified} at ${timeModified}</b>.</p>
      <p class="mb-0 fw-bold">Reason:</p>
      <p>${rejectionNote}</p>`;

  // APPEND FORMATTED CONTENT TO MODAL
  modalBody.empty();
  modalBody.append(content);
}

function checkForExistingAppointment(patientID) {
  const searchParam = $.param({ status: "pending|accepted" });
  return $.ajax({
    method: "GET",
    url: `${API_BASE_URL}/appointments/patient/${patientID}?${searchParam}`,
    contentType: "application/json",
    dataType: "json",
  });
}

function checkForRecentCancellation(appointments) {
  let hasRecentCancellation = 0;
  appointments.forEach(function (item) {
    if (
      item.status === "canceled" &&
      item.additionalInfo.modifierID === localStorage.getItem("id")
    ) {
      let canceledDate = moment(item.additionalInfo.dateModified, "YYYY-MM-DD");
      let dateDiff = parseInt(moment().diff(canceledDate, "days"));
      if (dateDiff === 0) {
        hasRecentCancellation++;
      }
    }
  });
  return hasRecentCancellation;
}

$(function () {
  let patientID = localStorage.getItem("id");
  let searchParams = $.param({ sortKey: "createdDate", sortDirection: -1 }); // TO SORT THE TABLE BY LATEST CREATED DATE
  let appointments = [];
  $.ajax({
    method: "GET",
    url: `${API_BASE_URL}/appointments/patient/${patientID}?${searchParams}`,
    contentType: "application/json",
    dataType: "json",
  })
    .done(function (response) {
      let data = response;

      console.log(data);
      let appointmentsTableBody = $("#appointments-table tbody");

      data.forEach(function (item) {
        appointments.push(item);
        item["patient_id"] = patientID;
        let tr = generateAppointmentTrs(item);
        appointmentsTableBody.append(tr);
      });

      let numberOfCancellations = checkForRecentCancellation(appointments);
      localStorage.setItem("cancellationMadeToday", numberOfCancellations);
    })
    .catch(function (xhr) {
      console.log(xhr);
    });

  // WHEN THE USER TRIES TO CREATE A NEW APPOINTMENT
  $("#new-appointment-btn").on("click", function () {
    checkForExistingAppointment(patientID).then(function (response) {
      if (!response.length) {
        // LIMIT THE CANCELLED APPOINTMENT TO 3
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
        // IF NO RECENT CANCELLATION AND NO PENDING APPOINTMENT, REDIRECT TO CREATE APPOINTMENT PAGE
        location.href = "/patient/appointments/create";
      } else {
        let data = response[0];
        let scheduleDate = moment(data.appointmentDate).format("LL");
        let scheduleTime = moment(data.appointmentDate).format("hh:mm a");
        let modal = $("#existingAppointmentModal");
        let modalBody = $("#existingAppointmentModal .modal-body");
        let statusString;
        if (data.status.toLowerCase() === "pending") {
          statusString = "waiting for approval";
        } else if (data.status.toLowerCase() === "accepted") {
          statusString = "that was accepted";
        }
        modalBody.empty();
        modalBody.append(`
        <p>
          You have an appointment ${statusString}  <b>(ref: ${data._id})</b> scheduled on <b>${scheduleDate} at ${scheduleTime}</b>.</p> 
        <p>Either cancel it or wait for the doctor to approve/reject your pending appointment.
        </p>`);
        $(modal).modal("show");
      }
    });
  });

  // WHEN THE USER TRIES TO VIEW THE REJECTED APPOINTMENT
  $("#appointments-table").on("click", ".view-rejection-details", function () {
    selectedAppointmentID = $(this).attr("data-appointment-id");

    let status = $(this).attr("data-appointment-status");
    console.log(status);
    let selectedAppointment = {};
    appointments.forEach(function (item) {
      if (item._id === selectedAppointmentID) {
        selectedAppointment = { ...item };
      }
    });

    viewAppointmentSummaryModal(selectedAppointment, status);
  });
});
