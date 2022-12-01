$(function () {
  $.ajax({
    method: "GET",
    url: `${API_BASE_URL}/clinic-services/`,
    contentType: "application/json",
    dataType: "json",
  })
    .done(function (response) {
      let data = response;

      data.forEach(function (item) {
        let tr = generateServiceRow(item);
        $(".service-table tbody").append(tr);
      });
    })
    .catch(function (xhr) {
      console.log(xhr);
    });
});
