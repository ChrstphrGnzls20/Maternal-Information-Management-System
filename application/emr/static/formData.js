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
  let specVal = [];
  let specVal2 = [];
  let specVal3 = {};

  // specval3 = {specVal[0] : specVal2[0]}

  dataArray.forEach((data) => {
    // if key is duplicate
    let temp = [];
    // if value is numeric
    if (isNaN(data.value)) {
      data.value = data.value.replace(/[^a-zA-Z0-9 ']/g, "");
      data.value = data.value.trim();
    }
    if (cleanedData[data.name]) {
      // []
      // if(typeof cleanedData[data.name] === "object"){
      //   console.
      // }
      // on first iteration where the key has single value of type string
      // if (
      //   typeof cleanedData[data.name] === "string" &&
      //   data.name === "allergyName"
      // ) {
      //   specVal.push(cleanedData[data.name]);
      //   specVal.push(data.value);
      // } else if (
      //   typeof cleanedData[data.name] != "string" &&
      //   data.name === "allergyName"
      // ) {
      //   specVal.push(cleanedData[data.name]);
      //   specVal.push(data.value);
      // } else if (
      //   typeof cleanedData[data.name] == "string" &&
      //   data.name === "allergyReaction"
      // ) {
      //   specVal2.push(cleanedData[data.name]);
      //   specVal2.push(data.value);
      // } else if (
      //   typeof cleanedData[data.name] != "string" &&
      //   data.name === "allergyReaction"
      // ) {
      //   specVal2.push(cleanedData[data.name]);
      //   specVal2.push(data.value);
      // }

      if (typeof cleanedData[data.name] === "string") {
        temp.push(cleanedData[data.name]);
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

  // console.log(specVal3);
  console.log(cleanedData);
  return cleanedData;
}

/* 
  type: "with objects",
  nestedObjects: [allergyName, allergyReaction]

  transaction: 
  1. appointment -> storing appointment, SMS-notification, accept/reject, 
  2. check-up -> doctor dashboard(appointment)
  3. follow-up
*/

/* 
2022-11-13: {
  category: {
    sub-category: {
      sub-sub-category: {

      }
    }
  }
}

example: 
2022-11-13: {
  ROS: {
    eyes: {
      noseBleeds: no,
      thyroidMass: no,
    }
  }
}
*/
