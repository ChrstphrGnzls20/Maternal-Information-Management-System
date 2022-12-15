$(function () {
  let doctorID = localStorage.getItem("_id");
  fetchPatients(doctorID)
    .then(function (response) {
      console.log(response);
      let data = response;

      data.forEach(function (item) {
        // TODO: MISSING ATTRs (trimester, monitoringStatus, lastVisitDate)
        let lastVisitDate = item.lastVisitDate ? item.lastVisitDate : "";
        let monitoringStatus = item.monitoringStatus
          ? item.monitoringStatus
          : "";
        let trimester = item.trimester ? item.trimester : 1;
        let patient = {
          _id: item._id,
          name: item.basicInformation.name,
          lastVisitDate,
          trimester,
          mobile: item.basicInformation.mobile,
          monitoringStatus,
        };

        let tr = generatePatientTr(patient);

        let patientTableBody = $(".patient-summary-table tbody");

        patientTableBody.append(tr);
      });
    })
    .catch(function (xhr) {
      console.log(xhr);
    });
});
