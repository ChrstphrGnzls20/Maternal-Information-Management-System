const LOCALSTORAGEKEY = "emr-data";
function initializeEMRToLocalStorage() {
  const EMRDATA = {
    vitalSigns: {},
    HPI: {},
    patientHistory: {
      pastMedicalHistory: {},
      pregnancyHistory: {},
      contraceptiveHistory: {},
      gynecologicalHistory: {},
      currentMedicationHistory: {},
      preventiveCareHistory: {},
      surgicalHistory: {},
      allergyHistory: {},
    },
    reviewOfSystems: {
      constitutional: {},
      eyes: {},
      earsNoseThroat: {},
      breast: {},
      cardiovascular: {},
      respiratory: {},
      gastrointestinal: {},
      urinaryAndReproductive: {},
      skin: {},
      neurological: {},
      musculoskeletal: {},
      endocrine: {},
      psychiatric: {},
      bloodAndLymph: {},
      allergy: {},
    },
    physicalExamination: {
      fetalPresentation: {},
      general: [],
      internalExamination: {
        papSmear: {},
        vulvaVaginaCervix: {
          Vulva: [],
          Vagina: {},
          Cervix: {},
        },
      },
    },
    assessment: {},
    laboratory: {},
    plan: {
      prescription: [],
      carePlan: [],
    },
  };
  let existingData = localStorage.getItem(LOCALSTORAGEKEY);
  if (!existingData) {
    localStorage.setItem(LOCALSTORAGEKEY, JSON.stringify(EMRDATA));
    localStorage.setItem("activeEMRView", "vital-signs");
  }
}

function getDataFromLocalStorage(
  objName = null,
  parentObjName = null,
  grandParentObjName = null
) {
  const emrData = JSON.parse(localStorage.getItem(LOCALSTORAGEKEY)) || null;

  if (!emrData) {
    return null;
  }

  if (!objName) {
    return emrData;
  }

  if (!parentObjName && !grandParentObjName) {
    try {
      return emrData[objName];
    } catch {
      return null;
    }
  } else if (parentObjName && !grandParentObjName) {
    // DATA WITH NESTED ONE LEVEL
    try {
      return emrData[parentObjName][objName]; // ROS: CONSTI
    } catch {
      return null;
    }
  } else {
    // DATA WITH NESTED TWO LEVELS
    try {
      return emrData[grandParentObjName][parentObjName][objName];
    } catch {
      return null;
    }
  }
}

function saveDataToLocalstorage(
  data,
  objName,
  parentObjName = null,
  grandParentObjName = null
) {
  const emrData = JSON.parse(localStorage.getItem(LOCALSTORAGEKEY)) || {};
  // IF THE DATA IS NOT NESTED
  if (!parentObjName && !grandParentObjName) {
    emrData[objName] = data;
  } else if (parentObjName && !grandParentObjName) {
    // DATA WITH NESTED ONE LEVEL
    emrData[parentObjName][objName] = data;
  } else {
    // DATA WITH NESTED TWO LEVELS
    emrData[grandParentObjName][parentObjName][objName] = data;
  }

  localStorage.setItem(LOCALSTORAGEKEY, JSON.stringify(emrData));
}

function calculateBMI(heightInMeters, weightInKilograms) {
  return (weightInKilograms / heightInMeters ** 2).toFixed(2);
}

function interpretBMI(BMI) {
  if (BMI <= 18.5) {
    return "underweight";
  } else if (BMI <= 24.9) {
    return "normal";
  } else if (BMI <= 29.9) {
    return "overweight";
  } else {
    return "obese";
  }
}

function interpretTemperature(temp) {
  if (temp < 36) {
    return "lower than average";
  } else if (temp <= 37) {
    return "normal";
  } else if (temp <= 38) {
    return "high than average";
  } else {
    return "fever";
  }
}

function interpretBP(systolic, diastolic) {
  if (systolic < 90 || diastolic < 60) {
    return "low blood pressure";
  } else if (systolic < 120 && diastolic < 80) {
    return "normal";
  } else if (120 <= systolic <= 129 && diastolic < 80) {
    return "elevated blood pressure";
  } else if (130 <= systolic <= 139 || 80 <= diastolic <= 89) {
    return "pre-high blood pressure";
  } else {
    return "high blood pressure";
  }
}
