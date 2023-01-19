$(function () {
  class ChartLoader {
    loadCheckupTallyReport(labels, values, year, month) {
      const weeklyCheckUpCount = document.getElementById("weeklyCheckUpTally");
      new Chart(weeklyCheckUpCount, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: `Number of checkups in the month of ${month} ${year}`,
              data: values,
              borderWidth: 1,
            },
          ],
        },
        options: {
          maintainAspectRatio: false,
          scales: {
            y: {
              ticks: {
                beginAtZero: true,
                callback: function (value) {
                  if (value % 1 === 0) {
                    return value;
                  }
                },
              },
            },
          },
        },
      });
    }

    loadWeeklyServiceReport(labels, values, year, month) {
      const weeklyServiceReport = document.getElementById(
        "weeklyServiceReport"
      );
      new Chart(weeklyServiceReport, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: `Number of checkups in the month of ${month} ${year}`,
              data: values,
              borderWidth: 1,
            },
          ],
        },
        options: {
          maintainAspectRatio: false,
          scales: {
            y: {
              ticks: {
                beginAtZero: true,
                callback: function (value) {
                  if (value % 1 === 0) {
                    return value;
                  }
                },
              },
            },
          },
        },
      });
    }

    loadAttendanceTallyReport(year, month) {
      fetchAttendanceTally(year, month)
        .then(function (response) {
          const data = response;

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
            checkInChartData.labels.push(item["doctorName"]);
            const attendanceCount = item["attendance"];
            absentDataSet.data.push(attendanceCount["absent"]);
            lateDataSet.data.push(attendanceCount["late"]);
            onTimeDataset.data.push(attendanceCount["onTime"]);
          });

          checkInChartData.datasets = [
            onTimeDataset,
            lateDataSet,
            absentDataSet,
          ];

          const attendanceTallyReport =
            document.getElementById("monthlyTimeIn");
          new Chart(attendanceTallyReport, {
            type: "bar",
            data: checkInChartData,
            options: {
              maintainAspectRatio: false,
              scales: {
                y: {
                  ticks: {
                    beginAtZero: true,
                    callback: function (value) {
                      if (value % 1 === 0) {
                        return value;
                      }
                    },
                  },
                },
              },
            },
          });
        })
        .catch(function (xhr) {
          console.log(xhr);
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
              ticks: {
                beginAtZero: true,
                callback: function (value) {
                  if (value % 1 === 0) {
                    return value;
                  }
                },
              },
            },
          },
        },
      });
    }
  }

  const chartLoaderObj = new ChartLoader();
  const CURRENTYEAR = new Date().getFullYear();
  const CURRENTMONTH = new Date().toLocaleDateString("default", {
    month: "long",
  });

  console.log(CURRENTYEAR, CURRENTMONTH);

  //Get the value of Start and End of Week
  $("#dateRangePicker").on("changeDate", function (e) {
    console.log("HELLo");
    value = $("#dateRangePicker").val();
    let firstDate = moment(value, "MM/DD/YYYY").day(0).format("MM/DD/YYYY");
    let lastDate = moment(value, "MM/DD/YYYY").day(6).format("MM/DD/YYYY");
    console.log(firstDate, lastDate);
    $("#dateRangePicker").val(`${firstDate}  -  ${lastDate}`);
  });

  fetchDoctorsTally(CURRENTYEAR, CURRENTMONTH)
    .then(function (response) {
      console.log(response);
      if (response) {
        let data = response;
        console.log(data);
        let checkUpLabels = [];
        let checkUpValues = [];

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
          // checkInChartData.labels.push(item["doctorName"]);
          // const attendanceCount = item["attendance"];
          // absentDataSet.data.push(attendanceCount["absent"]);
          // lateDataSet.data.push(attendanceCount["late"]);
          // onTimeDataset.data.push(attendanceCount["onTime"]);
        });

        // checkInChartData.datasets = [onTimeDataset, lateDataSet, absentDataSet];

        // chartLoaderObj.loadWeeklyCheckinReports(checkInChartData);

        chartLoaderObj.loadCheckupTallyReport(
          checkUpLabels,
          checkUpValues,
          CURRENTYEAR,
          CURRENTMONTH
        );
      }
    })
    .catch(function (xhr) {
      console.log(xhr);
    });

  chartLoaderObj.loadAttendanceTallyReport(CURRENTYEAR, CURRENTMONTH);

  fetchClinicServicesTally(CURRENTYEAR, CURRENTMONTH)
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
        chartLoaderObj.loadWeeklyServiceReport(
          labels,
          values,
          CURRENTYEAR,
          CURRENTMONTH
        );
      }
    })
    .catch(function (xhr) {
      console.log(xhr);
    });
});
