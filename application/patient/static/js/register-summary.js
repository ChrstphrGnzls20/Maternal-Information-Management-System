let summaryClass = {
  // disable all inputs in summary page
  disableAllInput: function () {
    $(".summary input:not([type='submit']), .summary select").each(function () {
      $(this).prop("disabled", true);
    });
  },

  // get actual value from PSGC code from address selects
  getAddressFromPSGCCode: function (type, value, addName, element) {
    // let searchURI = `${API_URI}/${locType}/${value}`;

    // let returnData = null;
    // // $.get(`${API_URI}/${locType}/${value}`, function (data) {
    // //   input.val(data.name);
    // // });
    // $.get(`${API_URI}/${locType}/${value}`, function (response) {
    //   input.val(response.name);
    // });
    const URL = "/address";
    let searchURL = `${URL}/${type}/${value}`;

    $.ajax({
      method: "GET",
      url: searchURL,
      // data: "json",
      // dataType: "text",
      success: function (response) {
        console.log(searchURL);
        let data = JSON.parse(response)[0];

        element.val(data[addName]);
      },
      error: function (xhr, responseData, status) {
        console.log(xhr);
        return false;
      },
    });
  },

  // UPDATE BASIC INFORMATION SUMMARY
  updateBasic: function () {
    $(".summary .basic-form input, .summary .basic-form select").each(function (
      index
    ) {
      let currentInput = $(this);
      let key = $(this).attr("name").replace("summary-", "");
      let value = basicInformation[key];

      //   let value = Object.values(basicInformation)[index];
      let addressTypes = [
        "regions",
        "provinces",
        "cities",
        "barangays",
        "street",
      ];
      let addKeys = [
        { regions: "regDesc" },
        { provinces: "provDesc" },
        {
          cities: "citymunDesc",
        },
        { barangays: "brgyDesc" },
        { street: "street" },
      ];

      // IF THE INPUT IS ADDRESS-RELATED
      if (addressTypes.includes(key)) {
        let addKeyName = addKeys[index - 8][key];
        value = basicInformation["address"][key];
        if (key === "street") {
          $(this).val(value);
          return;
        }
        summaryClass.getAddressFromPSGCCode(key, value, addKeyName, $(this));
      } else {
        currentInput.val(Object.values(basicInformation)[index]);
      }
    });
  },

  // UPDATE PAST MEDICAL HISTORY SUMMARY
  updatePMHist: function () {
    let selectedDisease = Object.values(pastMedicalHistory).map((item) => {
      return item;
    });

    for (let item of selectedDisease) {
      let diseaseName = Object.keys(item)[0];
      let value = Object.values(item)[0];
      let relationship = Object.values(item)[1] ? Object.values(item)[1] : null;

      if (diseaseName === "other") {
        $("#summary-other").val(value);
        return;
      }

      // set all radio checked
      $(`.summary > .pm-hist-form input#summary-${diseaseName}-${value}`).prop(
        "checked",
        true
      );

      if (relationship) {
        $(
          `.summary > .pm-hist-form select#summary-${diseaseName}-relationship`
        ).val(relationship);
      }
    }
  },

  // update 'Social and Lifestyle History' section
  updateSLHist: function () {
    this.disableAllInput();
    // $slHistValues = registerData[2]["slHist"];
    let slHistValues = Object.values(socialLifestyleHistory).map((item) => {
      return item;
    });

    $("#summary-maritalStatus").val(socialLifestyleHistory["maritalStatus"]);
    $("#summary-occupation").val(socialLifestyleHistory["occupation"]);

    for (let item of slHistValues) {
      let key = Object.keys(item)[0];
      let value = Object.values(item)[0];
      let classification = Object.values(item)[1]
        ? Object.values(item)[1]
        : null;

      // if maritalStatus
      if (key === "maritalStatus") {
        $(`.summary #summary-maritalStatus`).val(value);
        continue;
      }

      //if occupation
      if (key === "occupation") {
        $(`.summary #summary-occupation`).val(value);
        continue;
      }

      // set all radio checked
      $(`.summary > .sl-hist-form input#summary-${key}-${value}`).prop(
        "checked",
        true
      );

      if (classification) {
        $(`.summary > .sl-hist-form select#summary-${key}-select`).val(
          classification
        );
      } else {
        $(`.summary > .sl-hist-form select#summary-${key}-select`).val("");
      }
    }
  },

  // update 'Contact Reference' section
  updateContactRef: function () {
    let contactRefValues = Object.entries(contactReference).map((item) => {
      return item;
    });

    for (let item of contactRefValues) {
      let key = item[0];
      let value = item[1];

      $(`.summary .contact-ref-form input#summary-${key}`).val(value);
    }
  },
};
