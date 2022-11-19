// TODO: fix bugs
// TODO: check employee ID before updating to avoid duplication
// TODO: custom validation for license ID if existing
// TODO: input validation (alphanumeric only)
// TODO: Decide whether to create a two seperate modals (add/edit) and decide whether to reload page on every add/edit or use jquery to manipulate DOM dynamically for better accessibility and responsiveness

// alert HTML
alert = function (alertText) {
  return `
  <div class="alert alert-danger d-flex justify-content-center align-items-center error-msg-ctr" role="alert">
    <span>
        <i class="bi bi-exclamation-circle-fill fs-2 me-2"></i>
    </span>
    <p class="error-msg fs-5 mb-0">${alertText}</p>
  </div>
`;
};

let empForm = $("#employee-form");

// modals
let empModal = $("#emp-modal");
// let editEmpModal = $("#edit-emp-modal");
let summaryModal = $("#summary-modal");

// custom phone validation for philippine number (starting with '09')
$.validator.addMethod(
  "PHNumber",
  function (value, element) {
    const regEx = new RegExp("^(09|\\+639)\\d{9}$");
    return this.optional(element) || regEx.test(value);
  },
  "Please enter a valid phone number"
);

let clearTable = function (table) {
  // clear table
  table.children().remove();
  table.append("<tr></tr>");
};

let employeeRow = function (employee) {
  //TODO: change this
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

empForm.validate({
  normalizer: function (value) {
    return $.trim(value);
  },
  rules: {
    empLicenseID: {
      required: true,
    },
    empMobile: {
      PHNumber: true,
      digits: true,
    },
  },
});

let updateErrorMessage = function (message) {
  let modalBody = $("#summary-modal .modal-body");
  modalBody.prepend($(alert(message)));
};

let removeErrorMessage = function () {
  let modalBody = $("#summary-modal .modal-body");
  modalBody.find(".error-msg-ctr").remove();
};

let updateSummary = function (key, value) {
  let summaryTableBody = $(".summary-table tbody");

  let summaryItem = `
    <tr>
      <td class="fw-bold fs-5 me-3" scope="row" style="width: 12rem">${key}:</td>
      <td class="fs-5" colspan=2>${value}</td>
    </tr>`;

  // append to summary
  summaryTableBody.append(summaryItem);
};

// custom events
$("#employee-form").on("addEmployee", function (_, data) {
  let name = `${data.fName} ${data.mName} ${data.lName}`;
  data["name"] = name;

  // delete seperated name fields
  delete data["fName"];
  delete data["mName"];
  delete data["lName"];

  console.log(data);
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
        // removeErrorMessage();
        // updateErrorMessage(response.errMsg);
      }
    },
    error: function (xhr) {
      let errorMsg = xhr.responseJSON.errMsg;
      removeErrorMessage();
      updateErrorMessage(errorMsg);
    },
  });
});

$("#employee-form").on("retrieveEmployeeAndFillModal", function (_, filter) {
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
        console.log(employeeData);
        let [fName, mName, lName] = employeeData.name.split(" ");
        let nameObj = { fName: fName, mName: mName, lName: lName };

        $("#employee-form :input").each(function () {
          let name = $(this).attr("name");

          // set value of input accordingly
          $(this).val(employeeData[name]);

          // special cases for name fields
          if (["fName", "mName", "lName"].includes(name)) {
            $(this).val(nameObj[name]);
          }
        });

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
});

$("#employee-form").on("editEmployee", function (_, empId, data) {
  let name = `${data.fName} ${data.mName} ${data.lName}`;
  data["name"] = name;

  // delete seperated name fields
  delete data["fName"];
  delete data["mName"];
  delete data["lName"];

  $.ajax({
    method: "PATCH",
    url: `/admin/employee/edit/${empId}`,
    dataType: "json",
    data: JSON.stringify(data),
    contentType: "application/json",
    success: function (response) {
      if (response.code === "SUCCESS") {
        // empModal.modal("hide");
        location.reload();

        // let employeeData = response.data;

        // let toEditEmployeeRow = "";
        // let employeeTrs = $(".employees-table tbody tr");
        // employeeTrs.each(function (i, item) {
        //   if ($(this).children(".emp-id").text() === empId) {
        //     toEditEmployeeRow = $(this);
        //     return;
        //   }
        // });
        // // remove outdated employee row
        // toEditEmployeeRow.remove();

        // // re-insert with updated information
        // let empTableBody = $(".employees-table tbody");
        // let updatedEmployeeRow = employeeRow(employeeData);

        // empTableBody.append(updatedEmployeeRow);

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
});

//NOTE: ON PAGE LOAD
$(function () {
  // listen for click on "cancel" in summary
  $(".summary-btn-cancel").on("click", function () {
    summaryModal.modal("hide");
    empModal.modal("show");
  });

  //NOTE: add modal functionality
  $(".add-emp-btn").on("click", function () {
    // clear form first
    $("#employee-form :input").each(function () {
      $(this).val("");
    });
    // re-enable disabled fields
    $("#email").attr("disabled", false);
    $("#pwd").attr("disabled", false);
    $("#pwd2").attr("disabled", false);

    // show add emp modal
    empModal.modal("show");

    empForm.on("submit", function (e) {
      e.preventDefault();
      // show summary and hide add modal
      if (empForm.valid()) {
        // display summary modal and hide empModal
        empModal.modal("hide");
        summaryModal.modal("show");

        // get values from input
        let values = $(this).serializeArray();
        let constructedData = {};

        // construct data to key-value pairs
        values.forEach(function (item) {
          constructedData[item.name] = item.value;
        });

        // clear table body first
        $(".summary-table tbody").empty();

        $("#employee-form :input").each(function () {
          let key = $(this).attr("data-summary-label");
          let value = $(this).val();

          updateSummary(key, value);
        });

        // remove error-message to avoid stacking errors
        removeErrorMessage();
        $(".summary-submit-btn").on("click", function () {
          $("#employee-form").trigger("addEmployee", [constructedData]);
          $("#employee-form").off("addEmployee");
        });
      }
    });
  });

  $(empModal).on("hide.bs.modal", function () {
    console.log("HIDDEN");
  });

  //NOTE: edit modal functionality
  // TODO: use same modal to edit employee
  $(".employees-table").on("click", "button.edit-emp-btn", function () {
    let empId = $(this).parent().siblings(".emp-id").text();
    console.log(empId);

    $("#employee-form").trigger("retrieveEmployeeAndFillModal", [
      { licenseID: empId },
    ]);

    $(empForm).on("submit", function (e) {
      e.preventDefault();
      // show summary and hide add modal

      // display summary modal and hide empModal
      empModal.modal("hide");
      summaryModal.modal("show");

      // get values from input
      let values = $(this).serializeArray();
      let constructedData = {};

      // construct data to key-value pairs
      values.forEach(function (item) {
        constructedData[item.name] = item.value;
      });

      // clear table body first
      $(".summary-table tbody").empty();

      $("#employee-form :input").each(function () {
        let key = $(this).attr("data-summary-label");
        let value = $(this).val();

        updateSummary(key, value);
      });

      removeErrorMessage();
      $(".summary-submit-btn").on("click", function () {
        console.log("SUBMITTED");
        $("#employee-form").trigger("editEmployee", [empId, constructedData]);
        $("#employee-form").off("editEmployee");
      });
    });
  });

  // NOTE: For filters (practitioner, secretary, all)
  $("#filter-tab button").on("click", function () {
    let filterValue = $(this).attr("data-target");

    $.ajax({
      method: "GET",
      url: `/admin/employee/category/${filterValue}`,
      dataType: "json",
      contentType: "application/json",
      success: function (response) {
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
  });

  // NOTE: For searching
  $("#filter-tab input").on("input", function () {
    let value = $(this).val();

    console.log(value);
    let filter = { name: { $regex: value, $options: "i" } };

    $.ajax({
      method: "POST",
      url: `/admin/employee/search`,
      dataType: "json",
      data: JSON.stringify(filter),
      contentType: "application/json",
      success: function (response) {
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
  });

  //TODO: for testing
  let dummyValues = {
    _id: "12345678",
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

  $("#employee-form :input").each(function () {
    $(this).val(dummyValues[$(this).attr("name")]);
  });
});

// TODO: editing of employee information
