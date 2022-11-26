let currentServiceID;
// FUNCTION FOR RETRIEVING SELECTED SERVICE'S INFORMATION USING AJAX AND FILLING THE MODAL WITH THE RETRIEVED INFORMATION WHEN THE AJAX-REQUEST IS SUCCESSFUL
let retrieveEmployeeAndFillModal = function (serviceID) {
  //   let filter = { _id: serviceID };
  $.ajax({
    method: "GET",
    url: `${API_BASE_URL}/clinic-services/${serviceID}`,
    contentType: "application/json",
    dataType: "json",
  })
    .done(function (response) {
      if (response) {
        serviceData = response[0];
        console.log(serviceData);

        $("#edit-service-form :input[type!=button]:input[type!=submit]").each(
          function () {
            let name = $(this).attr("name");
            // SET VALUE ACCORDING TO NAME
            $(this).val(serviceData[name]);
          }
        );
      }
    })
    .catch(function (xhr) {
      console.log(xhr);
    });
};

function editService(serviceID, newServiceData) {
  $.ajax({
    method: "PATCH",
    url: `${API_BASE_URL}/clinic-services/${serviceID}`,
    dataType: "json",
    data: JSON.stringify(newServiceData),
    contentType: "application/json",
  })
    .done(function (response) {
      // CONSIDERING THAT THE SERVICE ID IS NON-EDITABLE
      response._id = serviceID;

      let updatedServiceData = response;

      let toEditServiceRow = "";
      let serviceTrs = $(".service-table tbody tr");

      serviceTrs.each(function () {
        if ($(this).children(".service-id").text() === serviceID) {
          toEditServiceRow = $(this);
          return;
        }
      });

      let updatedEmployeeRow = generateServiceRow(updatedServiceData);

      // APPEND NEXT TO THE OLD SERVICE ROW
      $(updatedEmployeeRow).insertAfter(toEditServiceRow);
      // REMOVE OUTDATED SERVICE ROW
      toEditServiceRow.remove();

      // CLOSE SUMMARY MODAL
      summaryModal.modal("hide");
    })
    .catch(function (xhr) {
      console.log(xhr);
    });
}

$(function () {
  let submittedValues = {};
  let mode = "";
  // EXECUTE WHEN 'EDIT SERVICE' BUTTON IS CLICKED
  $(".service-table").on("click", "button.edit-service-btn", function (evt) {
    evt.preventDefault();

    let serviceID = $(this).parent().siblings(".service-id").text();

    // SET THIS GLOBAL VARIABLE TO BE USED WHEN EDITING THE SERVICE INFORMATION
    currentServiceID = serviceID;

    // set current mode to 'EDIT'
    mode = "EDIT";

    // GENERATE MODAL CONTENT
    let modalContent = generateModalContent(mode);
    serviceModalDialog.append(modalContent);

    // RETRIEVE SERVICE INFORMATION AND FILL MODAL
    retrieveEmployeeAndFillModal(currentServiceID);

    // SHOW EDIT-SERVICE-MODAL
    serviceModal.modal("show");
  });

  // EXECUTE WHEN 'EDIT SERVICE' FORM IS SUBMITTED
  $(serviceModal).on("submit", "#edit-service-form", function (evt) {
    evt.preventDefault();

    // SERIALIZE INPUT VALUES TO '{NAME: '', VALUE: ''}' FORMAT
    let values = $(this).serializeArray();

    submittedValues = cleanData(values);
    let summaryContent = generateSummaryContent(mode);
    summaryModalDialog.append(summaryContent);

    // SHOW SUMMARY MODAL
    summaryModal.modal("show");
    // CLOSE ADD-SERVICE-MODAL
    serviceModal.modal("hide");
  });

  //   // EXECUTE WHEN 'EDIT SERVICE SUMMARY' FORM IS SUBMITTED
  $(summaryModal).on("submit", "#edit-service-summary", function (evt) {
    evt.preventDefault();

    editService(currentServiceID, submittedValues);
  });
});
