$(function () {
  const camelToFlat = (text) => text.replace(/([A-Z])/g, " $1").toLowerCase();

  const camelToCapitalized = (text) =>
    `${text[0].toUpperCase()}${text.replace(/([A-Z])/g, " $1").slice(1)}`;
  //VITAL SIGNS
  function interpretVitalSigns(data) {
    if (!Object.keys(data).length) return;

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
        <b class="summary-cat-title">${category}:</b> ${value || ""}${
        value ? measurementsMap[key] : ""
      }
      </p>`;

      $("#vital-signs div").append(htmlToAppend);
    });
  }

  //HPI
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

  //PATIENT HISTORY
  function interpretPatientHistory(data) {
    function interpretPregnancyHistory(data) {
      if (!Object.keys(data).length) return;
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
      if (!dataArray.length) return;
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
      if (!Object.keys(dataObject).length) return;
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

  //REVIEW OF SYSTEMS
  function interpretROS(data) {
    if (!Object.keys(data).length) return;
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

      if (!Object.keys(items).length) {
        let htmlToAppend = `
        <p>
        <b class="summary-cat-title">${category}</b>
        <br>
          No data recorded
        </p>`;

        $("#ROS div").append(htmlToAppend);
        return;
      }

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

  //PE
  function interpretPE(data) {
    function interpretFetalPresentation(dataObject) {
      if (!Object.keys(dataObject).length) return;

      // let htmlToAppend = `
      // <div class='mb-3 fetalPresentation'>
      //   <h4><b>Fetal Presentation</b></h4>
      // </div>`;
      // $("#physical-exam div#fetalPresentation").append(htmlToAppend);
      Object.entries(dataObject).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value = value.join(", ");
        }
        let htmlItem = `
          <p class="mb-1"><b>${camelToCapitalized(key)}:</b> ${value}</p>`;

        $(`div#fetalPresentation div.contents`).append(htmlItem);
      });
    }

    function interpretGeneralExam(dataArray) {
      if (!dataArray.length) return;

      console.log(dataArray);

      let additionalNotes = "";

      // let htmlToAppend = `
      // <div>
      //   <h4 id="general-exam-title"><b>General Examination</b></h4>
      //   <div class='mb-3 row row-cols-1 row-cols-md-2 align-content-stretch' id="general-exam">
      //   </div>
      // </div>`;
      // $("#physical-exam div#generalExam").append(htmlToAppend);
      dataArray.forEach((item) => {
        const currentCategory = Object.keys(item)[0];
        if (currentCategory !== "additionalNotes") {
          let generalItemContainer = `
          <div class="mb-3 col" id=${currentCategory}></div>
          `;
          $("#physical-exam div#generalExam div.contents").append(
            generalItemContainer
          );
        }

        Object.entries(item).forEach(([key, value]) => {
          // console.log(key, value);
          let htmlItem = "";
          let keyToDisplay = key;
          if (key !== "HEENT") keyToDisplay = camelToCapitalized(key);

          if (
            key.toLowerCase().includes("notes") &&
            key !== "additionalNotes"
          ) {
            htmlItem = `
            <p class="mb-0">
            <b>remarks:</b>
            ${value}
            </p>`;
          } else if (key === "additionalNotes") {
            additionalNotes = value;
          } else {
            htmlItem = `
            <p class="mb-0"><b>${keyToDisplay}:</b>
            <br />
            <b>impression:</b> ${camelToFlat(value)}</p>`;
          }

          $(`div#${currentCategory}`).append(htmlItem);
        });
      });
      $(`
      <div></div>
      <div class="flex-shrink-0 col">
        <p>
        <b>Additional Notes:</b>
        <br/>
        ${additionalNotes}
      </div>
        `).appendTo($("#generalExam div.contents"));
    }

    function interpretInternalExam(data) {
      if (!Object.keys(data).length) return;

      for (const [key, items] of Object.entries(data)) {
        if (key === "papSmear") {
          if (!Object.keys(items).length) {
            $("#papSmear .contents").append(
              $(`
            <p class="mb-1">Not Examined</p>
            `)
            );
            continue;
          }

          $("#papSmear .contents").append(
            $(`
          <p class="mb-1"><b>Result:</b> ${items["result"]}</p>
          <p class="mb-1">
            <b>Additional Notes:</b>
            ${items["papSmearNotes"]}
          </p>
          `)
          );
        }

        for (const [key, value] of Object.entries(items)) {
          if (key === "Vulva") {
            if (!value.length) {
              $(`#${key.toLowerCase()} .contents`).append(
                `<p class="mb-1">Not Examined</p>`
              );
              continue;
            }
            value.forEach((item) => {
              let vulvaHtml = "";

              let category = Object.keys(item)[0];

              $(`<div class="mb-2" id=${category}></div>`).appendTo(
                $("#vulva .contents")
              );
              for (const [key, value] of Object.entries(item)) {
                vulvaHtml += `<p class="mb-0"><b>${camelToCapitalized(
                  key
                )}:</b> ${value}</p>`;
              }
              $(vulvaHtml).appendTo($(`div#${category}`));
            });
          } else {
            if (!Object.entries(value).length) {
              $(`#${key.toLowerCase()} .contents`).append(
                `<p class="mb-1">Not Examined</p>`
              );
              continue;
            }
            for (const [k, v] of Object.entries(value)) {
              $(`
              <p class="mb-0">
                <b>${camelToCapitalized(k)}:</b>
     
                ${camelToFlat(v)}
              </p>
              `).appendTo($(`#${key.toLowerCase()} .contents`));
            }
          }
        }

        // let htmlToAppend = `
        // <div>
        // <p class="mb-1">
        //   <b class="summary-cat-title">${category}:</b> ${camelToFlat(value)}
        // </p>
        // </div>`;

        // $("#physical-exam").append(htmlToAppend);
      }
    }

    Object.entries(data).forEach(([key, items]) => {
      // console.log(key, value);

      if (key === "internalExamination") {
        interpretInternalExam(items);
      } else if (key === "general") {
        interpretGeneralExam(items);
      } else {
        interpretFetalPresentation(items);
      }
    });
  }

  //Assessment
  function interpretAssessment(data) {
    if (!Object.keys(data).length) return;
    Object.entries(data).forEach(([key, value]) => {
      let category = camelToCapitalized(key);

      let htmlToAppend = `
      <p class="mb-1">
        <b class="summary-cat-title">${category}:</b> ${camelToFlat(value)}
      </p>`;

      $("#assessment").append(htmlToAppend);
    });
  }

  //Laboratory
  function interpretLaboratory(data) {
    if (!Object.keys(data).length) return;

    Object.entries(data).forEach(([key, value]) => {
      let category = camelToCapitalized(key);
      // SPECIAL CASE FOR DURATION
      if (Array.isArray(value)) {
        value = value.join(", ");
      }

      let htmlToAppend = `
      <p class="mb-1">
        <b class="summary-cat-title">${category}:</b> ${value}
      </p>`;

      $("#laboratory").append(htmlToAppend);
    });
  }

  let vitalSignsData = getDataFromLocalStorage("vitalSigns");
  let HPIData = getDataFromLocalStorage("HPI");
  let patientHistoryData = getDataFromLocalStorage("patientHistory");
  let ROSData = getDataFromLocalStorage("reviewOfSystems");
  let PEData = getDataFromLocalStorage("physicalExamination");
  let assessmentData = getDataFromLocalStorage("Assessment");
  let laboratoryData = getDataFromLocalStorage("laboratory");

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

  if (Object.keys(PEData).length) {
    interpretPE(PEData);
  }

  if (Object.keys(assessmentData).length) {
    interpretAssessment(assessmentData);
  }

  if (Object.keys(laboratoryData).length) {
    interpretLaboratory(laboratoryData);
  }
});
