//TODO: validate email first to avoid record duplication
//TODO: implement OTP

// alert HTML
alert = function (alertText) {
  return `
  <div class="alert alert-danger d-flex justify-content-center align-items-center error-msg-ctr" role="alert">
    <span>
        <i class="bi bi-exclamation-circle-fill fs-2 me-2"></i>
    </span>
    <p class="error-msg fs-5 mb-0">${alertText}</p>
  </div>
`;
};

//register forms
let registerForm = $(".register-form");
let loginCredFormEl = $(".register-form > .login-cred-form");
let otpFormEl = $(".register-form > .otp-form");
let basicFormEl = $(".register-form > .basic-form");
let pmHistFormEl = $(".register-form > .pm-hist-form");
let slHistFormEl = $(".register-form > .sl-hist-form");
let contactRefFormEl = $(".register-form > .contact-ref-form");

//summary forms
let summaryFormEl = $(".summary");

//class with functions for updating summary page
let summaryClass = {
  // disable all inputs in summary page
  disableAllInput: function () {
    $(".summary input:not([type*='submit']), .summary select").each(
      function () {
        $(this).prop("disabled", true);
      }
    );
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

  // update 'basic information' section
  updateBasic: function () {
    $(".summary .basic-form input, .summary .basic-form select").each(function (
      index
    ) {
      let currentInput = $(this);
      let key = $(this).attr("name").replace("summary-", "");
      let value = Object.values(basicObj)[index];
      let addressTypes = ["regions", "provinces", "cities", "barangays"];
      let addKeys = [
        { regions: "regDesc" },
        { provinces: "provDesc" },
        {
          cities: "citymunDesc",
        },
        { barangays: "brgyDesc" },
      ];
      // if the input is for address info
      if (addressTypes.includes(key)) {
        console.log(addKeys[index - 8][key]);
        let addKeyName = addKeys[index - 8][key];
        summaryClass.getAddressFromPSGCCode(key, value, addKeyName, $(this));
      } else {
        currentInput.val(Object.values(basicObj)[index]);
      }
    });
  },

  // update 'Past Medical History' section
  updatePMHist: function () {
    let selectedDisease = Object.values(pmHistArr).map((item) => {
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
    let slHistValues = Object.values(slHistArr).map((item) => {
      return item;
    });

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
    let contactRefValues = Object.entries(contactRefObj).map((item) => {
      return item;
    });

    for (let item of contactRefValues) {
      let key = item[0];
      let value = item[1];

      $(`.summary .contact-ref-form input#summary-${key}`).val(value);
    }
  },
};

//TODO: remove this after testing
// populate basic info form for testing
$(function () {
  registerDataDummy = [
    {
      loginCred: [
        { email: "christophereksdi@gmail.com" },
        { pwd: "123123" },
        { pwd2: "123123" },
      ],
    },
    {
      basic: [
        { fName: "Christopher" },
        { mName: "Berador" },
        { lName: "Gonzales" },
        { bday: "03/23/2001" },
        { age: "21" },
        { bloodType: "O+" },
        { mobile: "09618241439" },
        { email: "cgonzalesmain@gmail.com" },
        { regions: "13" },
        { provinces: "1374" },
        { cities: "137404" },
        { barangays: "137404040" },
        { street: "Block 19 Lot 8" },
      ],
    },
    {
      contactRef: [
        { crFname: "Christopher" },
        { crLname: "Gonzales" },
        { crMobile: "09618241439" },
        { crEmail: "cgonzalesmain@gmail.com" },
      ],
    },
  ];

  // populate inputs with dummy values
  $(".register-form > .login-cred-form input").each(function (index) {
    let currentInput = $(this);
    let key = $(this).attr("name");
    // $currentInput.prop("disabled", true);

    // currentInput.val(registerDataDummy[0]["loginCred"][index][key]);
  });

  $(
    ".register-form > .basic-form input, .register-form > .basic-form select"
  ).each(function (index) {
    let currentInput = $(this);
    let key = $(this).attr("name");
    // $currentInput.prop("disabled", true);

    currentInput.val(registerDataDummy[1]["basic"][index][key]);
  });

  $(".register-form > .contact-ref-form input").each(function (index) {
    let currentInput = $(this);
    let key = $(this).attr("name");

    // currentInput.val(registerDataDummy[2]["contactRef"][index][key]);
  });
});

//force uppercase in all inputs with type text (except email and password) register form
$(function () {
  $("input[type*='text']").on("input", function () {
    $(this).val($(this).val().toUpperCase());
  });
});

// custom phone validation for philippine number (starting with '09')
$.validator.addMethod(
  "PHNumber",
  function (value, element) {
    const regEx = new RegExp("^(09|\\+639)\\d{9}$");
    return this.optional(element) || regEx.test(value);
  },
  "Please enter a valid phone number"
);

// implement validator
registerForm.validate({
  normalizer: function (value) {
    return $.trim(value);
  },
  rules: {
    pwd: {
      minlength: 6,
    },
    pwd2: {
      required: true,
      minlength: 6,
      equalTo: "#pwd",
    },
    otp: {
      digits: true,
      minlength: 6,
      maxlength: 6,
    },
    mobile: {
      digits: true,
      minlength: 11,
      maxlength: 11,
      required: true,
      PHNumber: true,
    },
    crMobile: {
      digits: true,
      minlength: 11,
      maxlength: 11,
      required: true,
      PHNumber: true,
    },
  },
  messages: {
    pwd2: {
      equalTo: "Password does not match!",
    },
    mobile: {
      minlength: "Please enter at least 11 digits",
      PHNumber: "Please enter a valid contact number",
    },
    crMbile: {
      minlength: "Please enter at least 11 digits",
      PHNumber: "Please enter a valid contact number",
    },
  },
});

//global vars
let registerData = [];

// global functions
let validateEmailAndGenerateOTP = function (data, onSuccess, onFailure) {
  $.ajax({
    type: "POST",
    url: "/register/check-email",
    data: JSON.stringify(data),
    dataType: "json",
    contentType: "application/json",
    // loader
    beforeSend: function () {
      $(".loader-ctr").bsShow("d-none");
    },
    complete: function () {
      $(".loader-ctr").bsHide("d-none");
    },
    // if the email does not exists
    success: onSuccess,
    error: onFailure,
  });
};

let validateOTP = function (OTP, onSuccess, onFailure) {
  $.ajax({
    method: "POST",
    url: "/register/verify_otp",
    data: JSON.stringify({ OTP: OTP }),
    dataType: "json",
    contentType: "application/json",
    beforeSend: function () {
      $(".loader-ctr").bsShow("d-none");
    },
    complete: function () {
      $(".loader-ctr").bsHide("d-none");
    },
    // if success
    success: onSuccess,
    onFailure: onFailure,
  });
};

// this is where login credential information will be stored
let loginCredArr = [];
// login-credential form

// to remove errors (if any) once email has been changed
$(".login-cred-form #email").keyup(function () {
  let formTitle = $(".register-form > .login-cred-form .step-title");
  formTitle.siblings(".error-msg-ctr").remove();
});

// OTP
let OTP = 0;

$("#login-cred-next-btn").on("click", function (e) {
  e.preventDefault();

  let loginCredObj = {};

  if (registerForm.valid()) {
    // construct object for basic information
    $(".login-cred-form input").each(function () {
      let name = $(this).attr("name");
      let value = $(this).val().trim();
      // loginCredObj["name"] = name;
      // loginCredObj["value"] = value;
      if (name === "pwd2") {
        return;
      }

      loginCredObj[name] = value;

      if (name === "email") {
        //TODO: make a post request if the username exists
        let onSuccess = function (data) {
          console.log(data);
          if (data.code === "SUCCESS") {
            loginCredArr.push(loginCredObj);
            loginCredObj = {};

            //NOTE: if successful, the OTP is generated in the backend

            //go to next step
            loginCredFormEl.bsHide();
            otpFormEl.bsShow();
          } else {
            let formTitle = $(".register-form > .login-cred-form .step-title");
            formTitle.siblings(".error-msg-ctr").remove();
            $(alert(data.errorMsg)).insertAfter(formTitle);
          }
        };

        let onFailure = function (xhr) {
          console.log(xhr);
        };

        // call function to validate email and generate OTP
        validateEmailAndGenerateOTP(
          loginCredObj,
          (onSuccess = onSuccess),
          (onFailure = onFailure)
        );
      }

      loginCredArr.push(loginCredObj);
      loginCredObj = {};
    });
  }
});

// to remove errors (if any) once OTP has been changed
$(".otp-form #otp").keyup(function () {
  let formTitle = $(".register-form > .otp-form .step-title");
  formTitle.siblings(".error-msg-ctr").remove();
});

//otp form
$("#otp-prev-btn").on("click", function (e) {
  e.preventDefault();

  //clear loginCredArr before going back
  loginCredArr = [];

  //go to prev step
  otpFormEl.bsHide();
  loginCredFormEl.bsShow();
});

$("#otp-next-btn").on("click", function (e) {
  e.preventDefault();

  let typedOTP = $("#otp").val();

  if (registerForm.valid()) {
    let onSuccess = function (data) {
      if (data.code === "SUCCESS") {
        otpFormEl.bsHide();
        basicFormEl.bsShow();
      } else {
        // $(".otp-form .error-msg-ctr").removeClass("d-none");
        // $(".otp-form .error-msg-ctr").addClass("d-flex");
        // $(".otp-form .error-msg").text(data.errorMsg);

        let formTitle = $(".register-form > .otp-form .step-title");
        formTitle.siblings(".error-msg-ctr").remove();
        $(alert(data.errorMsg)).insertAfter(formTitle);
      }
      //go to next step
    };

    let onFailure = function (xhr) {
      console.log(xhr);
    };

    //TODO: validate OTP
    validateOTP(typedOTP, (onSuccess = onSuccess), (onFailure = onFailure));
  }
});

// for birthday required mechanism
$("#birthday-datepicker").on("changeDate", function () {
  $(".bday-error").remove();
  $("#bday").removeClass("error");
  $("#bday").attr("aria-invalid", false);
});

// for email mechanism
$("#email").on("change", function () {
  let value = $(this).val().trim();

  $("#email-address").val(value);
});

// this is where the basic info will be stored
let basicArr = [];
let basicObj = {};
//basic-info form
$("#basic-prev-btn").on("click", function (e) {
  e.preventDefault();

  //go to prev step
  basicFormEl.bsHide();
  otpFormEl.bsShow();
});

$("#basic-next-btn").on("click", function (e) {
  e.preventDefault();

  if (registerForm.valid()) {
    $(
      ".register-form > .basic-form input, .register-form > .basic-form select"
    ).each(function () {
      let name = $(this).attr("name");
      let value = $(this).val().trim();

      basicObj[name] = value;
    });

    console.log(basicObj);

    summaryClass.updateBasic();

    //go to next step
    basicFormEl.bsHide();
    pmHistFormEl.bsShow();
  }
});

// for enabling relationship select
$(".register-form > .pm-hist-form input[type*='radio']").on(
  "change",
  function () {
    if ($(this).val() === "family") {
      $(this).parent().siblings("select").prop("disabled", false);
      return;
    }

    $(this).parent().siblings("select").prop("disabled", true);
  }
);

//this is where past medical history info will be stored
let pmHistArr = [];
//pm-hist form
$("#pm-prev-btn").on("click", function (e) {
  e.preventDefault();

  //clear basicArr before going back
  basicArr.length = 0;

  //go to prev step

  pmHistFormEl.bsHide();
  basicFormEl.bsShow();
});

$("#pm-next-btn").on("click", function (e) {
  e.preventDefault();

  let pmHistObj = {};
  if (registerForm.valid()) {
    // get values of radio
    $(".register-form > .pm-hist-form input[type='radio']:checked").each(
      function () {
        if ($(this).val().trim()) {
          let name = $(this).attr("name");
          let value = $(this).val().trim();
          let rs = $(this).parent().siblings("select").val();

          pmHistObj[name] = value;

          if (value !== "self") {
            pmHistObj["relationship"] = rs;
          }
          pmHistArr.push(pmHistObj);
          pmHistObj = {};
        }
      }
    );

    let other = $(".pm-hist-form input[name*='other']");

    if (other.val().trim()) {
      let name = other.attr("name");
      let value = other.val().trim();

      pmHistObj[name] = value;

      pmHistArr.push(pmHistObj);
    }
  }
  //update past medical history summary
  summaryClass.updatePMHist();
  //go to next step
  pmHistFormEl.bsHide();
  slHistFormEl.bsShow();
});

// for enabling tabacco select
$('.register-form > .sl-hist-form input[name*="tabacco"]').on(
  "change",
  function () {
    let selectSibling = $('.sl-hist-form select[name*="tabacco"]');

    if ($(this).val() === "current") {
      selectSibling.prop("disabled", false);
      return;
    }
    selectSibling.prop("disabled", true);
  }
);

// for enabling alcohol select
$('.register-form > .sl-hist-form input[name*="alcohol"]').on(
  "change",
  function () {
    let selectSibling = $('.sl-hist-form select[name*="alcohol"]');
    if ($(this).val() === "yes") {
      selectSibling.prop("disabled", false);
      return;
    }
    selectSibling.prop("disabled", true);
  }
);

// for enabling domesticAbuse select
$('.register-form > .sl-hist-form input[name*="domesticAbuse"]').on(
  "change",
  function () {
    let selectSibling = $('.sl-hist-form select[name*="domesticAbuse"]');
    if ($(this).val() === "yes") {
      selectSibling.prop("disabled", false);
      return;
    }
    selectSibling.prop("disabled", true);
  }
);

// this is where the social lifestyle info will be stored
let slHistArr = [];
//sl-hist form
$("#sl-prev-btn").on("click", function (e) {
  e.preventDefault();

  //clear pmHist before going back
  pmHistArr.length = 0;

  //go to prev step
  slHistFormEl.bsHide();
  pmHistFormEl.bsShow();
});

$("#sl-next-btn").on("click", function (e) {
  e.preventDefault();
  let slHistObj = {};

  if (registerForm.valid()) {
    // get values of input, select(marital status)
    $(
      ".register-form > .sl-hist-form input:not([type*='radio']), .register-form > .sl-hist-form select[name*='maritalStatus']"
    ).each(function () {
      let name = $(this).attr("name");
      let value = $(this).val().trim();
      slHistObj[name] = value;

      slHistArr.push(slHistObj);
      slHistObj = {};
    });

    //get values of radio and their select if any
    $(".register-form > .sl-hist-form input[type*='radio']:checked").each(
      function () {
        let key = $(this).attr("name");
        let value = $(this).val();
        let rs = $(`.sl-hist-form select[name*=${key}]`).val();

        slHistObj[key] = value;

        if ((value === "yes" || value === "current") && Boolean(rs)) {
          slHistObj["classification"] = rs;
        }
        slHistArr.push(slHistObj);
        slHistObj = {};
      }
    );

    // registerData.push({ slHist: { ...slHistArr } });
    summaryClass.updateSLHist();

    //go to next step
    slHistFormEl.bsHide();
    contactRefFormEl.bsShow();
  }
});

// this is where contact ref info will be stored
let contactRefObj = {};
//contact-ref form
$("#cr-prev-btn").on("click", function (e) {
  e.preventDefault();

  //clear slHistArr before going back
  slHistArr.length = 0;

  //go to prev step
  contactRefFormEl.bsHide();
  slHistFormEl.bsShow();
});

$("#cr-next-btn").on("click", function (e) {
  e.preventDefault();

  if (registerForm.valid()) {
    $(".contact-ref-form input:not([type*='submit'])").each(function () {
      if ($(this).val().trim()) {
        let name = $(this).attr("name");
        let value = $(this).val().trim();

        contactRefObj[name] = value;
      }
    });
  }
  // update contact ref summary
  summaryClass.updateContactRef();

  //go to next form
  contactRefFormEl.toggleClass("d-none");

  // display summary
  summaryFormEl.bsShow();
});

$("#summary-prev-btn").on("click", function (e) {
  e.preventDefault();

  //go to previous step
  contactRefFormEl.bsShow();
  summaryFormEl.bsHide();
});

registerForm.on("submit", function (e) {
  e.preventDefault();

  //remove unnecessary data
  delete basicObj["age"];
  delete basicObj["email"];

  // construct data to be sent to the backend
  registerData = [
    ...loginCredArr,
    { basicInfo: basicObj },
    { pastMedicalHist: [...pmHistArr] },
    { socialLifestyleHist: [...slHistArr] },
    { contactRef: contactRefObj },
  ];

  modifiedRegisterData = {};

  registerData.forEach((item) => {
    let key = Object.keys(item)[0];
    let value = Object.values(item)[0];
    modifiedRegisterData[key] = value;
  });

  // send to the data to the backend to be stored to db
  $.ajax({
    type: "POST",
    url: "/register/data",
    data: JSON.stringify(modifiedRegisterData),
    dataType: "json",
    contentType: "application/json",
    success: function (data) {
      if (data.code === "SUCCESS") {
        location.href = "/patient/register/success";
      }
    },
  });
});
