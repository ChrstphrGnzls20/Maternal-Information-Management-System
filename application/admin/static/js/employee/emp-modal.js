let employeeModal = $("#emp-modal");
let employeeModalDialog = $("#emp-modal > .modal-dialog");

let summaryModal = $("#summary-modal");
let summaryModalDialog = $("#summary-modal > .modal-dialog");

function generateModalContent(mode) {
  // CLEAR MODAL FIRST BEFORE APPENDING
  employeeModalDialog.empty();
  let header = "";
  let loginCredential = "";
  let formId = "";
  if (mode === "ADD") {
    header = `<h2 class="mb-0 ms-2">Add new employee</h2>`;
    formId = "add-employee-form";
    loginCredential = `
    <h3 class="mt-4">Login Credentials</h3>

    <div class="row mt-3">
        <div class="form-group col-12 col-lg-6">
            <label for="mail" class="form-label required">E-Mail Address</label>
            <input
            type="email"
            class="form-control"
            id="email"
            name="email"
            data-summary-label="Email Address"
            required
            />
        </div>
    </div>

    <div class="row mt-3">
        <div class="form-group col-12 col-lg-6">
            <label for="password" class="form-label required">Password</label>
            <input
            type="password"
            class="form-control"
            id="password"
            name="password"
            required
            data-summary-label="Password"
            />
        </div>

        <div class="form-group col-12 col-lg-6 mt-3 mt-lg-0">
            <label for="pwd2" class="form-label required"
            >Confirm Password</label>
            <input
            type="password"
            class="form-control"
            id="pwd2"
            name="pwd2"
            data-summary-label="Confirm Password"
            required
            />
        </div>
    </div>`;
  } else {
    header = header = `<h2 class="mb-0 ms-2">Edit employee</h2>`;
    formId = "edit-employee-form";
    loginCredential = "";
  }
  return `
    <form id="${formId}">
    <div class="modal-content">
    <div class="modal-header d-flex justify-content-center">
        ${header}
        <button
        type="button"
        class="btn-close"
        data-bs-dismiss="modal"
        ></button>
    </div>
    <div class="modal-body">
        <div class="justify-content-center p-2">
        <div class="add-emp-modal-container bg-white m-2 p-2">
            <div class="row">
            <div class="form-group col-12 col-lg-4">
                <label for="license-num" class="form-label required"
                >License ID</label
                >
                <input
                type="text"
                class="form-control"
                id="license-num"
                name="_id"
                maxlength="18"
                data-summary-label="License Number"
                required
                />
            </div>
            </div>

            <div class="row">
            <div class="form-group col-12 col-lg-4 mt-3">
                <label for="fname" class="form-label required">First Name</label>
                <input
                type="text"
                class="form-control"
                id="name"
                name="fName"
                data-summary-label="First Name"
                required
                />
            </div>

            <div class="form-group col-12 col-lg-4 mt-3">
                <label for="mname" class="form-label required">Middle Initial</label>
                <input
                type="text"
                class="form-control"
                id="mname"
                name="mName"
                data-summary-label="Middle Name"
                required
                />
            </div>

            <div class="form-group col-12 col-lg-4 mt-3">
                <label for="lname" class="form-label required">Last Name</label>
                <input
                type="text"
                class="form-control"
                id="lname"
                name="lName"
                data-summary-label="Last Name"
                required
                />
            </div>
            </div>

            <div class="row">
            <div class="form-group col-12 col-lg-6 mt-3">
                <label for="pic" class="form-label">Picture</label>
                <div class="input-group mb-3">
                <input
                    type="file"
                    class="form-control pic"
                    name="picture"
                    id="pic"
                    data-summary-label="Picture"
                    aria-describedby="emp-pic-file-inp"
                />
                </div>
                <label
                class="visually-hidden pic-error error"
                for="emp-pic-file-inp"
                ></label>
            </div>

            <div class="form-group col-12 col-lg-6 mt-0 mt-lg-3">
                <label for="role" class="form-label required">Role</label>
                <select
                class="form-select"
                name="role"
                id="role"
                data-summary-label="Role"
                required
                >
                <option value="doctor">Doctor</option>
                <option value="secretary">Secretary</option>
                </select>
            </div>
            </div>

            <div class="row mt-3">
            <div class="form-group col-12 col-lg-6">
                <label for="status" class="form-label required">Status</label>
                <select
                class="form-select"
                name="status"
                id="status"
                data-summary-label="Status"
                required
                >
                    <option value="active" selected>Active</option>
                    ${
                      mode == "ADD"
                        ? ""
                        : '<option value="inactive">Inactive</option>'
                    }
                    
                </select>
            </div>

            <div class="form-group col-12 col-lg-6 mt-3 mt-lg-0">
                <label for="mobile" class="form-label required"
                >Contact Number</label
                >
                <input
                type="text"
                name="mobile"
                class="form-control"
                id="mobile"
                maxlength="11"
                data-summary-label="Contact Number"
                required
                />
            </div>
            </div>

            ${loginCredential}
        </div>
        </div>
    </div>

    <div class="modal-footer">
        <button
        type="button"
        class="btn btn-danger"
        data-bs-dismiss="modal"
        >
        CANCEL
        </button>
        <input type="submit" value="NEXT" class="btn btn-success ms-2" />
    </div>
    </div>
</form>`;
}

function generateSummaryContent(mode) {
  // CLEAR MODAL FIRST BEFORE APPENDING
  summaryModalDialog.empty();
  let summaryTableValues = "";
  let formId = "";
  let form = "";
  //   summaryTableBody.empty();
  if (mode === "ADD") {
    formId = "add-employee-summary";
    form = "#add-employee-form";
  } else {
    formId = "edit-employee-summary";
    form = "#edit-employee-form";
  }

  $(`${form} input.form-control, ${form} select`).each(function (index) {
    let label = $(this).attr("data-summary-label");
    let value = $(this).val();
    summaryTableValues += `
    <tr>
        <td class="fw-bold fs-5 me-3" scope="row" style="width: 12rem">${label}:</td>
        <td class="fs-5" colspan=2>${value}</td>
    </tr>`;
  });
  return `
  <form id=${formId}>
    <div class="modal-content">
        <div class="modal-header d-flex justify-content-center">
        <h2 class="mb-0 ms-2">Confirm</h2>
        <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
        ></button>
        </div>
        <div class="modal-body">
        <table class="table table-borderless" id="summary-table">
            <tbody>
            ${summaryTableValues}
            </tbody>
        </table>
        </div>

        <div class="modal-footer">
        <button
            type="button"
            class="btn btn-danger"
            id="close-summary-modal-btn"
            data-bs-dismiss="modal"
        >
            CANCEL
        </button>
        <input type="submit" value="CONFIRM" class="btn btn-success ms-2" />
        </div>
    </div>
</form>
  `;
}

function generateErrorAlert(alertText) {
  return `
      <div class="alert alert-danger d-flex justify-content-center align-items-center error-msg-ctr" role="alert">
        <span>
            <i class="bi bi-exclamation-circle-fill fs-2 me-2"></i>
        </span>
        <p class="error-msg fs-5 mb-0">${alertText}</p>
      </div>
    `;
}
