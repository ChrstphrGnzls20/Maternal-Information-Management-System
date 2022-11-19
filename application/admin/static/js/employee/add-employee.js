// FUNCTION FOR ADDING EMPLOYEE USING AJAX AND APPENDING IT TO THE TABLE WHEN THE AJAX-REQUEST IS SUCCESSFUL
let addEmployee = function (data) {
  let name = `${data.fName} ${data.mName} ${data.lName}`;
  data["name"] = name;

  // delete seperated name fields
  delete data["fName"];
  delete data["mName"];
  delete data["lName"];

  console.log(data);

  // make AJAX-POST request to backend
  $.ajax({
    method: "POST",
    url: "/admin/employee",
    dataType: "json",
    data: JSON.stringify(data),
    contentType: "application/json",
    success: function (response) {
      if (response.code === "SUCCESS") {
        // location.reload();
        // console.log("Employee registered");
        let empTableBody = $(".employees-table tbody");

        empTableBody.append(generateEmployeeRow(data));

        // close modal
        summaryModal.modal("hide");
      } else {
        // removeErrorMessage();
        // updateErrorMessage(response.errMsg);
      }
    },
    error: function (xhr) {
      //   let errorMsg = xhr.responseJSON.errMsg;
      console.log(xhr);
      //   removeErrorMessage();
      //   updateErrorMessage(errorMsg);
    },
  });
};

$(function () {
  function loadDummy() {
    // let dummyValues = {
    //   licenseID: "12345678",
    //   fName: "Wayne",
    //   mName: "Chico",
    //   lName: "Amazan",
    //   mobile: "09123456789",
    //   role: "Clinician",
    //   status: "Active",
    //   email: "example@gmail.com",
    //   pwd: "123123",
    //   pwd2: "123123",
    // };
    // $("#emp-modal :input[type!=submit]").each(function () {
    //   $(this).val(dummyValues[$(this).attr("name")]);
    // });
  }

  let currentMode = "";
  let submittedValues = {};

  // EXECUTE WHEN 'ADD NEW EMPLOYEE' BUTTON IS CLICKED
  $(".add-emp-btn").on("click", function () {
    // set current mode to 'ADD'
    currentMode = "ADD";

    // GENERATE MODAL CONTENT
    let modalContent = generateModalContent(currentMode);
    employeeModalDialog.append(modalContent);

    // SHOW ADD-EMPLOYEE-MODAL
    employeeModal.modal("show");
    loadDummy();
  });

  // EXECUTE WHEN 'ADD NEW EMPLOYEE' FORM IS SUBMITTED
  $(employeeModal).on("submit", "#add-employee-form", function (evt) {
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

  // EXECUTE WHEN 'ADD NEW EMPLOYEE SUMMARY' FORM IS CLICKED
  $(summaryModal).on("submit", "#add-employee-summary", function (evt) {
    evt.preventDefault();

    addEmployee(submittedValues);
  });
});
