$(function () {
  function generateScheduleTr(
    doctorName,
    dateOfDuty,
    startTimeOfShift,
    arrivalTime,
    currentArrivalStatus
  ) {
    let statusClass = "text-danger";
    if (currentArrivalStatus === "onTime") {
      statusClass = "text-success";
    }

    const camelToCapitalized = (text) =>
      `${text[0].toUpperCase()}${text.replace(/([A-Z])/g, " $1").slice(1)}`;
    return `
       <tr>
          <td>${doctorName}</td>
          <td>${dateOfDuty}</td>
          <td>${startTimeOfShift}</td>
          <td>${arrivalTime}</td>
          <td class="">
              <span class='fw-bold ${statusClass}'>${camelToCapitalized(currentArrivalStatus)}</span>
          </td>  
        </tr>`;
    /*
       <td class='fw-bold ${statusClass}'>${currentArrivalStatus}</td>
        */
  }

  let schedulesForTheDay = [];
  let checkedInDoctors = [];

  $("#arrivalTime").timepicker({
    step: 1,
    forceRoundTime: true,
    timeFormat: "h:i A",
    defaultTime: "00",
    minTime: "8am",
    maxTime: "5pm",
    // disableTimeRanges: [["11:00", "12:00"], []],
    scrollbar: false,
    showOn: [],
  });

  $("#arrivalTime").on("focus", function (e) {
    e.preventDefault();
  });

  $("#restOfForm").slideUp();
  $("#arrivalTimeContainer").slideUp();

  fetchSchedules()
    .then(function (response) {
      console.log(response);
      let data = response;

      if (data.length) {
        data.forEach(function (schedule) {
          console.log(schedule);
          let startDate = moment(schedule["start"]).format("MM/DD/YYYY");
          if (startDate === moment().format("MM/DD/YYYY")) {
            if (schedule.arrivalStatus) {
              checkedInDoctors.push(schedule);
            } else {
              schedulesForTheDay.push(schedule);
              $("#doctorName").append(
                $("<option>", {
                  value: schedule._id,
                  text: schedule.doctorName,
                })
              );
            }
          }
        });

        // APPEND TO TABLE
        /* 
            doctorName,
            dateOfDuty,
            startTimeOfShift,
            arrivalTime,
            currentArrivalStatus,
        */
        let scheduleTableBody = $(".schedule-summary-table tbody");

        scheduleTableBody.empty();
        scheduleTableBody.append(`<tr></tr>`);
        checkedInDoctors.forEach(function (item) {
          const doctorName = item.doctorName;
          const startTimeOfShift = moment(item.start).format("hh:mm A");
          const dateOfDuty = moment(item.start).format("MM/DD/YYYY");
          const currentArrivalStatus = item.arrivalStatus || "Did arrived yet";
          let arrivalTime = "";
          if (currentArrivalStatus.toLowerCase() === "absent") {
            arrivalTime = "Did not arrive";
          } else {
            arrivalTime = item.arrivalTime;
          }

          scheduleTableBody.append(
            generateScheduleTr(
              doctorName,
              dateOfDuty,
              startTimeOfShift,
              arrivalTime,
              currentArrivalStatus
            )
          );

          console.log(item);
        });
      }
    })
    .catch(function (xhr) {
      console.log(xhr);
    });

  $("#doctorName").on("change", function () {
    const value = $(this).val();

    if (value) {
      const selectedSchedule = schedulesForTheDay.filter(function (schedule) {
        return value === schedule._id;
      })[0];

      const startTime = moment(selectedSchedule.start);

      $("#shiftSched").val(startTime.format("hh:mm A"));
      $("#arrivalTime").val(moment().format("hh:mm A"));

      //   $("#restOfForm").removeClass("d-none");
      //   $("#restOfForm").removeClass("d-none");

      // POPULATE ARRIVAL STATUS
      let arrivalStatusOptions = [
        $("<option>", {
          value: "",
          text: "Select option",
        }),
      ];
      console.log(moment().isSameOrBefore(startTime));
      if (moment().isSameOrBefore(startTime)) {
        arrivalStatusOptions.push(
          $("<option>", {
            value: "onTime",
            text: "On-Time",
          })
        );
      } else {
        arrivalStatusOptions.push(
          $("<option>", {
            value: "late",
            text: "Late",
          })
        );
      }
      arrivalStatusOptions.push(
        $("<option>", {
          value: "absent",
          text: "Absent",
        })
      );

      $("#arrivalStatus").empty();
      arrivalStatusOptions.forEach(function (item) {
        console.log(item);
        $("#arrivalStatus").append(item);
      });

      $("#restOfForm").slideDown();
      return;
    }

    $("#shiftSched").val("");
    $("#restOfForm").slideUp();
  });

  $("#arrivalStatus").on("change", function () {
    let value = $(this).val();

    if (value && ["late", "on time"].includes(value.toLowerCase())) {
      $("#arrivalTimeContainer").slideDown();
      $("#arrivalTime").prop("disabled", false);

      return;
    }
    $("#arrivalTime").prop("disabled", true);
    $("#arrivalTimeContainer").slideUp();
  });

  $("#checkIn-btn").on("click", function () {
    $("#checkInForm").trigger("submit");
  });

  $("#checkInForm").on("submit", function (e) {
    e.preventDefault();
    if ($(this).valid()) {
      const formValues = $(this).serializeArray();
      let cleanedFormValues = {};
      // Object.entries(formValues)) {
      //   cleanedFormValues[key] = value;
      // }

      formValues.forEach(function (item) {
        cleanedFormValues[item["name"]] = item["value"];
      });

      console.log(cleanedFormValues);
      const schedID = cleanedFormValues.doctorName;
      delete cleanedFormValues.doctorName;

      const payload = cleanedFormValues;
      checkIn(schedID, payload)
        .then(function (response) {
          console.log(response);

          if (response) {
            location.reload();
          }
        })
        .catch(function (xhr) {
          console.log(xhr);
        });
      $("#checkInModal").modal("hide");
    }

    // $(".schedule-summary-table tbody").append(generateScheduleTr());
  });
});
