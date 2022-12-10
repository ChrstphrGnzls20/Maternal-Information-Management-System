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
  }
}

function getDataFromLocalStorage(
  objName,
  parentObjName = null,
  grandParentObjName = null
) {
  const emrData = JSON.parse(localStorage.getItem(LOCALSTORAGEKEY)) || null;

  if (!emrData) {
    return null;
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
