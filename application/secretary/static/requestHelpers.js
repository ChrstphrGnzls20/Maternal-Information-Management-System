function fetchSchedules() {
  return $.ajax({
    method: "GET",
    url: `${API_BASE_URL}/doctors/schedules`,
    contentType: "application/json",
    dataType: "json",
  });
}

function checkIn(scheduleID, payload) {
  return $.ajax({
    method: "PATCH",
    url: `${API_BASE_URL}/doctors/schedules/${scheduleID}`,
    data: JSON.stringify(payload),
    contentType: "application/json",
    dataType: "json",
  });
}

function fetchCheckups() {
  return $.ajax({
    method: "GET",
    url: `${API_BASE_URL}/emr`,
    contentType: "application/json",
    dataType: "json",
  });
}
