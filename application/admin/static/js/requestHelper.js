function fetchDoctorsTally(year, month = null) {
  let searchParam;
  if (month === null) {
    searchParam = $.param({
      year,
    });
  } else {
    searchParam = $.param({
      year,
      month,
    });
  }
  return $.ajax({
    method: "GET",
    url: `${API_BASE_URL}/reports/doctors-checkup-tally?${searchParam}`,
    contentType: "application/json",
    dataType: "json",
  });
}

function fetchAttendanceTally(year, month = null) {
  let searchParam;
  if (month === null) {
    searchParam = $.param({
      year,
    });
  } else {
    searchParam = $.param({
      year,
      month,
    });
  }
  return $.ajax({
    method: "GET",
    url: `${API_BASE_URL}/reports/doctors-attendance?${searchParam}`,
    contentType: "application/json",
    dataType: "json",
  });
}

function fetchClinicServicesTally(year, month = null) {
  let searchParam;
  if (month === null) {
    searchParam = $.param({
      year,
    });
  } else {
    searchParam = $.param({
      year,
      month,
    });
  }
  return $.ajax({
    method: "GET",
    url: `${API_BASE_URL}/reports/clinic-service-tally?${searchParam}`,
    contentType: "application/json",
    dataType: "json",
  });
}

function fetchCheckupTally(year, month = null) {
  let searchParam;
  if (month === null) {
    searchParam = $.param({
      year,
    });
  } else {
    searchParam = $.param({
      year,
      month,
    });
  }

  return $.ajax({
    method: "GET",
    url: `${API_BASE_URL}/reports/number-of-patient-tally?${searchParam}`,
    contentType: "application/json",
    dataType: "json",
  });
}

// REPORTS REQUEST HANDLERS
function fetchReport(reportName, year, month = null) {
  let searchParam;
  if (month === null) {
    searchParam = $.param({
      year,
    });
  } else {
    searchParam = $.param({
      year,
      month,
    });
  }

  window.open(`/admin/${reportName}?${searchParam}`, "_blank");

  // return $.ajax({
  //   method: "GET",
  //   url: `${ABSOLUTE_BASE_URL}/admin/${reportName}?${searchParam}`,
  //   contentType: "application/json",
  //   dataType: "json",
  // });
}
