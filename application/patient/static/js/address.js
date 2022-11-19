function createOptions(element, dataArray, code, name) {
  dataArray.forEach(function (item) {
    element.append($("<option>", { value: item[code], text: item[name] }));
  });
}

function fetchList(element, code, name, type, value = null, toGet = null) {
  const URL = "/address";
  let searchURL = "";

  if (value && toGet) {
    searchURL = `${URL}/${type}/${value}/${toGet}`;
  } else if (value && !toGet) {
    searchURL = `${URL}/${type}/${value}`;
  } else {
    searchURL = searchURL = `${URL}/${type}`;
  }

  $.ajax({
    method: "GET",
    url: searchURL,
    // data: "json",
    // dataType: "text",
    success: function (response) {
      let data = JSON.parse(response);

      element.empty();
      createOptions(element, data, code, name);
    },
    error: function (xhr, responseData, status) {
      console.log(xhr);
      return false;
    },
  });
}
var my_handlers = {
  fill_regions: function () {
    fetchList($("#regions"), "regCode", "regDesc", "regions");
  },

  fill_provinces: function () {
    let value = $("#regions").val();
    fetchList(
      $("#provinces"),
      "provCode",
      "provDesc",
      "regions",
      (value = value),
      (toGet = "provinces")
    );
  },

  fill_cities: function () {
    let value = $("#provinces").val();
    fetchList(
      $("#cities"),
      "citymunCode",
      "citymunDesc",
      "provinces",
      (value = value),
      (toGet = "cities")
    );
  },

  fill_barangays: function () {
    let value = $("#cities").val();
    fetchList(
      $("#barangays"),
      "brgyCode",
      "brgyDesc",
      "cities",
      (value = value),
      (toGet = "barangays")
    );
  },
};
$(function () {
  $("#regions").on("change", my_handlers.fill_provinces);
  $("#provinces").on("change", my_handlers.fill_cities);
  $("#cities").on("change", my_handlers.fill_barangays);

  my_handlers.fill_regions();
});
