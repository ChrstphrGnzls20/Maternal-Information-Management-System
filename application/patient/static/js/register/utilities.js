// create custom show and hide function
$.fn.bsShow = function () {
  $(this).removeClass("d-none");
};

$.fn.bsHide = function () {
  $(this).addClass("d-none");
};

let registerForm = $(".register-form");
let loginCredFormEl = $(".register-form > .login-cred-form");
let otpFormEl = $(".register-form > .otp-form");
let basicFormEl = $(".register-form > .basic-form");
let pmHistFormEl = $(".register-form > .pm-hist-form");
let slHistFormEl = $(".register-form > .sl-hist-form");
let contactRefFormEl = $(".register-form > .contact-ref-form");

//summary forms
let summaryFormEl = $(".summary");

// ADD VALIDATOR FOR PHILIPPINE MOBILE NUMBERS (FORMAT: 09123456789 - 11 DIGITS)
$.validator.addMethod(
  "PHNumber",
  function (value, element) {
    const regEx = new RegExp("^(09|\\+639)\\d{9}$");
    return this.optional(element) || regEx.test(value);
  },
  "Please enter a valid phone number"
);

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

// alert HTML
function errorAlert(alertText) {
  return `
    <div class="alert alert-danger d-flex justify-content-center align-items-center error-msg-ctr" role="alert">
      <span>
          <i class="bi bi-exclamation-circle-fill fs-2 me-2"></i>
      </span>
      <p class="error-msg fs-5 mb-0">${alertText}</p>
    </div>
  `;
}

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

  currentInput.val(registerDataDummy[0]["loginCred"][index][key]);
});

$(
  ".register-form > .basic-form input, .register-form > .basic-form select"
).each(function (index) {
  let currentInput = $(this);
  let key = $(this).attr("name");
  // $currentInput.prop("disabled", true);

  currentInput.val(registerDataDummy[1]["basic"][index][key]);
});

$("input[name=occupation]").val("STUDENT");

$(".register-form > .contact-ref-form input").each(function (index) {
  let currentInput = $(this);
  let key = $(this).attr("name");

  currentInput.val(registerDataDummy[2]["contactRef"][index][key]);
});
