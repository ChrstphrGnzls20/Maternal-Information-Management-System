function generateServiceRow(service) {
  return `
    <tr>
    <td class="text-center service-id">${service._id}</td>
    <td class="text-center">${service.name}</td>
    <td class="text-center">${service.description}</td>
    <td class="text-center">${service.price}</td>
    <td class="text-center">${service.status}</td>
    <td class="text-center"><button type="button" class="btn btn btn-primary edit-service-btn"> 
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                </svg></button></td>
    </tr>
    `;
}

// FUNCTION FOR GETTING RANDOMLY GENERATED SERVICE ID USING AJAX AND LOADING IT TO THE 'SERVICEID' INPUT WHEN THE AJAX-REQUEST IS SUCCESSFUL
function fetchAndLoadServiceID() {
  $.ajax({
    method: "GET",
    url: `${API_BASE_URL}/clinic-services/generate-id`,
    contentType: "application/json",
    dataType: "json",
  }).done(function (response) {
    let generatedID = response._id;
    let serviceIDInput = $("#serviceID");
    serviceIDInput.val(generatedID);
  });
}

function addService(data) {
  $.ajax({
    method: "POST",
    url: `${API_BASE_URL}/clinic-services`,
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify(data),
  }).done(function (response) {
    // IF RESPONSE HAS THE INSERTED DATA
    if (response) {
      let serviceTableBody = $(".service-table tbody");

      serviceTableBody.append(generateServiceRow(response));

      // close modal
      summaryModal.modal("hide");
    }
  });
}

$(function () {
  let mode = "";
  $(".add-service-btn").on("click", function () {
    mode = "ADD";
    let modalContent = generateModalContent(mode);
    serviceModalDialog.append(modalContent);

    // FETCH RANDOMLY GENERATED SERVICE ID AND LOAD IT TO 'SERVICEID' input
    fetchAndLoadServiceID();

    // SHOW ADD-SERVICE-MODAL
    serviceModal.modal("show");
  });

  // EXECUTE WHEN 'ADD NEW SERVICE' FORM IS SUBMITTED
  $(serviceModal).on("submit", "#add-service-form", function (evt) {
    evt.preventDefault();

    // SERIALIZE INPUT VALUES TO '{NAME: '', VALUE: ''}' FORMAT
    let values = $(this).serializeArray();

    // GET SERVICEID VALUE
    let serviceID = $("#serviceID").val();

    // APPEND IT TO THE FORM VALUES AFTER SERIALIZING
    // values.push({ name: "_id", value: serviceID });

    submittedValues = cleanData(values);
    let summaryContent = generateSummaryContent(mode);
    summaryModalDialog.append(summaryContent);

    // SHOW SUMMARY MODAL
    summaryModal.modal("show");
    // CLOSE ADD-SERVICE-MODAL
    serviceModal.modal("hide");
  });

  // EXECUTE WHEN 'ADD NEW SERVICE SUMMARY' FORM IS SUBMITTED
  $(summaryModal).on("submit", "#add-service-summary", function (evt) {
    evt.preventDefault();

    addService(submittedValues);
  });
});
