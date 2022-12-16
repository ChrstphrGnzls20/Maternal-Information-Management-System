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

//initialize FullCalendar
$(function () {
  // let calendar = new FullCalendar.Calendar(
  //   document.getElementById("calendar"),
  //   {
  //     initialView: "dayGridMonth",
  //     headerToolbar: {
  //       left: "prev,next today",
  //       center: "title",
  //       right: "dayGridMonth",
  //     },
  //     validRange: {
  //       start: new Date(moment().add(1, "days")),
  //     },
  //     weekends: false,
  //     //better support for comp and mobile
  //     dateClick: function (info) {
  //       // set the values
  //       selectedPractitioner = pracSelect.val();
  //       let selectedPractitionerName = $(
  //         `#prac-select option[value=${selectedPractitioner}]`
  //       ).text();
  //       selectedDate = info.date;

  //       practInput.val(selectedPractitionerName);
  //       let dateToDisplay = moment(info.date).format("MMMM DD, YYYY");
  //       dateInput.val(dateToDisplay);
  //       createApptModal.modal("show");
  //       calendar.unselect();
  //     },
  //     selectAllow: function (selectInfo) {
  //       console.log(selectInfo);
  //       return false;
  //     },

  //     //events for testing
  //     //TODO: fetch all dates that have events from the selected practitioner and disable it
  //     events: [],
  //   }
  // );

  // calendar.render();

  // timepicker
  //TODO: up for changes based on client's time
  $("#time").timepicker({
    step: 30,
    minTime: "8am",
    maxTime: "5pm",
    defaultTime: "08",
    forceRoundTime: true,
    timeFormat: "h:i A",
    // disableTimeRanges: [["11:00", "12:00"], []],
    scrollbar: false,
  });

  $("#time").on("keydown", function (e) {
    e.preventDefault();
  });

  // listen when practitioner changes
  $("#prac-select").on("change", function () {
    let doctorID = $(this).val();
    console.log($(this).val());
    // if ($(this).val()) {
    //   $("#calendar").removeClass("invisible");
    //   return;
    // }
    // $("#calendar").addClass("invisible");
    if (doctorID) {
      let calendar = new FullCalendar.Calendar(
        document.getElementById("calendar"),
        {
          initialView: "dayGridMonth",
          headerToolbar: {
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth",
          },
          validRange: {
            start: new Date(moment().add(1, "days")),
          },
          weekends: false,
          //better support for comp and mobile
          dateClick: function (info) {
            // set the values
            selectedPractitioner = pracSelect.val();
            let selectedPractitionerName = $(
              `#prac-select option[value=${selectedPractitioner}]`
            ).text();
            selectedDate = info.date;

            practInput.val(selectedPractitionerName);
            let dateToDisplay = moment(info.date).format("MMMM DD, YYYY");
            dateInput.val(dateToDisplay);
            createApptModal.modal("show");
            calendar.unselect();
          },
          selectAllow: function (selectInfo) {
            console.log(selectInfo);
            return false;
          },
          eventSources: {
            url: `${API_BASE_URL}/doctors/schedules/${doctorID}`,
            type: "get",
            success: function (response, param1) {
              console.log(response);
              console.log(param1);
            },
          },
        }
      );

      // calendar.addEventSource()

      calendar.render();
    }
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
      patient_id: localStorage.getItem("id"),
      doctor_id: practitioner,
      appointmentDate: selectedDateTime.toISOString(),
    };

    //show another modal with values
    $("#conf-practitioner").text(pracSelect.find(":selected").text());
    $("#conf-date").text(moment(selectedDate).format("MMMM DD, YYYY"));
    $("#conf-time").text(timeInput.val());
    createApptModal.modal("hide");
    confirmationModal.modal("show");
  });

  $("#cancel-add-appointment-btn").on("click", function () {
    createApptModal.modal("show");
  });

  $("#add-appointment-btn").on("click", function () {
    confirmationModal.modal("hide");
    console.log(selectedAppointment);

    $.ajax({
      method: "POST",
      url: `${API_BASE_URL}/appointments`,
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify(selectedAppointment),
    })
      .done(function (response) {
        // IF SUCCESSFULLY SET AN APPOINTMENT, REDIRECT BACK TO APPOINTMENTS TABLE
        if (response) {
          location.href = "/patient/appointments";
        }
      })
      .catch(function (xhr) {
        console.log(xhr);
      });
  });
});
