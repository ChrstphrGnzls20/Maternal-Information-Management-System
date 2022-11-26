let currentLicenseID = "";

// FUNCTION FOR RETRIEVING SELECTED EMPLOYEE INFORMATION USING AJAX AND FILLING THE MODAL WITH THE RETRIEVED INFORMATION WHEN THE AJAX-REQUEST IS SUCCESSFUL
let retrieveEmployeeAndFillModal = function (licenseID) {
  $.ajax({
    method: "GET",
    url: `${API_BASE_URL}/employees/${licenseID}`,
    dataType: "json",
    contentType: "application/json",
  }).done(function (response) {
    let employeeData = response[0];
    console.log(employeeData);
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
    url: `${API_BASE_URL}/employees/${licenseID}`,
    dataType: "json",
    data: JSON.stringify(data),
    contentType: "application/json",
  }).done(function (response) {
    let employeeData = response;

    let toEditEmployeeRow = "";
    let employeeTrs = $(".employees-table tbody tr");
    employeeTrs.each(function () {
      if ($(this).children(".emp-id").text() === currentLicenseID) {
        toEditEmployeeRow = $(this);
        return;
      }
    });
    // REMOVE OUTDATED EMPLOYEE ROW
    toEditEmployeeRow.remove();

    // RE-INSERT WITH UPDATED INFORMATION
    let empTableBody = $(".employees-table tbody");
    let updatedEmployeeRow = generateEmployeeRow(employeeData);

    empTableBody.append(updatedEmployeeRow);

    // ADD EVENT LISTENER TO BUTTON MANUALLY

    // CLOSE MODAL
    summaryModal.modal("hide");
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

    // ATTACH VALIDATORS
    attachValidators($("#edit-employee-form"));

    // RETRIEVE EMPLOYEE INFORMATION AND FILL MODAL
    retrieveEmployeeAndFillModal(currentLicenseID);

    // DISABLE EMPLOYEE ID INPUT, ROLE SELECT
    $("input[name=_id]").prop("disabled", true);
    $("select[name=role]").prop("disabled", true);

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
