$(function () {
  class ChartLoader {
    loadCheckupTallyReport(labels, values) {
      const weeklyCheckUpCount = document.getElementById("weeklyCheckUpTally");
      new Chart(weeklyCheckUpCount, {
        type: "bar",
        scales: {
          y: {
            callback: function (value) {
              if (value % 1 === 0) {
                return value;
              }
            },
          },
        },
        data: {
          labels,
          datasets: [
            {
              label: "Weekly Check-Up Tally",
              data: values,
              borderWidth: 1,
            },
          ],
        },
        options: {
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }

    loadWeeklyServiceReport(labels, values) {
      const weeklyServiceReport = document.getElementById(
        "weeklyServiceReport"
      );
      new Chart(weeklyServiceReport, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Weekly Service Use",
              data: values,
              borderWidth: 1,
            },
          ],
        },
        options: {
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }

    loadWeeklyCheckinReports(data) {
      const weeklyServiceReport = document.getElementById("weeklyTimeIn");
      new Chart(weeklyServiceReport, {
        type: "bar",
        data: data,
        options: {
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  }

  $("#dateRangePicker").datepicker({
    autoclose: true,
    // changeMonth: true,
    // changeYear: true,
    format: "mm/dd/yyyy",
    forceParse: false,
    endDate: "+0d",
  });

  const chartLoaderObj = new ChartLoader();

  //Get the value of Start and End of Week
  $("#dateRangePicker").on("changeDate", function (e) {
    console.log("HELLo");
    value = $("#dateRangePicker").val();
    let firstDate = moment(value, "MM/DD/YYYY").day(0).format("MM/DD/YYYY");
    let lastDate = moment(value, "MM/DD/YYYY").day(6).format("MM/DD/YYYY");
    console.log(firstDate, lastDate);
    $("#dateRangePicker").val(`${firstDate}  -  ${lastDate}`);
  });

  fetchDoctorsTally()
    .then(function (response) {
      console.log(response);
      if (response) {
        let data = response;
        console.log(data);
        let checkUpLabels = [];
        let checkUpValues = [];
        let checkInLabels = [];
        let checkInValues = [];

        let checkInChartData = {
          labels: [],
          datasets: [],
        };

        let onTimeDataset = {
          label: "On-Time",
          data: [],
          borderWidth: 1,
        };
        let lateDataSet = {
          label: "Late",
          data: [],
          borderWidth: 1,
        };
        let absentDataSet = {
          label: "Absent",
          data: [],
          borderWidth: 1,
        };

        data.forEach(function (item) {
          checkUpLabels.push(item["doctorName"]);
          checkUpValues.push(item["checkUpNum"]);

          // CHECK IN DATA
          checkInChartData.labels.push(item["doctorName"]);
          const attendanceCount = item["attendance"];
          absentDataSet.data.push(attendanceCount["absent"]);
          lateDataSet.data.push(attendanceCount["late"]);
          onTimeDataset.data.push(attendanceCount["onTime"]);
        });

        checkInChartData.datasets = [onTimeDataset, lateDataSet, absentDataSet];

        chartLoaderObj.loadWeeklyCheckinReports(checkInChartData);

        chartLoaderObj.loadCheckupTallyReport(checkUpLabels, checkUpValues);
      }
    })
    .catch(function (xhr) {
      console.log(xhr);
    });

  fetchClinicServicesTally()
    .then(function (response) {
      if (response) {
        let data = response;
        let labels = [];
        let values = [];
        data.forEach(function (item) {
          let count = item["count"] || 0;
          labels.push(item["name"]);
          values.push(count);
        });
        chartLoaderObj.loadWeeklyServiceReport(labels, values);
      }
    })
    .catch(function (xhr) {
      console.log(xhr);
    });
});
