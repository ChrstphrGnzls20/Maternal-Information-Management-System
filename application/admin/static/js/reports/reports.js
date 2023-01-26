$(function () {
  const DUMMYMONTH = "January";
  const DUMMYYEAR = "2023";

  function destroyAndInitializeChart(ctrId, newCanvas) {
    $(`#${ctrId}`).empty();
    $(`#${ctrId}`).append(newCanvas);
  }

  class ChartLoader {
    updateChart(chartName, newDataConfig) {
      let chart = new Chart(document.getElementById(chartName, newDataConfig));

      chart.config.data = newDataConfig;
      chart.update();
    }
    // PATIENT CHARTS HERE
    loadPatientVisitChart(year, month) {
      fetchCheckupTally(year, month)
        .then(function (response) {
          // console.log(response);
          const data = response;

          const ordered = Object.keys(data)
            .sort(function (a, b) {
              let aVal = a.split("/")[1];
              let bVal = b.split("/")[1];

              return aVal - bVal;
            })
            .reduce((obj, key) => {
              obj[key] = data[key];
              return obj;
            }, {});

          const patientVisits = document.getElementById("monthlyPatientVisits");
          new Chart(patientVisits, {
            type: "line",
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
              datasets: [
                {
                  label: `Number of checkups in the month of ${month} ${year}`,
                  data: ordered,
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
        })
        .catch(function (xhr) {
          console.log(xhr);
        });
    }

    // SERVICE CHARTS
    loadMontlyServiceReport(year, month) {
      fetchClinicServicesTally(year, month)
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
            const monthlyServiceReport = document.getElementById(
              "monthlyServiceTally"
            );
            new Chart(monthlyServiceReport, {
              type: "bar",
              data: {
                labels: labels,
                datasets: [
                  {
                    label: `Monthly Service Use in the month of ${month} ${year}`,
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
        })
        .catch(function (xhr) {
          console.log(xhr);
        });
    }

    // DOCTORS CHARTS
    loadCheckupTallyReport(year, month) {
      fetchDoctorsTally(year, month)
        .then(function (response) {
          console.log(response);
          if (response) {
            let data = response;
            console.log(data);
            let checkUpLabels = [];
            let checkUpValues = [];

            // let checkInChartData = {
            //   labels: [],
            //   datasets: [],
            // };

            // let onTimeDataset = {
            //   label: "On-Time",
            //   data: [],
            //   borderWidth: 1,
            // };
            // let lateDataSet = {
            //   label: "Late",
            //   data: [],
            //   borderWidth: 1,
            // };
            // let absentDataSet = {
            //   label: "Absent",
            //   data: [],
            //   borderWidth: 1,
            // };

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

            // checkInChartData.datasets = [
            //   onTimeDataset,
            //   lateDataSet,
            //   absentDataSet,
            // ];

            // chartLoaderObj.loadWeeklyCheckinReports(checkInChartData);

            const monthlyCheckUpCount = document.getElementById(
              "monthlyCheckUpTally"
            );
            new Chart(monthlyCheckUpCount, {
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
                labels: checkUpLabels,
                datasets: [
                  {
                    label: `Number of conducted checkups in the month of ${month} ${year}`,
                    data: checkUpValues,
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
        })
        .catch(function (xhr) {
          console.log(xhr);
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
            document.getElementById("attendanceTally");
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
  }

  // PDF GENERATION STARTS HERE
  function generateReport(reportName) {
    let YEARSELECTED;
    let MONTHSELECTED;
    if (reportName === "patientVisit") {
      MONTHSELECTED = $("#visitMonthPicker").val();
      YEARSELECTED = $("#visitYearPicker").val();
    } else if (reportName == "clinicServicesTally") {
      MONTHSELECTED = $("#serviceTallyMonthPicker").val();
      YEARSELECTED = $("#serviceTallyYearPicker").val();
    }
    fetchReport(reportName, YEARSELECTED, MONTHSELECTED);
  }

  $(".yearPicker").datepicker({
    autoclose: true,
    // changeMonth: true,
    // changeYear: true,
    minViewMode: "years",
    format: "yyyy",
    forceParse: true,
  });
  $(".yearPicker").datepicker("update", new Date());

  const chartLoaderObj = new ChartLoader();
  // visit report
  let PICKEDMONTH = $("#visitMonthPicker").val();
  let PICKEDYEAR = $("#visitYearPicker").val();
  chartLoaderObj.loadPatientVisitChart(PICKEDYEAR, PICKEDMONTH);

  // checkup tally report for each doctor
  PICKEDMONTH = $("#checkupTallyMonthPicker").val();
  PICKEDYEAR = $("#checkupTallyYearPicker").val();
  chartLoaderObj.loadCheckupTallyReport(PICKEDYEAR, PICKEDMONTH);

  // service tally report
  PICKEDMONTH = $("#serviceTallyMonthPicker").val();
  PICKEDYEAR = $("#serviceTallyYearPicker").val();
  chartLoaderObj.loadMontlyServiceReport(PICKEDYEAR, PICKEDMONTH);

  // attendance tally report
  PICKEDMONTH = $("#attendanceTallyMonthPicker").val();
  PICKEDYEAR = $("#attendanceTallyYearPicker").val();
  chartLoaderObj.loadAttendanceTallyReport(PICKEDYEAR, PICKEDMONTH);

  $("#visitMonthPicker, #visitYearPicker").on("change", function () {
    destroyAndInitializeChart(
      "monthlyPatientVisitsCtr",
      '<canvas id="monthlyPatientVisits" height="350"></canvas>'
    );
    const PICKEDMONTH = $("#visitMonthPicker").val();
    const PICKEDYEAR = $("#visitYearPicker").val();
    chartLoaderObj.loadPatientVisitChart(PICKEDYEAR, PICKEDMONTH);
  });

  $("#checkupTallyMonthPicker, #checkupTallyYearPicker").on(
    "change",
    function () {
      destroyAndInitializeChart(
        "monthlyCheckUpTallyCtr",
        '<canvas id="monthlyCheckUpTally" height="350"></canvas>'
      );
      const PICKEDMONTH = $("#checkupTallyMonthPicker").val();
      const PICKEDYEAR = $("#checkupTallyYearPicker").val();
      chartLoaderObj.loadCheckupTallyReport(PICKEDYEAR, PICKEDMONTH);
    }
  );

  $("#serviceTallyMonthPicker, #serviceTallyYearPicker").on(
    "change",
    function () {
      destroyAndInitializeChart(
        "monthlyServiceTallyCtr",
        '<canvas id="monthlyServiceTally" height="350"></canvas>'
      );
      const PICKEDMONTH = $("#serviceTallyMonthPicker").val();
      const PICKEDYEAR = $("#serviceTallyYearPicker").val();
      chartLoaderObj.loadMontlyServiceReport(PICKEDYEAR, PICKEDMONTH);
    }
  );

  $("#attendanceTallyMonthPicker, #attendanceTallyYearPicker").on(
    "change",
    function () {
      destroyAndInitializeChart(
        "attendanceTallyCtr",
        '<canvas id="attendanceTally" height="350"></canvas>'
      );
      const PICKEDMONTH = $("#attendanceTallyMonthPicker").val();
      const PICKEDYEAR = $("#attendanceTallyYearPicker").val();
      chartLoaderObj.loadAttendanceTallyReport(PICKEDYEAR, PICKEDMONTH);
    }
  );

  $(".generate-pdf-btn").on("click", function () {
    let reportName = $(this).data("report-name");
    console.log(reportName);
    generateReport(reportName);
  });
});
