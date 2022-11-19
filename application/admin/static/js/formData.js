function cleanData(dataArray) {
  /*
      returns an object with the structure below: 
      {
        // for text inputs
        key: value
        // for checkbox
        key: [...values]
      }
    */
  let cleanedData = {};

  dataArray.forEach((data) => {
    let temp = [];
    let specVal = [];
    let specVal2 = [];
    let specVal3 = [];
    // if value is numeric
    if (isNaN(data.value)) {
      data.value = data.value.replace(/[^a-zA-Z0-9 '@.]/g, "");
      data.value = data.value.trim();
    }
    // if key is duplicate
    if (cleanedData[data.name]) {
      // on first iteration where the key has single value of type string
      // HPIRISK: "alcohol"

      if (typeof cleanedData[data.name] === "string") {
        // []
        temp.push(cleanedData[data.name]); // [alohol, exrcise]
        temp.push(data.value);
      } else {
        temp = cleanedData[data.name];
        temp.push(data.value);
      }
      // HPIRisk = ['alcohol']
      cleanedData[data.name] = temp;
      return;
    }
    // special case for HPI start date
    if (data.name === "startDate") {
      data.value = getDaysDiffToday(data.value);
    }
    cleanedData[data.name] = data.value;
  });

  console.log(cleanedData);
  return cleanedData;
}
