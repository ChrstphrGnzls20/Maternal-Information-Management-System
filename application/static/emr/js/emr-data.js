// $(function () {
//   let doctor_id = 123456;

//   let activeEMRView = localStorage.getItem("activeEMRView")
//     ? localStorage.getItem("activeEMRView")
//     : "vital-signs";

//   if (activeEMRView === "laboratory") {
//     // AJAX call
//     $("#emr-content").on("change", "#referralReason", function () {
//       let templateValue = $(this).val();
//       $.ajax({
//         method: "GET",
//         url: `/laboratory-template/${templateValue}`,
//         dataType: "json",
//         contentType: "application/json",
//         success: function (response) {
//           let data = response.data;
//           console.log(data);
//           data.forEach(function (item) {
//             $(`input[name=${item}`).prop("checked", true);
//           });
//         },
//       });
//     });
//     console.log(laboratoryTemplates);
//   }
// });
