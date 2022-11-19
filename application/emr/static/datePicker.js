var datepicker = $.fn.datepicker.noConflict(); // return $.fn.datepicker to previously assigned value
$.fn.bootstrapDP = datepicker; // give $().bootstrapDP the bootstrap-datepicker functionality

defaultOptions = {
  autoclose: true,
  changeMonth: true,
  changeYear: true,
  format: "MM yyyy",
  endDate: "+0d",
  minViewMode: "months",
};

function loadDatepickers(options) {
  $(".datepicker").each(function () {
    // $(this).bootstrapDP("remove");
    $(this).bootstrapDP(options);
  });
}

// $("#emr-content").on("changeDate", "#HPIStartDate", function () {
//   let value = moment($(this).val(), "MM/DD/YYYY");
//   // console.log();
//   // let today = moment().format("MM/DD/YYYY");

//   let diffInDays = moment().diff(value, "days");
// });

function getDaysDiffToday(date) {
  let value = moment(date, "MM/DD/YYYY");
  // console.log();
  // let today = moment().format("MM/DD/YYYY");

  return moment().diff(value, "days");
}
