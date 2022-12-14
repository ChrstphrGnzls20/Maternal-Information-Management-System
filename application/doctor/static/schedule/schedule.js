$(function () {
  var calendarEl = document.getElementById("calendar");
  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    selectable: true,
    selectHelper: true,
    validRange: {
      start: new Date(moment().add(1, "days")),
    },
    select: function ({ start, end, jsEvent, view }) {
      let parsedStart = moment(start).format("MM/DD/YYYY");
      let parsedEnd = moment(end).subtract(1, "days").format("MM/DD/YYYY");

      $("#dateInput").val(`${parsedStart} - ${parsedEnd}`);

      $("#offcanvas").offcanvas("show");
    },
  });

  calendar.render();

  $(".time").timepicker({ timeFormat: "h:i A" });
});

/*
[
  {
    doctorID: 123123,
    scheduleDate: 12/05/2022,
    startTime: 12:00 AM,
    endTime: 3:00 AM
  },
  {
    doctorID: 123123,
    scheduleDate: 12/06/2022,
    startTime: 12:00 AM,
    endTime: 3:00 AM
  }
]

*/
