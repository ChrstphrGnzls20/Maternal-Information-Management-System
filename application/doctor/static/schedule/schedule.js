let createScheduleCanvas = $("#offcanvas");
let confirmationScheduleModal = $("#confirmationSchedule");
//initializing set values
let selectedStartDate;
let selectedEndDate;
let selectedStartTime;
let selectedEndTime;
let listOfSchedule = [];

$(function () {
  let doctorID = localStorage.getItem("id") || null;
  let entity = localStorage.getItem("entity") || null;
  let events = [];

  if (!doctorID && !entity) {
    location.href = "/";
    return;
  }

  function fetchClinicSchedule() {
    return $.ajax({
      method: "GET",
      url: `${API_BASE_URL}/doctors/schedules/${doctorID}`,
      dataType: "json",
      contentType: "application/json",
    });
  }

  function addClinicSchedule(data) {
    // data is array
    return $.ajax({
      method: "POST",
      url: `${API_BASE_URL}/doctors/schedules`,
      data: JSON.stringify(data),
      dataType: "json",
      contentType: "application/json",
    });
  }

  // var calendarEl = document.getElementById("calendar");
  // var calendar = new FullCalendar.Calendar(calendarEl, {
  //   initialView: "dayGridMonth",
  //   selectable: true,
  //   selectHelper: true,
  //   validRange: {
  //     start: new Date(moment().add(1, "days")),
  //   },
  //   select: function ({ start, end, jsEvent, view }) {
  //     selectedStartDate = start;
  //     selectedEndDate = end;

  //     let parsedStart = moment(start).format("MM/DD/YYYY");
  //     let parsedEnd = moment(end).subtract(1, "days").format("MM/DD/YYYY");

  //     if (parsedStart === parsedEnd) {
  //       $("#dateInput").val(`${parsedStart}`);
  //     } else {
  //       $("#dateInput").val(`${parsedStart} - ${parsedEnd}`);
  //     }

  //     // $("#dateInput").val(`${parsedStart} - ${parsedEnd}`);

  //     createScheduleCanvas.offcanvas("show");
  //   },
  //   events: events,
  // });

  // calendar.render();
  // console.log(calendar.getEventById("4VAS58"));

  // fetchClinicSchedule()
  //   .then(function (response) {
  //     let data = response;

  //     data.forEach(function (item) {
  //       let tempObj = {};

  //       tempObj["id"] = item["_id"];
  //       tempObj["start"] = item["scheduleDate"];
  //       tempObj["title"] = "Random";

  //       // events.push(tempObj);
  //       calendar.addEvent(tempObj);
  //     });
  //     console.log(calendar.getEventById("4VAS58"));
  //   })
  //   .catch(function (xhr) {
  //     console.log(xhr);
  //   });

  $(".time").timepicker({
    timeFormat: "h:i A",
    minTime: "8am",
    maxTime: "5pm",
  });

  $("#start-time").each(function () {
    $(this).timepicker("setTime", "8");
  });

  // listen on form submit
  $("#createScheduleForm").on("submit", function (e) {
    e.preventDefault();

    let startDate = moment(selectedStartDate);
    let endDate = moment(selectedEndDate).subtract(1, "days");
    let startTime = $("#start-time").timepicker("getTime");
    let startHour = startTime.getHours();
    let startMin = startTime.getMinutes();
    let endTime = $("#end-time").timepicker("getTime");
    let endHour = endTime.getHours();
    let endMin = endTime.getMinutes();

    startDate.add(startHour, "hours");
    startDate.add(startMin, "minutes");

    endDate.add(endHour, "hours");
    endDate.add(endMin, "minutes");

    let duplicateStartDate = startDate.clone();
    let duplicateEndDate = endDate.clone();
    while (duplicateStartDate <= moment(duplicateEndDate)) {
      let selectedSchedule = {
        doctorID,
        // start: duplicateStartDate.utc().toISOString(),
        start: duplicateStartDate.format("YYYY-MM-DDTHH:mm:ssZ"),
        end: duplicateEndDate.format("YYYY-MM-DDTHH:mm:ssZ"),
      };

      listOfSchedule.push(selectedSchedule);
      duplicateStartDate = moment(duplicateStartDate).add(1, "days");
    }

    console.log(listOfSchedule);

    let parsedStart = startDate.format("MM/DD/YYYY");
    let parsedEnd = endDate.format("MM/DD/YYYY");

    if (parsedStart === parsedEnd) {
      $("#conf-sched-date").text(`${parsedStart}`);
    } else {
      $("#conf-sched-date").text(`${parsedStart} - ${parsedEnd}`);
    }

    $("#conf-start-time").text($("#start-time").val());
    $("#conf-end-time").text($("#end-time").val());

    createScheduleCanvas.offcanvas("hide");
    confirmationScheduleModal.modal("show");
  });

  $("#cancel-schedule-btn").on("click", function () {
    createScheduleCanvas.offcanvas("show");
  });

  $("#add-schedule-btn").on("click", function () {
    // SEND TO BACKEND USING AJAX
    addClinicSchedule(listOfSchedule)
      .then(function (response) {
        listOfSchedule = [];

        // confirmationScheduleModal.modal("hide");
        location.reload();
      })
      .catch(function (xhr) {
        console.log(xhr);
        console.log(listOfSchedule);
      });
  });
});
