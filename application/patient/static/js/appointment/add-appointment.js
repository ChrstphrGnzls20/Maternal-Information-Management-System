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
  //     events: [],
  //   }
  // );

  // calendar.render();

  let schedules = [];
  function getEvents(start, end, selectedPractitioner) {
    let searchParams = $.param({
      start,
      end,
    });
    return $.ajax({
      method: "GET",
      dataType: "json",
      contentType: "application/json",
      url: `${API_BASE_URL}/doctors/schedules/${selectedPractitioner}?${searchParams}`,
    });
    // start=2023-02-01T00%3A00%3A00+08%3A00&end=2023-03-11T00%3A00%3A00+08%3A00
    // start=2023-01-31T16%3A00%3A00.000Z&end=2023-03-10T16%3A00%3A00.000Z
  }

  $("#time").on("keydown", function (e) {
    e.preventDefault();
  });

  function eventOrDateClick(calendar, info) {
    selectedPractitioner = pracSelect.val();
    let selectedPractitionerName = $(
      `#prac-select option[value=${selectedPractitioner}]`
    ).text();
    selectedDate = info.date;

    practInput.val(selectedPractitionerName);
    let dateToDisplay = moment(info.date).format("MMMM DD, YYYY");
    dateInput.val(dateToDisplay);

    let toSearch = moment(info.date).format("YYYY-MM-DD");
    // let searchParam = $.param({
    //   appointmentDate: toSearch,
    //   status: "accepted",
    // });
    let searchParam = $.param({
      date: toSearch,
    });
    $.ajax({
      method: "GET",
      dataType: "json",
      contentType: "application/json",
      url: `${API_BASE_URL}/doctors/schedules/${selectedPractitioner}?${searchParam}`,
    })
      .then(function (response) {
        let data = response;
        if (data.length > 0) {
          createApptModal.modal("show");
          calendar.unselect();
        }
      })
      .catch(function (xhr) {
        console.log(xhr);
      });

    searchParam = $.param({
      appointmentDate: toSearch,
      status: "accepted",
    });

    $.ajax({
      method: "GET",
      dataType: "json",
      contentType: "application/json",
      url: `${API_BASE_URL}/appointments/doctor/${selectedPractitioner}?${searchParam}`,
    })
      .then(function (response) {
        let data = response;

        let toDisableTime = [];
        data.forEach(function (item) {
          let start = moment(item.appointmentDate).clone().format("hh:mm A");
          let end = moment(item.appointmentDate)
            .add(29, "minutes")
            .format("hh:mm A");

          let temp = [];
          temp.push(start);
          temp.push(end);
          toDisableTime.push(temp);
        });

        console.log(toDisableTime);
        $("#time").timepicker({
          step: 30,
          minTime: "8am",
          maxTime: "5pm",
          defaultTime: "08",
          forceRoundTime: true,
          timeFormat: "h:i A",
          disableTimeRanges: toDisableTime,
          scrollbar: false,
        });
      })
      .catch(function (xhr) {
        console.log(xhr);
      });
  }

  // listen when practitioner changes
  $("#prac-select").on("change", function () {
    let doctorID = $(this).val();
    console.log($(this).val());
    let availableDates;
    if (doctorID) {
      let calendarEl = document.getElementById("calendar");
      let calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "dayGridMonth",
        headerToolbar: {
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth",
        },
        validRange: {
          start: new Date(moment().add(1, "days")),
        },
        hiddenDays: [0],
        datesSet: function (evt) {
          console.log(evt);
          let startDatesRange = moment(calendar.view.activeStart).format();
          let endDatesRange = moment(calendar.view.activeEnd).format();

          getEvents(startDatesRange, endDatesRange, doctorID)
            .then(function (response) {
              let data = response;

              $("#calendar td").each(function () {
                $(this).addClass("fc-day-disabled");
              });
              data.forEach(function (item) {
                let startDate = moment(item.start).format("YYYY-MM-DD");
                console.log(startDate);
                console.log();
                $(`#calendar td[data-date=${startDate}]`).removeClass(
                  "fc-day-disabled"
                );
                $(`#calendar td[data-date=${startDate}]`).css(
                  "backgroundColor",
                  "white"
                );
              });
            })
            .catch(function (xhr) {
              console.log(xhr);
            });
        },
        //better support for comp and mobile
        dateClick: function (info) {
          // set the values
          eventOrDateClick(this, info);
        },
        selectAllow: function (selectInfo) {
          console.log(selectInfo);
          return false;
        },
        eventSources: {
          url: `${API_BASE_URL}/doctors/schedules/${doctorID}`,
          type: "get",
        },
      });

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
