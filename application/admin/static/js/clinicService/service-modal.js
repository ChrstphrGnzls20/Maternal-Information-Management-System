let serviceModal = $("#service-modal");
let serviceModalDialog = $("#service-modal > .modal-dialog");

let summaryModal = $("#summary-modal");
let summaryModalDialog = $("#summary-modal > .modal-dialog");

function generateModalContent(mode) {
  // CLEAR MODAL FIRST BEFORE APPENDING
  serviceModalDialog.empty();
  let header = "";
  let formId = "";
  if (mode === "ADD") {
    header = `<h2 class="mb-0 ms-2">Add new clinic service</h2>`;
    formId = "add-service-form";
  } else {
    header = `<h2 class="mb-0 ms-2">Edit clinic service</h2>`;
    formId = "edit-service-form";
  }
  //   return `
  //     <form id="${formId}">
  //     <div class="modal-content">
  //     <div class="modal-header d-flex justify-content-center">
  //         ${header}
  //         <button
  //         type="button"
  //         class="btn-close"
  //         data-bs-dismiss="modal"
  //         ></button>
  //     </div>
  //     <div class="modal-body">
  //         <div class="justify-content-center p-2">
  //         <div class="add-emp-modal-container bg-white m-2 p-2">
  //             <div class="row">
  //             <div class="form-group">
  //                 <label for="license-num" class="form-label"
  //                 >License Number</label
  //                 >
  //                 <input
  //                 type="text"
  //                 class="form-control"
  //                 id="license-num"
  //                 name="licenseID"
  //                 maxlength="18"
  //                 data-summary-label="License Number"
  //                 required
  //                 />
  //             </div>
  //             </div>

  //             <div class="row">
  //             <div class="form-group mt-3">
  //                 <label for="fname" class="form-label">First Name</label>
  //                 <input
  //                 type="text"
  //                 class="form-control"
  //                 id="name"
  //                 name="fName"
  //                 data-summary-label="First Name"
  //                 required
  //                 />
  //             </div>

  //             <div class="form-group mt-3">
  //                 <label for="mname" class="form-label">Middle Initial</label>
  //                 <input
  //                 type="text"
  //                 class="form-control"
  //                 id="mname"
  //                 name="mName"
  //                 data-summary-label="Middle Name"
  //                 required
  //                 />
  //             </div>

  //             <div class="form-group mt-3">
  //                 <label for="lname" class="form-label">Last Name</label>
  //                 <input
  //                 type="text"
  //                 class="form-control"
  //                 id="lname"
  //                 name="lName"
  //                 data-summary-label="Last Name"
  //                 required
  //                 />
  //             </div>
  //             </div>

  //             <div class="row">
  //             <div class="form-group col-12 col-lg-6 mt-3">
  //                 <label for="pic" class="form-label">Picture</label>
  //                 <div class="input-group mb-3">
  //                 <input
  //                     type="file"
  //                     class="form-control pic"
  //                     name="picture"
  //                     id="pic"
  //                     data-summary-label="Picture"
  //                     aria-describedby="emp-pic-file-inp"
  //                 />
  //                 </div>
  //                 <label
  //                 class="visually-hidden pic-error error"
  //                 for="emp-pic-file-inp"
  //                 ></label>
  //             </div>

  //             <div class="form-group col-12 col-lg-6 mt-0 mt-lg-3">
  //                 <label for="role" class="form-label">Role</label>
  //                 <select
  //                 class="form-select"
  //                 name="role"
  //                 id="role"
  //                 data-summary-label="Role"
  //                 required
  //                 >
  //                 <option value="Clinician">Clinician</option>
  //                 <option value="Secretary">Secretary</option>
  //                 </select>
  //             </div>
  //             </div>

  //             <div class="row mt-3">
  //             <div class="form-group col-12 col-lg-6">
  //                 <label for="status" class="form-label">Status</label>
  //                 <select
  //                 class="form-select"
  //                 name="status"
  //                 id="status"
  //                 data-summary-label="Status"
  //                 >
  //                 <option selected value="Active">Active</option>
  //                 <option value="Inactive">Inactive</option>
  //                 </select>
  //             </div>

  //             <div class="form-group col-12 col-lg-6 mt-3 mt-lg-0">
  //                 <label for="mobile" class="form-label"
  //                 >Contact Number</label
  //                 >
  //                 <input
  //                 type="text"
  //                 name="mobile"
  //                 class="form-control"
  //                 id="mobile"
  //                 maxlength="11"
  //                 data-summary-label="Contact Number"
  //                 required
  //                 />
  //             </div>
  //             </div>

  //             ${loginCredential}
  //         </div>
  //         </div>
  //     </div>

  //     <div class="modal-footer">
  //         <button
  //         type="button"
  //         class="btn btn-danger"
  //         data-bs-dismiss="modal"
  //         >
  //         CANCEL
  //         </button>
  //         <input type="submit" value="NEXT" class="btn btn-success ms-2" />
  //     </div>
  //     </div>
  // </form>`;

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
          <div class="add-service-modal-container justify-content-center bg-white p-2">
            <div class="row">
              <div class="form-group ">
                <label for="serviceID" class="form-label">Service ID</label>
                <input
                  type="text"
                  class="form-control"
                  id="serviceID"
                  name="_id"
                  maxlength="18"
                  data-summary-label="Service ID"
                  disabled
                />
              </div>
            </div>

            <div class="row">
              <div class="form-group mt-3">
                <label for="serviceName" class="form-label">Service Name</label>
                <input
                  type="text"
                  class="form-control"
                  id="serviceName"
                  name="name"
                  data-summary-label="Name"
                  required
                />
              </div>
            </div>

            <div class="row">
                <div class="form-group mt-3">
                    <label for="serviceDescription" class="form-label"
                    >Description</label
                    >
                    <input
                    type="text"
                    class="form-control"
                    id="serviceDescription"
                    name="description"
                    data-summary-label="Description"
                    required
                    />
                </div>
            </div>
              
            <div class="row">
              <div class="form-group mt-3">
                <label for="servicePrice" class="form-label">Price</label>
                <input
                  type="text"
                  class="form-control"
                  id="servicePrice"
                  name="price"
                  data-summary-label="Price"
                  required
                />
              </div>
            </div>

            <div class="row mt-3">
              <div class="form-group">
                <label for="serviceStatus" class="form-label">Status</label>
                <select
                  class="form-select"
                  name="status"
                  id="serviceStatus"
                  data-summary-label="Status"
                >
                  <option selected value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
      </div>

    <div class="modal-footer">
      <button type="button" class="btn btn-danger" data-bs-dismiss="modal">
        CANCEL
      </button>
      <input type="submit" value="NEXT" class="btn btn-success ms-2" />
    </div>
  </form>
    `;
}

function generateSummaryContent(mode) {
  summaryModalDialog.empty();
  let summaryTableValues = "";
  let form = "";
  //   summaryTableBody.empty();
  if (mode === "ADD") {
    formId = "add-service-summary";
    form = "#add-service-form";
  } else {
    formId = "edit-service-summary";
    form = "#edit-service-form";
  }

  $(`${form} input.form-control, ${form} select`).each(function () {
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
