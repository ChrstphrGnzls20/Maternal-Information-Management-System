$(function () {
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

        if (activeEMRView === "patient-history-pch") {
          // console.log("HELLO");
        }

        if (activeEMRView === "plan") {
          $("#patient-status-select").on("change", function () {
            // TODO: to fix
            let value = $(this).val();
          });
        }

        if (activeEMRView === "laboratory") {
          // $.ajax({
          //   type: "POST",
          //   url: "/emr/getTemplates",
          //   data: JSON.stringify({
          //     doctorId: "123456",
          //     category: "laboratory",
          //   }),
          //   contentType: "application/json",
          //   dataType: "json",
          //   success: function (response) {
          //     var referralAutocompleteArray = [];
          //     let labTemplates = response.data;
          //     if (labTemplates) {
          //       console.log(response.data);
          //       Object.keys(response.data).forEach(function (key) {
          //         referralAutocompleteArray.push(key);
          //       });
          //       // console.log($.autocomplete());
          //       $("#referralReason").autocomplete({
          //         clearButton: true,
          //         source: referralAutocompleteArray,
          //         selectFirst: true,
          //       });
          //     }
          //     $("#referralReason").on("change", function () {
          //       let value = $(this).val();
          //       let data = labTemplates[value];
          //       // uncheck checked first
          //       $(`input[type=checkbox]`).each(function () {
          //         $(this).prop("checked", false);
          //       });
          //       // check according to data array
          //       data.forEach(function (item) {
          //         $(`input[value=${item}`).prop("checked", true);
          //       });
          //     });
          //   },
          //   error: function (xhr) {
          //     console.log("Error: " + xhr.responseText);
          //   },
          // });
        }
        // loadDatepickers();
      },
    });
  };

  $("#emr-content").on(
    "click",
    (chilren = ".emr-next-btn,.emr-prev-btn"),
    function (evt) {
      evt.preventDefault();
      let nextPage = $(this).attr("data-next-page");
      let form = $(this).parent().parent();
      if (form.valid()) {
        form.trigger("submit", [nextPage]);
      }
    }
  );

  $("#emr-content").on(
    "submit",
    "form[data-form-target='EMR']",
    function (evt, nextPage) {
      evt.preventDefault();
      // let values = $(this).serializeArray();
      // console.log("form submitted! values: ", values);
      // // structurize the data before proceeding to next page
      // cleanData(values);
      getEMRContent(nextPage);
    }
  );

  $(".emr-cat").on("click", function () {
    let target = $(this).attr("data-target");
    let form = $("form[data-form-target='EMR']");
    // if (form.valid()) {
    //   form.trigger("submit", [target]);
    //   getEMRContent(target);
    //   activeEMRView = target;
    // }
    form.trigger("submit", [target]);
  });

  let activeEMRView = localStorage.getItem("activeEMRView")
    ? localStorage.getItem("activeEMRView")
    : "vital-signs";
  getEMRContent(activeEMRView);
});
