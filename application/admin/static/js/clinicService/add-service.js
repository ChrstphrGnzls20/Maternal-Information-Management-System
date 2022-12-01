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
