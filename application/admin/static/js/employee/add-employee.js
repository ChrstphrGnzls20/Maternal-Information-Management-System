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
    url: `${API_BASE_URL}/employees`,
    dataType: "json",
    data: JSON.stringify(data),
    contentType: "application/json",
    // if (response.code === "SUCCESS") {
    //   // location.reload();
    //   // console.log("Employee registered");
    //   let empTableBody = $(".employees-table tbody");
    //   empTableBody.append(generateEmployeeRow(data));
    //   // close modal
    //   summaryModal.modal("hide");
    // } else {
    //   // removeErrorMessage();
    //   // updateErrorMessage(response.errMsg);
    // }
  })
    .done(function (response) {
      let empTableBody = $(".employees-table tbody");
      empTableBody.append(generateEmployeeRow(response));
      // close modal
      summaryModal.modal("hide");
    })
    .catch(function (xhr) {
      console.log(xhr);
      let modalBody = $("#summary-modal .modal-body");
      modalBody.prepend($(generateErrorAlert("Not unique license number!")));
    });
};

function attachValidators(formEl) {
  // CUSTOM PHONE VALIDATION FOR PHILIPPINE NUMBER (STARTING WITH '09')
  $.validator.addMethod(
    "PHNumber",
    function (value, element) {
      const regEx = new RegExp("^(09|\\+639)\\d{9}$");
      return this.optional(element) || regEx.test(value);
    },
    "Please enter a valid phone number"
  );

  // IMPLEMENT VALIDATOR
  formEl.validate({
    normalizer: function (value) {
      return $.trim(value);
    },
    rules: {
      pwd: {
        minlength: 6,
      },
      pwd2: {
        required: true,
        minlength: 6,
        equalTo: "#pwd",
      },
      otp: {
        digits: true,
        minlength: 6,
        maxlength: 6,
      },
      mobile: {
        digits: true,
        minlength: 11,
        maxlength: 11,
        required: true,
        PHNumber: true,
      },
    },
    messages: {
      pwd2: {
        equalTo: "Password does not match!",
      },
      mobile: {
        minlength: "Please enter at least 11 digits",
        PHNumber: "Please enter a valid contact number",
      },
    },
  });
}

$(function () {
  function loadDummy() {
    let dummyValues = {
      _id: "123456",
      fName: "Wayne",
      mName: "Chico",
      lName: "Amazan",
      mobile: "09123456789",
      role: "doctor",
      // status: "aActive",
      email: "example@gmail.com",
      pwd: "123123",
      pwd2: "123123",
    };
    $("#emp-modal :input[type!=submit]").each(function () {
      $(this).val(dummyValues[$(this).attr("name")]);
    });
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

    // ATTACH VALIDATORS
    attachValidators($("#add-employee-form"));

    // SHOW ADD-EMPLOYEE-MODAL
    employeeModal.modal("show");
    loadDummy();
  });

  // EXECUTE WHEN THE ROLE SELECT CHANGES WHILE ADDING AN EMPLOYEE
  $(employeeModal).on("change", "select[name=role]", function () {
    let value = $(this).val();

    let licenseNumInput = $("input[name=_id]");
    let lincenseNumLabel = $("label[for=license-num]");

    if (currentMode === "ADD") {
      if (value === "doctor") {
        licenseNumInput.prop("disabled", false);
        lincenseNumLabel.text("License ID");
      } else {
        licenseNumInput.val("");
        licenseNumInput.prop("disabled", true);
        lincenseNumLabel.text("Employee ID (auto-generated)");
      }
    }

    console.log(value);
  });

  // EXECUTE WHEN 'ADD NEW EMPLOYEE' FORM IS SUBMITTED
  $(employeeModal).on("submit", "#add-employee-form", function (evt) {
    evt.preventDefault();

    // SERIALIZE INPUT VALUES TO '{NAME: '', VALUE: ''}' FORMAT
    if ($(this).valid()) {
      let values = $(this).serializeArray();

      submittedValues = cleanData(values);
      let summaryContent = generateSummaryContent(currentMode);
      summaryModalDialog.append(summaryContent);

      // SHOW SUMMARY MODAL
      summaryModal.modal("show");
      // CLOSE ADD-EMPLOYEE-MODAL
      employeeModal.modal("hide");
    }
  });

  // EXECUTE WHEN 'ADD NEW EMPLOYEE SUMMARY' FORM IS CLICKED
  $(summaryModal).on("submit", "#add-employee-summary", function (evt) {
    evt.preventDefault();

    addEmployee(submittedValues);
  });

  // EXECUTE WHEN 'CANCEL BUTTON IN SUMMARY'FORM IS CLICKED
  $(summaryModal).on("click", "#close-summary-modal-btn", function () {
    // SHOW ADD-EMPLOYEE-MODAL
    employeeModal.modal("show");
    // CLOSE SUMMARY MODAL
    summaryModal.modal("hide");
  });
});

// IMPORTANT: check email for duplication before inserting employee
