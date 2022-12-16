$(function () {
  class ChartLoader {
    loadBMIChart(data) {
      let { labels, values } = data;
      const chart1 = document.getElementById("BMIChart");

      new Chart(chart1, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "BMI",
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

    loadRRChart(data) {
      let { labels, values } = data;
      const rrChart = document.getElementById("RRChart");

      new Chart(rrChart, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Respiration Rate",
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

    loadBPChart(data) {
      let { labels, values } = data;
      let { systolic, diastolic } = values;

      const BPChart = document.getElementById("BPChart");

      new Chart(BPChart, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Systolic",
              data: systolic,
              borderWidth: 1,
            },
            {
              label: "Diastolic",
              data: diastolic,
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

    loadHRChart(data) {
      let { labels, values } = data;

      const HRChart = document.getElementById("HRChart");
      new Chart(HRChart, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Heart Rate",
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

  let splitLocation = location.href.split("/");
  let patientID = splitLocation[splitLocation.length - 1];

  fetchPatientFacesheetBasicInfo(patientID)
    .then(function (response) {
      if (response.length) {
        let data = response[0];
        let { name, bday } = data.basicInformation;

        $("#name").text(`Name: ${name}`);
        $("#bday").text(`Birthday: ${bday}`);
        let parsedBday = moment(bday, "MM/DD/YYYY");
        let age = moment().diff(parsedBday, "years");
        $("#age").text(`Age: ${age}`);
      }
    })
    .catch(function (xhr) {
      console.log(xhr);
    });

  fetchAllCheckUpData(patientID)
    .then(function (response) {
      let data = response;
      let BMIData = {
        labels: [],
        values: [],
      };
      let RRData = {
        labels: [],
        values: [],
      };
      let BPData = {
        labels: [],
        values: {
          systolic: [],
          diastolic: [],
        },
      };
      let HRData = {
        labels: [],
        values: [],
      };

      data.forEach(function (item) {
        let checkUpDate = moment(item.completedDate).format("MM/DD/YYYY");
        let { height, weight, respirationRate, heartRate, bloodPressure } =
          item.vitalSigns;
        // BMI
        let BMI = parseFloat(weight / (height / 100) ** 2).toFixed(1);
        BMIData.labels.push(checkUpDate);
        BMIData.values.push(BMI);

        // RESPIRATION RATE
        RRData.labels.push(checkUpDate);
        RRData.values.push(respirationRate);

        // BP
        let [systolic, diastolic] = bloodPressure.split("/");
        if (!diastolic) {
          diastolic = 0;
        }
        BPData.labels.push(checkUpDate);
        BPData.values.systolic.push(systolic);
        BPData.values.diastolic.push(diastolic);

        console.log(bloodPressure.split("/"));

        // HEART RATE
        HRData.labels.push(checkUpDate);
        HRData.values.push(heartRate);
      });

      let chartLoader = new ChartLoader();
      chartLoader.loadBMIChart(BMIData);
      chartLoader.loadRRChart(RRData);
      chartLoader.loadBPChart(BPData);
      chartLoader.loadHRChart(HRData);
    })
    .catch(function (xhr) {
      console.log(xhr);
    });

  $("#go-to-emr").on("click", function () {
    localStorage.removeItem("activeEMRView");
    localStorage.removeItem("emr-data");
    location.href = `/emr/${patientID}`;
  });
});
