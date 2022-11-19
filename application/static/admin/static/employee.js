// NOTE: GLOBAL VARS
let currentMode = "";
let empForm = $("#employee-form");
let empModal = $("#emp-modal");
let summaryModal = $("#summary-modal");
let currentLicenseID = "";
let submittedValues = {};
let currentFilters = {};

// NOTE: MARKUPS TO BE USED
// alert HTML
let alert = function (alertText) {
  return `
    <div class="alert alert-danger d-flex justify-content-center align-items-center error-msg-ctr" role="alert">
      <span>
          <i class="bi bi-exclamation-circle-fill fs-2 me-2"></i>
      </span>
      <p class="error-msg fs-5 mb-0">${alertText}</p>
    </div>
  `;
};

// FUNCTION FOR CLEARING EMPLOYEES TABLE
let clearTable = function (table) {
  // clear table
  table.children().remove();
  table.append("<tr></tr>");
};

// ROW FOR EMPLOYEES TABLE
let employeeRow = function (employee) {
  return `
    <tr>
      <td class="text-center emp-id">${employee.licenseID}</td>
      <td class="text-center">${employee.name}</td>
      <td class="text-center">${employee.role}</td>
      <td class="text-center">${employee.mobile}</td>
      <td class="text-center">${employee.status}</td>
      <td class="text-center"><button type="button" class="btn btn btn-primary edit-emp-btn"> 
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                  <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                </svg></button></td>
    </tr>
    `;
};

// FUNCTION FOR UPDATING ERROR MESSAGE
let updateErrorMessage = function (message) {
  let modalBody = $("#summary-modal .modal-body");
  modalBody.prepend($(alert(message)));
};

// FUNCTION FOR REMOVING ERROR MESSAGE
let removeErrorMessage = function () {
  let modalBody = $("#summary-modal .modal-body");
  modalBody.find(".error-msg-ctr").remove();
};

// FUNCTION FOR UPDATING SUMMARY MODAL
let updateSummary = function (summaryObject) {
  let summaryTableBody = $(".summary-table tbody");

  summaryTableBody.empty();

  $("#employee-form :input[type!=submit]:input[type!=button]").each(
    function () {
      let key = $(this).attr("data-summary-label");
      let value = $(this).val();

      let summaryItem = `
        <tr>
          <td class="fw-bold fs-5 me-3" scope="row" style="width: 12rem">${key}:</td>
          <td class="fs-5" colspan=2>${value}</td>
        </tr>`;
      // append to summary
      summaryTableBody.append(summaryItem);
    }
  );

  // show summary modal
  empModal.modal("hide");
  summaryModal.modal("show");
};

let submitForm = function (form) {
  // get values from input
  let values = form.serializeArray();
  let constructedData = {};

  // construct data to key-value pairs
  values.forEach(function (item) {
    constructedData[item.name] = item.value;
  });

  // UPDATE SUMMARY UPON FORM SUBMISSION
  updateSummary(constructedData);

  return constructedData;
};

// validator for mobile numbers
$.validator.addMethod(
  "PHNumber",
  function (value, element) {
    const regEx = new RegExp("^(09|\\+639)\\d{9}$");
    return this.optional(element) || regEx.test(value);
  },
  "Please enter a valid phone number"
);

empForm.validate({
  normalizer: function (value) {
    return $.trim(value);
  },
  rules: {
    licenseID: {
      required: true,
    },
    mobile: {
      PHNumber: true,
      digits: true,
    },
  },
});

let addEmployee = function (data) {
  let name = `${data.fName} ${data.mName} ${data.lName}`;
  data["name"] = name;

  // delete seperated name fields
  delete data["fName"];
  delete data["mName"];
  delete data["lName"];

  console.log(data);

  let response = {};

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

        empTableBody.append(employeeRow(data));

        // close modal
        summaryModal.modal("hide");
      } else {
        removeErrorMessage();
        updateErrorMessage(response.errMsg);
      }
    },
    error: function (xhr) {
      let errorMsg = xhr.responseJSON.errMsg;
      removeErrorMessage();
      updateErrorMessage(errorMsg);
    },
  });
};

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
        $("#employee-form :input[type!=button]:input[type!=submit]").each(
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
        // show modal
        empModal.modal("show");
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
        let updatedEmployeeRow = employeeRow(employeeData);

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

let filterTable = function (filter) {
  $.ajax({
    method: "POST",
    url: `/admin/employee/search`,
    dataType: "json",
    data: JSON.stringify(filter),
    contentType: "application/json",
    success: function (response) {
      console.log(response);
      let empTableBody = $(".employees-table tbody");
      // clear table
      clearTable(empTableBody);
      if (response.code === "SUCCESS") {
        // if request is successfull
        let employeesData = response.data;

        employeesData.forEach(function (employee) {
          empTableBody.append(employeeRow(employee));
        });
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

// NOTE: ON LOAD
$(function () {
  // NOTE: ADD FUNCTIONALITY
  $(".add-emp-btn").on("click", function () {
    empModal.modal("show");
    currentMode = "ADD";

    // CLEAR FIELDS
    $("#employee-form :input[type!=button]:input[type!=submit]").each(
      function () {
        $(this).val("");
      }
    );

    // re-enable fields for login credentials
    $("#email").attr("disabled", false);
    $("#pwd").attr("disabled", false);
    $("#pwd2").attr("disabled", false);
  });

  //ON FORM SUBMIT
  $("#employee-form").on("submit", function (e) {
    e.preventDefault();

    submittedValues = submitForm($(this));
  });

  //  when 'confirm' button is clicked in summary modal
  $(".summary-submit-btn").on("click", function () {
    if (currentMode === "ADD") {
      addEmployee(submittedValues);
      return;
    }
    editEmployee(currentLicenseID, submittedValues);
  });

  $(".summary-btn-cancel").on("click", function () {
    summaryModal.modal("hide");
    empModal.modal("show");
  });

  // NOTE: EDIT FUNCTIONALITY
  $(".employees-table").on("click", "button.edit-emp-btn", function () {
    currentMode = "EDIT";

    let licenseID = $(this).parent().siblings(".emp-id").text();
    currentLicenseID = licenseID;
    console.log(licenseID);

    retrieveEmployeeAndFillModal(licenseID);

    // disable fields for login credentials to prevent from editing
    $("#email").attr("disabled", true);
    $("#pwd").attr("disabled", true);
    $("#pwd2").attr("disabled", true);
  });

  $("#filter-tab button").on("click", function () {
    let value = $(this).attr("data-target");

    currentFilters["role"] = value;

    console.log(currentFilters);

    filterTable(currentFilters);
  });

  $("#filter-tab input").on("input", function () {
    let value = $(this).val();

    currentFilters["name"] = { $regex: value, $options: "i" };

    console.log(currentFilters);

    filterTable(currentFilters);
  });

  // NOTE: FOR TESTING
  let dummyValues = {
    licenseID: "12345678",
    fName: "Wayne",
    mName: "Chico",
    lName: "Amazan",
    mobile: "09123456789",
    role: "Clinician",
    status: "Active",
    email: "example@gmail.com",
    pwd: "123123",
    pwd2: "123123",
  };

  $("#employee-form :input[type!=submit]").each(function () {
    $(this).val(dummyValues[$(this).attr("name")]);
  });
});
