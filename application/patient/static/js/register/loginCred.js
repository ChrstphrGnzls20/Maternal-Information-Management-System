let loginCredentials = {};
// let authPath = "http://127.0.0.1:5000/auth";

function validateEmailAndGenerateOTP(email, password) {
  $.ajax({
    type: "GET",
    url: `${API_BASE_URL}/auth/patient/check-email/${email}`,
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
  })
    .done(function () {
      loginCredentials["email"] = email;
      loginCredentials["password"] = password;

      // GO TO NEXT STEP
      loginCredFormEl.bsHide();
      otpFormEl.bsShow();
    })
    .catch(function (xhr) {
      let errorMsg = xhr.responseJSON.errorMsg;

      let formTitle = $(".register-form > .login-cred-form .step-title");
      let error = errorAlert(errorMsg);

      //INSERT ERROR MESSAGE
      $(error).insertAfter(formTitle);
    });
}

// EXECUTE WHEN NEXT-BTN IN LOGIN CREDENTIAL STEP IS CLICKED
$("#login-cred-next-btn").on("click", function (evt) {
  evt.preventDefault();
  let email = $("#email").val();
  let password = $("#pwd").val();

  if (registerForm.valid()) {
    validateEmailAndGenerateOTP(email, password);
  }
});

let validateOTP = function (OTP) {
  $.ajax({
    method: "GET",
    url: `${API_BASE_URL}/auth/otp/${OTP}/verify`,
    dataType: "json",
    contentType: "application/json",
    beforeSend: function () {
      $(".loader-ctr").bsShow("d-none");
    },
    complete: function () {
      $(".loader-ctr").bsHide("d-none");
    },
  })
    .done(function () {
      // GO TO NEXT STEP
      otpFormEl.bsHide();
      basicFormEl.bsShow();
    })
    .catch(function (xhr) {
      let errorMsg = xhr.responseJSON.errorMsg;

      let formTitle = $(".register-form > .otp-form .step-title");
      let error = errorAlert(errorMsg);

      //INSERT ERROR MESSAGE
      $(error).insertAfter(formTitle);
    });
};

// TO REMOVE ERRORS (IF ANY) ONCE OTP HAS BEEN CHANGED
$(".otp-form #otp").keyup(function () {
  let formTitle = $(".register-form > .otp-form .step-title");
  formTitle.siblings(".error-msg-ctr").remove();
});

// EXECUTE WHEN NEXT-BTN IN OTP STEP IS CLICKED
$("#otp-next-btn").on("click", function (evt) {
  evt.preventDefault();

  let typedOTP = $("#otp").val();

  validateOTP(typedOTP);
});

// EXECUTE WHEN PREV-BTN IN OTP STEP IS CLICKED
$("#otp-prev-btn").on("click", function (evt) {
  evt.preventDefault();

  // GO TO PREV STEP
  otpFormEl.bsHide();
  loginCredFormEl.bsShow();
});
