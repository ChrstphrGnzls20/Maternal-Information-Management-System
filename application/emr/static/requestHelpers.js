function addNewCheckup(data) {
  return $.ajax({
    method: "POST",
    url: `${API_BASE_URL}/emr`,
    data: JSON.stringify(data),
    dataType: "json",
    contentType: "application/json",
  });
}

function createFollowUpAppointment(data) {
  return $.ajax({
    method: "POST",
    url: `${API_BASE_URL}/appointments`,
    data: JSON.stringify(data),
    dataType: "json",
    contentType: "application/json",
  })
    .then(function (response) {
      let { _id } = response;

      let payload = {
        status: "accepted",
        additionalInfo: {
          note: "",
        },
      };
      $.ajax({
        method: "PATCH",
        url: `${API_BASE_URL}/appointments/${_id}`,
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(payload),
      })
        .then(function (_) {
          localStorage.removeItem("activeEMRView");
          localStorage.removeItem("emr-data");
          location.href = `/doctor/patients`;
        })
        .catch(function (xhr) {
          console.log(xhr);
        });
    })
    .catch(function (xhr) {
      console.log(xhr);
    });
}
