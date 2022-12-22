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
    // if key is duplicate
    let temp = [];
    // if value is numeric
    if (isNaN(data.value)) {
      data.value = data.value.replace(/[^a-zA-Z0-9 '-/]/g, "");
      data.value = data.value.trim();
    }
    if (cleanedData[data.name]) {
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

    cleanedData[data.name] = data.value;
  });

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
