$(function () {
  let activeEMRView = localStorage.getItem("activeEMRView")
    ? localStorage.getItem("activeEMRView")
    : "vital-signs";

  // let activeEMRView = "vital-signs";
  let getEMRContent = function (target) {
    $.ajax({
      method: "GET",
      url: `/emr/${target}`,
      dataType: "json",
      contentType: "application/json",
      success: function (html) {
        let container = $("#emr-content");

        container.html(html);

        let emrCatArray = $(".emr-cat");
        emrCatArray.each(function () {
          $(this).removeClass("active");
        });

        let emrCat = $(`a[data-target=${target}]`);
        emrCat.addClass("active");

        // set activeEMRView
        localStorage.setItem("activeEMRView", target);

        if (activeEMRView === "laboratory") {
          $.ajax({
            type: "POST",
            url: "/emr/getTemplates",
            data: JSON.stringify({
              doctorId: "123456",
              category: "laboratory",
            }),
            contentType: "application/json",
            dataType: "json",
            success: function (response) {
              var referralAutocompleteArray = [];
              let labTemplates = response.data;
              if (labTemplates) {
                console.log(response.data);
                Object.keys(response.data).forEach(function (key) {
                  referralAutocompleteArray.push(key);
                });

                $("#referralReason").autocomplete({
                  clearButton: true,
                  source: referralAutocompleteArray,
                  selectFirst: true,
                  minLength: 2,
                });
              }
              $("#referralReason").on("change", function () {
                let value = $(this).val();
                let data = labTemplates[value];

                // uncheck checked first
                $(`input[type=checkbox]`).each(function () {
                  $(this).prop("checked", false);
                });

                // check according to data array
                data.forEach(function (item) {
                  $(`input[name=${item}`).prop("checked", true);
                });
              });
            },

            error: function (xhr) {
              console.log("Error: " + xhr.responseText);
            },
          });
        }
      },
    });
  };

  $(".emr-cat").on("click", function () {
    let target = $(this).attr("data-target");
    getEMRContent(target);
    activeEMRView = target;
  });

  getEMRContent(activeEMRView);
});
