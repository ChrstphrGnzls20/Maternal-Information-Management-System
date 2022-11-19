$(function () {
  $("#birthday-datepicker").datepicker({
    autoclose: true,
    changeMonth: true,
    changeYear: true,
    format: "mm/dd/yyyy",
    endDate: "+0d",
  });
});

//get derived age from birthday datepicker
$("#birthday-datepicker").on("changeDate", (selectedDate) => {
  $("#birthday-datepicker").val(selectedDate);

  console.log(selectedDate);

  var today = new Date();
  var birthDate = new Date(selectedDate.date);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  $("#age-input").val(age);
});
