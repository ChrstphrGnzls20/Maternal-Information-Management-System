$(function () {
  class ChartLoader {
    loadPatientVisitChart(labels, values) {
      const patientVisits = document.getElementById("monthlyPatientVisits");
      new Chart(patientVisits, {
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
  }

  const chartLoaderObj = new ChartLoader();

  $(".yearPicker").datepicker({
    autoclose: true,
    // changeMonth: true,
    // changeYear: true,
    minViewMode: "year",
    format: "yyyy",
    forceParse: true,
    startDate: new Date(),
  });
});
