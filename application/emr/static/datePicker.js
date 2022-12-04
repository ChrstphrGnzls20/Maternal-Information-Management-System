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

function getDaysDiffToday(date) {
  let value = moment(date, "MM/DD/YYYY");
  // console.log();
  // let today = moment().format("MM/DD/YYYY");

  return moment().diff(value, "days");
}

function setDatepickerValueToday(element, format = "FULL") {
  let currentDay = moment().date();
  let currentMonth = moment().month() + 1;
  let currentYear = moment().year();
  if (format === "YEAR") {
    $(element).bootstrapDP("update", `${currentYear}`);
  } else if (format === "MONTH") {
    $(element).bootstrapDP("update", `${currentMonth}/${currentYear}}`);
  } else {
    $(element).bootstrapDP(
      "update",
      `${currentDay}/${currentMonth}/${currentYear}}`
    );
  }
}
