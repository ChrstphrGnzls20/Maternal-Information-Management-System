function fetchDoctorsTally() {
  return $.ajax({
    method: "GET",
    url: `${API_BASE_URL}/reports/doctors-checkup-tally`,
    contentType: "application/json",
    dataType: "json",
  });
}

function fetchClinicServicesTally() {
  return $.ajax({
    method: "GET",
    url: `${API_BASE_URL}/reports/clinic-service-tally`,
    contentType: "application/json",
    dataType: "json",
  });
}
