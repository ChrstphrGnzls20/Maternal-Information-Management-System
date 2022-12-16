$(function () {
  const camelToFlat = (text) => text.replace(/([A-Z])/g, " $1").toLowerCase();

  const camelToCapitalized = (text) =>
    `${text[0].toUpperCase()}${text.replace(/([A-Z])/g, " $1").slice(1)}`;

  const capitalizeText = (text) => ``;
  //VITAL SIGNS
  function interpretVitalSigns(data) {
    if (!Object.keys(data).length) return;

    let {
      height,
      weight,
      temperature,
      bloodPressure,
      respirationRate,
      oxygenSaturation,
      heartRate,
    } = data;

    let measurementsMap = {
      height: "cm",
      weight: "kg",
      temperature: "&#8451",
      bloodPressure: "mm Hg",
      respirationRate: "bpm (breaths per min)",
      oxygenSaturation: "%",
      heartRate: "bpm (beats per min)",
    };

    let BMI = calculateBMI(parseInt(height) / 100, parseInt(weight));

    let BMIInterpretation =
      interpretBMI(BMI) !== "normal"
        ? `<span class='text-danger fw-bold'>(${interpretBMI(BMI)})</span>`
        : "<span class='fw-bold'>(normal)</span>";

    let temperatureInterpretation =
      interpretTemperature(temperature) !== "normal"
        ? `<span class='text-danger fw-bold'>(${interpretTemperature(
            temperature
          )})</span>`
        : "<span class='fw-bold'>(normal)</span>";

    let [systolic, diastolic] = bloodPressure.split("/");
    let BPInterpretation =
      interpretBP(systolic, diastolic) !== "normal"
        ? `<span class='text-danger fw-bold'>(${interpretBP(
            systolic,
            diastolic
          )})</span>`
        : "<span class='fw-bold'>(normal)</span>";

    let respirationRateInterpretation =
      respirationRate < 12 || respirationRate > 25
        ? "<span class='text-danger fw-bold'>(abnormal)</span>"
        : "<span class='fw-bold'>(normal)</span>";

    let oxygenSaturationInterpretation =
      parseInt(oxygenSaturation) < 95
        ? "<span class='text-danger fw-bold'>(abnormal)</span>"
        : "<span class='fw-bold'>(normal)</span>";

    let heartRateInterpretation =
      60 > parseInt(heartRate) > 100
        ? "<span class='text-danger fw-bold'>(abnormal)</span>"
        : "<span class='fw-bold'>(normal)</span>";

    $(`
      <p class='mb-1'><b class="summary-cat-title">Height:</b> ${height}${
      measurementsMap["height"]
    }</p>
      <p class='mb-1'><b class="summary-cat-title">Weight:</b> ${weight}${
      measurementsMap["weight"]
    }</p>
      <p class='mb-1'><b class="summary-cat-title">BMI:</b> ${BMI} ${
      BMIInterpretation ? BMIInterpretation : ""
    }</p>
      <p class='mb-1'><b class="summary-cat-title">Temperature:</b> ${temperature}${
      measurementsMap["temperature"]
    } ${temperatureInterpretation}</p>
      <p class='mb-1'><b class="summary-cat-title">Blood Pressure:</b> ${bloodPressure}${
      measurementsMap["bloodPressure"]
    } ${BPInterpretation ? BPInterpretation : ""}</p>
      <p class='mb-1'><b class="summary-cat-title">Respiration Rate:</b> ${respirationRate}${
      measurementsMap["respirationRate"]
    } ${respirationRate ? respirationRateInterpretation : ""}</p>
      <p class='mb-1'><b class="summary-cat-title">Oxygen Saturation:</b> ${oxygenSaturation}${
      measurementsMap["oxygenSaturation"]
    } ${oxygenSaturation ? oxygenSaturationInterpretation : ""}</p>
      <p class='mb-1'><b class="summary-cat-title">Heart Rate:</b> ${heartRate}${
      measurementsMap["heartRate"]
    } ${heartRateInterpretation}</p>
    `).appendTo($("#vital-signs div"));
  }

  //HPI
  function interpretHPI(data) {
    if (!Object.keys(data).length) return;

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
    if (!Object.keys(data).length) return;

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
    if (!Object.entries(data).length) return;
    function interpretFetalPresentation(dataObject) {
      if (!Object.keys(dataObject).length) return;

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

  function interpretPlan(data) {
    if (!Object.keys(data).length) return;
    function interpretPrescription(dataArray) {
      if (!dataArray.length) return;

      dataArray.forEach((item, idx) => {
        let container = $(`
        <div class="mb-3">
          <h5 class="fw-bold">Item ${idx + 1}:</h5>
          <p class="mb-1"><b>Medicine Name:</b> ${camelToFlat(
            item["medicineName"]
          )}</p>
          <p class="mb-1"><b>Type:</b> ${camelToFlat(item["medicineType"])}</p>
          <p class="mb-1"><b>Dosage:</b> ${camelToFlat(
            item["medicineDosage"]
          )}${camelToFlat(item["medicineMeasurement"])}</p>
          <p class="mb-1"><b>Frequency:</b> ${camelToFlat(
            item["medicineFrequency"]
          )}x a day for ${camelToFlat(item["medicinePeriod"])} days</p>
          <p class="mb-1"><b>Instructions:</b> <br/>${camelToFlat(
            item["medicineInstructions"]
          )}</p>
        </div>
        `);
        $(container).appendTo($("#prescription .contents"));
      });
    }

    function interpretCarePlan(data) {
      if (!Object.keys(data).length) return;

      let followUpDate = data["followUpDate"] ? data["followUpDate"] : "";
      let followUpDay = "";
      let followUpTime = "";
      if (followUpDate) {
        followUpDay = moment(data["followUpDate"]).format("LL");
        followUpTime = moment(data["followUpDate"]).format("hh:mm a");
      }

      let container = $(`
        <div class="mb-3">
          <p class="mb-1"><b>Patient Status: </b>${data["patientStatus"]}</p>
          <p class="mb-1"><b>Follow-up Date: </b>${
            followUpDate ? `${followUpDay} at ${followUpTime}` : "Not specified"
          }</p>
          <p class="mb-1"><b>Care Plan: </b>
          <br />
          ${data["carePlanNotes"]}</p>
        </div>
        `);
      $(container).appendTo($("#care-plan .contents"));
    }

    for (const [key, items] of Object.entries(data)) {
      if (key.toLowerCase() === "prescription") {
        interpretPrescription(items);
      } else {
        interpretCarePlan(items);
      }
    }
  }

  $("#finish-checkup").on("click", function (e) {
    e.preventDefault();

    function checkIfObjectIsEmpty(object) {
      return Object.keys(object).length ? true : false;
    }

    function checkIfArrayIsEmpty(array) {
      return array.length ? true : false;
    }

    let vitalSignsData = getDataFromLocalStorage("vitalSigns");
    let HPIData = getDataFromLocalStorage("HPI");
    let PEData = getDataFromLocalStorage("physicalExamination");
    let fetalPresentation = PEData["fetalPresentation"];
    let generalPhysicalExam = PEData["general"];
    let papSmear = PEData["internalExamination"]["papSmear"];
    let vulva = PEData["internalExamination"]["vulvaVaginaCervix"]["Vulva"];
    let vagina = PEData["internalExamination"]["vulvaVaginaCervix"]["Vagina"];
    let cervix = PEData["internalExamination"]["vulvaVaginaCervix"]["Cervix"];
    let planData = getDataFromLocalStorage("plan");
    let presciptionData = planData["prescription"];
    let carePlanData = planData["carePlan"];

    let emptyValues = [];

    if (!checkIfObjectIsEmpty(vitalSignsData)) {
      emptyValues.push("Vital Signs");
    }

    if (!checkIfObjectIsEmpty(HPIData)) {
      emptyValues.push("History of Present Illness");
    }

    if (!checkIfObjectIsEmpty(assessmentData)) {
      emptyValues.push("Assessment");
    }

    if (
      !checkIfObjectIsEmpty(fetalPresentation) &&
      !checkIfArrayIsEmpty(generalPhysicalExam) &&
      !checkIfObjectIsEmpty(papSmear) &&
      !checkIfArrayIsEmpty(vulva) &&
      !checkIfObjectIsEmpty(vagina) &&
      !checkIfObjectIsEmpty(cervix)
    ) {
      emptyValues.push("Physical Exam");
    }

    if (
      !checkIfArrayIsEmpty(presciptionData) &&
      !checkIfObjectIsEmpty(carePlanData)
    ) {
      emptyValues.push("Care Plan");
    }

    if (emptyValues.length) {
      let toAppend = $(
        "<p>You haven't filled out the following pages:<br/></p>"
      );

      emptyValues.forEach(function (item) {
        toAppend.append($(`<p class="mb-0 fw-bold">${item}</p>`));
      });

      $("#finishCheckupModal .modal-body").empty();

      $("#finishCheckupModal .modal-title").html(
        "<h3 class='mb-0'>Warning</h3>"
      );
      $("#finishCheckupModal .modal-body").html($(toAppend));
      $("#finishCheckupModal .modal-footer").html(`
      <button type="button" class="btn btn-danger" data-bs-dismiss="modal">
        Close
      </button>`);
    } else {
      $("#finishCheckupModal .modal-title").html(
        "<h3 class='mb-0'>Confirmation</h3>"
      );

      $("#finishCheckupModal .modal-footer").html(`
      <button type="button" class="btn btn-danger" data-bs-dismiss="modal">
        Close
      </button>
      <button type="button" class="btn btn-success" id="end-checkup-btn" >
        Continue
      </button>
      `);

      fetchClinicServices().then(function (response) {
        if (response) {
          let data = response;

          console.log(data);

          $("#finishCheckupModal .modal-body").html(`
            <form id='finishCheckupForm'>
                <label for="" class="form-label">Select services performed:</label>
                <div class="row" id="servicesContainer">
                </div>
            </form>
            <p class='mt-3'>Are you sure you would like to finish this checkup documentation?</p>
            `);

          data.forEach(function (item) {
            let formGroup = $(`
            <div class="form-group" id=${item._id}>
              <input
              type="checkbox"
              class="form-check-input"
              name="servicesPerformed"
              id='${item.name}'
              value=${item._id}
              required
              />
              <label for="${item.name}" class="form-check-label">${item.name}</label>
            </div>`);

            formGroup.appendTo($("#servicesContainer"));
          });
        }
      });

      /*
        <div class="form-group">
          <input
            type="checkbox"
            class="form-check-input"
            name="servicesPerformed"
            id="checkup"
          />
          <label for="checkup" class="form-check-label"></label>
        </div>
      */
    }
    $("#finishCheckupModal").modal("show");
  });

  $("#finishCheckupModal .modal-footer").on(
    "click",
    "#end-checkup-btn",
    function () {
      let emrData = getDataFromLocalStorage();

      let servicesPerformedEl = $("input[name=servicesPerformed]:checked");
      if (servicesPerformedEl.length) {
        let servicesPerformed = servicesPerformedEl.map(function () {
          return $(this).val();
        });
        emrData["servicesPerformed"] = [...servicesPerformed];

        let splitLocation = location.href.split("/");
        let patientID = splitLocation[splitLocation.length - 1];
        let doctorID = localStorage.getItem("id");
        emrData["patientID"] = patientID;
        emrData["doctorID"] = doctorID;
        addNewCheckup(emrData)
          .then(function ({ _id }) {
            if (_id) {
              let newCheckupId = _id;
              // CREATING FOLLOW UP APPOINTMENT
              if (emrData.plan.carePlan.followUpDate) {
                let followUpDate = new Date(emrData.plan.carePlan.followUpDate);

                console.log(followUpDate);
                // SET DEFAULT TIME TO 8 AM
                // followUpDate.setHours(followUpDate.getHours() + 8);

                let newAppointment = {
                  patient_id: patientID,
                  doctor_id: doctorID,
                  appointmentDate: followUpDate.toISOString(),
                };

                window.open(`/emr/SOAP/${newCheckupId}`, "_blank");

                createFollowUpAppointment(newAppointment)
                  .then(function (response) {
                    let { _id } = response;

                    let payload = {
                      status: "accepted",
                      additionalInfo: {
                        note: "AUTOGENERATED: Pre-approved follow-up appointment.",
                      },
                    };

                    preApproveAppointment(_id, payload)
                      .then(function (_) {
                        localStorage.removeItem("activeEMRView");
                        localStorage.removeItem("emr-data");
                        // OPEN NEW WINDOW OF SOAP BEFORE REDIRECTING
                        window.open(
                          `/emr/chargingForm/${newCheckupId}`,
                          "_blank"
                        );

                        location.href = `/doctor/patients/${patientID}`;
                      })
                      .catch(function (xhr) {
                        console.log(xhr);
                      });
                  })
                  .catch(function (xhr) {
                    console.log(xhr);
                  });
              } else {
                localStorage.removeItem("activeEMRView");
                localStorage.removeItem("emr-data");
                // OPEN NEW WINDOW OF SOAP BEFORE REDIRECTING
                window.open(`/emr/chargingForm/${newCheckupId}`, "_blank");
                location.href = `/doctor/patients/${patientID}`;
              }
            }
          })
          .catch(function (xhr) {
            console.log(xhr);
          });
      }
    }
  );

  let vitalSignsData = getDataFromLocalStorage("vitalSigns");
  let HPIData = getDataFromLocalStorage("HPI");
  let patientHistoryData = getDataFromLocalStorage("patientHistory");
  let ROSData = getDataFromLocalStorage("reviewOfSystems");
  let PEData = getDataFromLocalStorage("physicalExamination");
  let assessmentData = getDataFromLocalStorage("assessment");
  let laboratoryData = getDataFromLocalStorage("laboratory");
  let planData = getDataFromLocalStorage("plan");

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

  if (Object.keys(planData).length) {
    interpretPlan(planData);
  }
});
