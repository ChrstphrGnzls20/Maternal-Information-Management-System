//global vars
let createApptModal = $("#createApptModal");
let confirmationModal = $("#confirmation");
let pracSelect = $("#prac-select");
let practInput = $("#practitioner");
let dateInput = $("#date");
let timeInput = $("#time");
//initializing set values
let selectedPractitioner;
let selectedDate;
let selectedTime;
let selectedAppointment = {};

// listen when practitioner changes
$("#prac-select").on("change", function () {
  console.log($(this).val());
  if ($(this).val()) {
    $("#calendar").removeClass("invisible");
    return;
  }
  $("#calendar").addClass("invisible");
});

//initialize FullCalendar
$(function () {
  let calendar = new FullCalendar.Calendar(
    document.getElementById("calendar"),
    {
      //   plugins: ["dayGrid", "timeGrid"],
      initialView: "dayGridMonth",
      //   selectable: true,
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
      },
      validRange: {
        start: new Date(moment().add(1, "days")),
      },
      weekends: false,
      //better support for comp and mobile
      dateClick: function (info) {
        // let title = prompt("Event Content:");
        // console.log(title);
        // if (title) {
        //   calendar.addEvent({
        //     id: Math.floor(Math.random() * 1000),
        //     title: title,
        //     start: info.dateStr,
        //     end: info.endStr,
        //   });
        // }
        //open modal

        // set the values
        selectedPractitioner = pracSelect.val();
        selectedDate = info.date;

        practInput.val(pracSelect.val());
        let dateToDisplay = moment(info.date).format("MMMM DD, YYYY");
        dateInput.val(dateToDisplay);
        createApptModal.modal("show");
        calendar.unselect();
      },

      //events for testing
      //TODO: fetch all dates that have events from the selected practitioner and disable it
      events: [
        {
          id: "a",
          title: "my event",
          start: "2022-09-30T12:00:00",
          displayEventTime: true,
          allDay: false,
        },
      ],

      // eventClick: function (info) {
      //   var title = prompt("Edit Event Content:", info.event.title);
      //   if (title) {
      //     calendar.getEventById(info.event.id).setProp("title", title);
      //   }
      // },
    }
  );

  calendar.render();

  // timepicker
  //TODO: up for changes based on client's time
  $(".timepicker").timepicker({
    timeFormat: "h:mm p",
    interval: 30,
    minTime: "8",
    maxTime: "5:00pm",
    defaultTime: "08",
    startTime: "08:00",
    dynamic: false,
    dropdown: true,
    scrollbar: true,
    zindex: 9999999,
  });
});

// listen on form submit
$("#createApptForm").on("submit", function (e) {
  e.preventDefault();

  let practitioner = pracSelect.val();
  let selectedTime = timeInput.timepicker("getTime");
  let selectedHour = selectedTime.getHours();
  let selectedMinute = selectedTime.getMinutes();
  let selectedDateTime = moment(selectedDate);
  selectedDateTime.add(selectedHour, "hours");
  selectedDateTime.add(selectedMinute, "minutes");

  selectedAppointment = {
    practitioner: practitioner,
    dateTime: selectedDateTime.format(),
  };

  //show another modal with values
  $("#conf-practitioner").text(pracSelect.find(":selected").text());
  $("#conf-date").text(moment(selectedDate).format("MMMM DD, YYYY"));
  $("#conf-time").text(timeInput.val());
  createApptModal.modal("hide");
  confirmationModal.modal("show");
});

confirmationModal.on("hidden.bs.modal", function () {
  createApptModal.modal("show");
});
