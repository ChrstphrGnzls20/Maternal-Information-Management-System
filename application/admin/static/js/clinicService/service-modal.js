let serviceModal = $("#service-modal");
let serviceModalDialog = $("#service-modal > .modal-dialog");

let summaryModal = $("#summary-modal");
let summaryModalDialog = $("#summary-modal > .modal-dialog");

function generateServiceRow(service) {
  const formattedPrice = new Intl.NumberFormat("fil-PH", {
    style: "currency",
    currency: "PHP",
  }).format(service.price);
  return `
    <tr>
    <td class="text-center service-id">${service._id}</td>
    <td class="text-center">${service.name}</td>
    <td class="text-center">${service.description}</td>
    <td class="text-center">${formattedPrice}</td>
    <td class="text-center">${service.status}</td>
    <td class="text-center"><button type="button" class="btn btn btn-primary edit-service-btn"> 
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                </svg></button></td>
    </tr>
    `;
}

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
                <label for="serviceName" class="form-label required">Service Name</label>
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
                    <label for="serviceDescription" class="form-label required"
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
                <label for="servicePrice" class="form-label required">Price</label>
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
                <label for="serviceStatus" class="form-label required">Status</label>
                <select
                  class="form-select"
                  name="status"
                  id="serviceStatus"
                  data-summary-label="Status"
                  required
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
