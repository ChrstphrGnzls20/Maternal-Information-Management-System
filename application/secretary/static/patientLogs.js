$(function () {
  function generatePatientLogsTr(
    dateCompleted,
    patientName,
    age,
    mobile,
    patientStatus,
    followUpDate,
    diagnosis
  ) {
    return `
        <tr>
            <td>${dateCompleted}</td>
            <td>${patientName}</td>
            <td>${age}</td>
            <td>${mobile}</td>
            <td>${patientStatus}</td>
            <td>${followUpDate}</td>
            <td>${diagnosis}</td>
          </tr>
        `;
  }

  let checkupLogsForToday = [];
  fetchCheckups()
    .then(function (response) {
      if (response) {
        let data = response;

        checkupLogsForToday = data.filter(function (item) {
          let parsedDate = moment(item.completedDate, "YYYY-MM-DD").format(
            "MM/DD/YYYY"
          );
          const parsedDateToday = moment().format("MM/DD/YYYY");

          return parsedDate === parsedDateToday;
        });

        const patientLogsTbody = $(".patient-summary-table tbody");
        patientLogsTbody.empty();
        patientLogsTbody.append(`<tr></tr>`);

        checkupLogsForToday.forEach(function (item) {
          //
          const patientName = item.patientName;
          const date = moment(item.completedDate).format("MM/DD/YYYY");
          const parsedBday = moment(item.bday, "MM/DD/YYYY");
          const age = moment().diff(parsedBday, "years");
          const mobile = item.mobile;
          const patientStatus = item.plan.carePlan.patientStatus;
          let followUpDate;

          if (item.plan.carePlan.followUpDate) {
            followUpDate = moment(
              item.plan.carePlan.followUpDate,
              "YYYY-MM-DD"
            ).format("MM/DD/YYYY");
          } else {
            followUpDate = "Not specified";
          }

          const diagnosis = item.assessment.diagnosis;

          patientLogsTbody.append(
            generatePatientLogsTr(
              date,
              patientName,
              age,
              mobile,
              patientStatus,
              followUpDate,
              diagnosis
            )
          );
        });
      }
    })
    .catch(function (xhr) {
      console.log(xhr);
    });
});
