$(function () {
  const camelToFlat = (text) => text.replace(/([A-Z])/g, " $1").toLowerCase();

  const camelToCapitalized = (text) =>
    `${text[0].toUpperCase()}${text.replace(/([A-Z])/g, " $1").slice(1)}`;

  function interpretVitalSigns(data) {
    let measurementsMap = {
      height: "cm",
      weight: "kg",
      temperature: "&#8451",
      bloodPressure: "mm Hg",
      respirationRate: "bpm (breaths per min)",
      oxygenSaturation: "%",
      heartRate: "bpm (beats per min)",
    };

    Object.entries(data).forEach(([key, value]) => {
      let category = camelToCapitalized(key);

      let htmlToAppend = `
      <p class="mb-1">
        <b class="summary-cat-title">${category}:</b> ${value}${
        measurementsMap[key] || ""
      }
      </p>`;

      $("#vital-signs div").append(htmlToAppend);
    });
  }

  function interpretHPI(data) {
    Object.entries(data).forEach(([key, value]) => {
      let category = camelToCapitalized(key);
      // SPECIAL CASE FOR DURATION
      if (key.includes("duration")) {
        value = value.join(" ");
      }

      if (Array.isArray(value)) {
        value = value.join(", ");
      }

      let htmlToAppend = `
      <p class="mb-1">
        <b class="summary-cat-title">${category}:</b> ${camelToFlat(value)}
      </p>`;

      $("#HPI div").append(htmlToAppend);
    });
  }

  function interpretPatientHistory(data) {
    function interpretPregnancyHistory(data) {
      let pregnancyHistoryDiv = $(
        `<div class='mb-3 pregnancy-history'>
          <h4><b>Pregnancy History</b></h4>
        </div>`
      );
      $("#patient-history > div").append(pregnancyHistoryDiv);

      let GTPAL = {
        G: 0,
        T: 0,
        P: 0,
        A: 0,
        L: 0,
      };
      data.forEach((item, idx) => {
        htmlToAppend = $(
          `<div class="mb-3 pregnancy-item-${
            idx + 1
          }"><h5 class="mb-2"><b>Pregnancy ${idx + 1}:</b></h5></div>`
        );
        $(".pregnancy-history").append(htmlToAppend);

        let pregnancyItem = "";
        for (const [key, value] of Object.entries(item)) {
          pregnancyItem += `<p class="mb-1"><b>${camelToCapitalized(
            key
          )}:</b> ${camelToFlat(value)}</p>`;
          if (key === "durationOfPregnancy") {
            GTPAL["G"] += 1;

            if (value !== "full term") {
              GTPAL["P"] += 1;
              continue;
            }
            GTPAL["T"] += 1;
          }

          if (key === "presentHealth") {
            console.log(value);
            if (value === "Deceased") {
              GTPAL["A"] += 1;
              continue;
            }
            GTPAL["L"] += 1;
          }
        }
        $(`div.pregnancy-item-${idx + 1}`).append(pregnancyItem);
      });

      console.log(GTPAL);
      $(`
        <p class="mb-1 fst-italic"><b>GTPAL: G${GTPAL.G}, T${GTPAL.T}, P${GTPAL.P}, A${GTPAL.A}, L${GTPAL.L} </b></p>
      `).insertAfter($("div.pregnancy-history h4"));
    }

    function interpretHistoryUsingArray(category, dataArray) {
      console.log(dataArray);
      let htmlToAppend = `
      <div class='mb-3 ${category}'>
        <h4><b>${camelToCapitalized(category)}</b></h4>
      </div>`;
      $("#patient-history > div").append(htmlToAppend);
      dataArray.forEach((item) => {
        for (const [key, value] of Object.entries(item)) {
          let htmlItem = `
          <p class="mb-1"><b>${camelToCapitalized(key)}:</b> ${camelToFlat(
            value
          )}</p>`;

          $(`div.${category}`).append(htmlItem);
        }
      });
    }

    function interpretHistoryUsingObject(category, dataObject) {
      let htmlToAppend = `
      <div class='mb-3 ${category}'>
        <h4><b>${camelToCapitalized(category)}</b></h4>
      </div>`;
      $("#patient-history > div").append(htmlToAppend);
      Object.entries(dataObject).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value = value.join(", ");
        }
        let htmlItem = `
          <p class="mb-1"><b>${camelToCapitalized(key)}:</b> ${camelToFlat(
          value
        )}</p>`;

        $(`div.${category}`).append(htmlItem);
      });
    }

    Object.entries(data).forEach(([key, items]) => {
      // console.log(key, value);

      if (key === "pregnancyHistory") {
        interpretPregnancyHistory(items);
      } else if (
        [
          "allergyHistory",
          "currentMedicationHistory",
          "preventiveCareHistory",
          "surgicalHistory",
        ].includes(key)
      ) {
        interpretHistoryUsingArray(key, items);
      } else {
        interpretHistoryUsingObject(key, items);
      }
    });
  }

  function interpretROS(data) {
    // denies no, reports yes
    let sortedData = Object.keys(data)
      .sort()
      .reduce((a, v) => {
        a[v] = data[v];
        return a;
      }, {});

    // console.log(JSON.stringify(sortedData));

    Object.entries(sortedData).forEach(([key, items]) => {
      let category = camelToCapitalized(key);

      let positives = [];
      let negatives = [];
      let notes = "";

      Object.entries(items).forEach(([key, value]) => {
        if (key.includes("Notes")) {
          notes = value;
          return;
        }
        if (value.toLowerCase() === "yes") {
          positives.push(key);
          return;
        }
        negatives.push(key);
      });

      let positivesString = "";
      let negativesString = "";

      if (positives.length) {
        positives.forEach(function (item) {
          positivesString += `${camelToFlat(item)}, `;
        });
      }
      if (negatives.length) {
        negatives.forEach(function (item) {
          negativesString += `${camelToFlat(item)}, `;
        });
      }

      let htmlToAppend = `
      <p>
        <b class="summary-cat-title">${category}</b>
        <br />
        <b>reported</b>: ${positivesString}
        <br />
        <b>denies</b>: ${negativesString}
        <br />
        <b>Additional Notes: </b>
        <br /> 
        ${notes}
      </p>`;

      $("#ROS div").append(htmlToAppend);
    });
  }

  let vitalSignsData = getDataFromLocalStorage("vitalSigns");
  let HPIData = getDataFromLocalStorage("HPI");
  let patientHistoryData = getDataFromLocalStorage("patientHistory");
  let ROSData = getDataFromLocalStorage("reviewOfSystems");

  if (Object.keys(vitalSignsData).length) {
    interpretVitalSigns(vitalSignsData);
  }

  if (Object.keys(HPIData).length) {
    interpretHPI(HPIData);
  }

  if (Object.keys(patientHistoryData).length) {
    interpretPatientHistory(patientHistoryData);
  }

  if (Object.keys(ROSData).length) {
    interpretROS(ROSData);
  }
});
