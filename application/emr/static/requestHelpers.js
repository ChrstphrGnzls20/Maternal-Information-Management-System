function addNewCheckup(data) {
  return $.ajax({
    method: "POST",
    url: `${API_BASE_URL}/emr`,
    data: JSON.stringify(data),
    dataType: "json",
    contentType: "application/json",
  });
}

function updatePatientHistory(patientID, payload) {
  return $.ajax({
    method: "PATCH",
    url: `${API_BASE_URL}/patients/${patientID}/history`,
    data: JSON.stringify(payload),
    dataType: "json",
    contentType: "application/json",
  });
}

function fetchPatientHistory(patientID) {
  return $.ajax({
    method: "GET",
    url: `${API_BASE_URL}/patients/${patientID}/history`,
    dataType: "json",
    contentType: "application/json",
  });
}

function preApproveAppointment(appointmentID, payload) {
  return $.ajax({
    method: "PATCH",
    url: `${API_BASE_URL}/appointments/${appointmentID}`,
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify(payload),
  });
}

function createFollowUpAppointment(data) {
  return $.ajax({
    method: "POST",
    url: `${API_BASE_URL}/appointments`,
    data: JSON.stringify(data),
    dataType: "json",
    contentType: "application/json",
  });
}

function fetchClinicServices() {
  return $.ajax({
    method: "GET",
    url: `${API_BASE_URL}/clinic-services`,
    dataType: "json",
    contentType: "application/json",
  });
}
