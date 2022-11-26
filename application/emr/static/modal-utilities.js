function clearModalTextFields(modalClass) {
  $(`${modalClass} input[type=text], ${modalClass} textarea`).each(function () {
    $(this).val("");
  });
}

// function populateModalInput(modalClass, data) {
//   data.forEach((item) => {
//     let key = Object.keys(item)[0];
//     let value = Object.values(item)[0];
//     $(`${modalClass} input[name=${key}]`).val(value);
//   });
// }
