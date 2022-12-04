const LOCALSTORAGEKEY = "emr-data";
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
    try {
      emrData[parentObjName][objName] = data;
    } catch {
      emrData[parentObjName] = {};
      emrData[parentObjName][objName] = data;
    }
  } else {
    // DATA WITH NESTED TWO LEVELS
    try {
      emrData[grandParentObjName][parentObjName][objName] = data;
    } catch {
      emrData[grandParentObjName] = {};
      emrData[grandParentObjName][parentObjName] = {};
      emrData[grandParentObjName][parentObjName][objName] = data;
    }
  }

  localStorage.setItem(LOCALSTORAGEKEY, JSON.stringify(emrData));
}

function calculateBMI(heightInMeters, weightInKilograms) {
  return (weightInKilograms / heightInMeters ** 2).toFixed(2);
}
