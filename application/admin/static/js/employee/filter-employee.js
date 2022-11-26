let currentFilters = {};
// FUNCTION FOR CLEARING EMPLOYEES TABLE
let clearTable = function (table) {
  // clear table
  table.children().remove();
  table.append("<tr></tr>");
};

// FUNCTION FOR RETRIEVING EMPLOYEE DEPENDING ON THE SELECTED CATEGORY USING AJAX AND ONLY DISPLAYING RETRIEVED EMPLOYEE TO THE TABLE WHEN THE AJAX-REQUEST IS SUCCESSFUL
let filterTable = function (filter) {
  let searchParams = $.param(filter);
  console.log(searchParams);
  $.ajax({
    method: "GET",
    url: `${API_BASE_URL}/employees?${searchParams}`,
    dataType: "json",
    data: JSON.stringify(filter),
    contentType: "application/json",
  }).done(function (response) {
    let empTableBody = $(".employees-table tbody");
    // clear table
    clearTable(empTableBody);
    // if request is successfull
    let employeesData = response;

    employeesData.forEach(function (employee) {
      empTableBody.append(generateEmployeeRow(employee));
    });
  });
};

// GENERATE TR TO BE INSERTED IN EMPLOYEE TABLE
function generateEmployeeRow(employee) {
  return `
        <tr>
          <td class="text-center emp-id">${employee._id}</td>
          <td class="text-center">${employee.name}</td>
          <td class="text-center" style="text-transform: capitalize">${employee.role}</td>
          <td class="text-center">${employee.mobile}</td>
          <td class="text-center" style="text-transform: capitalize">${employee.status}</td>
          <td class="text-center"><button type="button" class="btn btn btn-primary edit-emp-btn"> 
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                      <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                    </svg></button></td>
        </tr>
        `;
}

$(function () {
  $("#filter-tab button").on("click", function () {
    let value = $(this).attr("data-target");

    currentFilters["role"] = value;

    filterTable(currentFilters);
  });

  $("#filter-tab input").on("input", function () {
    let value = $(this).val();

    currentFilters["name"] = value;

    // currentFilters["name"] = { $regex: value, $options: "i" };

    filterTable(currentFilters);
  });
});
