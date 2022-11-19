let currentLicenseID = "";

// FUNCTION FOR RETRIEVING SELECTED EMPLOYEE INFORMATION USING AJAX AND FILLING THE MODAL WITH THE RETRIEVED INFORMATION WHEN THE AJAX-REQUEST IS SUCCESSFUL
let retrieveEmployeeAndFillModal = function (licenseID) {
  let filter = { licenseID: licenseID };
  $.ajax({
    method: "POST",
    url: `/admin/employee/search`,
    dataType: "json",
    data: JSON.stringify(filter),
    contentType: "application/json",
    success: function (response) {
      if (response.code === "SUCCESS") {
        // if request is successfull
        let employeeData = response.data[0];
        let [fName, mName, lName] = employeeData.name.split(" ");
        let nameObj = { fName: fName, mName: mName, lName: lName };
        $("#edit-employee-form :input[type!=button]:input[type!=submit]").each(
          function () {
            let name = $(this).attr("name");
            // set value of input accordingly
            $(this).val(employeeData[name]);
            // special cases for name fields
            if (["fName", "mName", "lName"].includes(name)) {
              $(this).val(nameObj[name]);
            }
          }
        );
      } else {
        // removeErrorMessage();
        // updateErrorMessage(response.errMsg);
      }
    },
    error: function (xhr) {
      // let errorMsg = xhr.responseJSON.errMsg;
      // removeErrorMessage();
      // updateErrorMessage(errorMsg);
    },
  });
};

let editEmployee = function (licenseID, data) {
  let name = `${data.fName} ${data.mName} ${data.lName}`;
  data["name"] = name;

  // delete seperated name fields
  delete data["fName"];
  delete data["mName"];
  delete data["lName"];

  console.log(data);
  $.ajax({
    method: "PATCH",
    url: `/admin/employee/edit/${licenseID}`,
    dataType: "json",
    data: JSON.stringify(data),
    contentType: "application/json",
    success: function (response) {
      if (response.code === "SUCCESS") {
        // empModal.modal("hide");
        // location.reload();

        let employeeData = response.data;

        let toEditEmployeeRow = "";
        let employeeTrs = $(".employees-table tbody tr");
        employeeTrs.each(function () {
          if ($(this).children(".emp-id").text() === currentLicenseID) {
            toEditEmployeeRow = $(this);
            return;
          }
        });
        // remove outdated employee row
        toEditEmployeeRow.remove();

        // re-insert with updated information
        let empTableBody = $(".employees-table tbody");
        let updatedEmployeeRow = generateEmployeeRow(employeeData);

        empTableBody.append(updatedEmployeeRow);

        // add event listener to button manually

        // close modal
        summaryModal.modal("hide");
      } else {
        //
      }
    },
    error: function (xhr) {
      // let errorMsg = xhr.responseJSON.errMsg;
      // removeErrorMessage();
      // updateErrorMessage(errorMsg);
    },
  });
};

$(function () {
  let submittedValues = {};
  // EXECUTE WHEN 'EDIT EMPLOYEE' BUTTON IS CLICKED
  $(".employees-table").on("click", "button.edit-emp-btn", function (evt) {
    evt.preventDefault();

    let licenseID = $(this).parent().siblings(".emp-id").text();
    currentLicenseID = licenseID;

    // set current mode to 'EDIT'
    currentMode = "EDIT";

    // GENERATE MODAL CONTENT
    let modalContent = generateModalContent(currentMode);
    employeeModalDialog.append(modalContent);

    // RETRIEVE EMPLOYEE INFORMATION AND FILL MODAL
    retrieveEmployeeAndFillModal(currentLicenseID);

    // SHOW EDIT-EMPLOYEE-MODAL
    employeeModal.modal("show");
  });

  // EXECUTE WHEN 'ADD NEW EMPLOYEE' FORM IS SUBMITTED
  $(employeeModal).on("submit", "#edit-employee-form", function (evt) {
    evt.preventDefault();

    // SERIALIZE INPUT VALUES TO '{NAME: '', VALUE: ''}' FORMAT
    let values = $(this).serializeArray();

    submittedValues = cleanData(values);
    let summaryContent = generateSummaryContent(currentMode);
    summaryModalDialog.append(summaryContent);

    // SHOW SUMMARY MODAL
    summaryModal.modal("show");
    // CLOSE ADD-EMPLOYEE-MODAL
    employeeModal.modal("hide");
  });

  // EXECUTE WHEN 'EDIT EMPLOYEE SUMMARY' FORM IS SUBMITTED
  $(summaryModal).on("submit", "#edit-employee-summary", function (evt) {
    evt.preventDefault();

    editEmployee(currentLicenseID, submittedValues);
  });
});
