let basicInformation = {};
let address = {};

// FUNCTION FOR ENABLING RELATIONSHIP-SELECT IN PM-HISTORY STEP
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

// EXECUTE WHEN NEXT-BTN IN BASIC-INFO STEP IS CLICKED
$("#basic-next-btn").on("click", function (evt) {
  evt.preventDefault();

  if (registerForm.valid()) {
    $(
      ".register-form > .basic-form input, .register-form > .basic-form select"
    ).each(function () {
      let name = $(this).attr("name");
      let value = $(this).val().trim();

      // SPECIAL CASE FOR ENCAPSULATING ADDRESS-RELATED FIELDS INTO ONE OBJECT
      if (
        ["regions", "provinces", "cities", "barangays", "street"].includes(name)
      ) {
        address[name] = value;
        return;
      }

      basicInformation[name] = value;
    });

    // APPEND THE ENCAPSULATING ADDRESS-RELATED FIELDS TO THE FINAL OBJECT
    basicInformation["address"] = address;
    console.log(basicInformation);

    // UPDATE SUMMARY OF BASIC INFORMATION
    summaryClass.updateBasic();

    //GO TO NEXT STEP
    basicFormEl.bsHide();
    pmHistFormEl.bsShow();
  }
});

// EXECUTE WHEN PREV-BTN IN BASIC-INFO STEP IS CLICKED
$("#basic-prev-btn").on("click", function (evt) {
  evt.preventDefault();

  //GO TO PREV STEP
  basicFormEl.bsHide();
  otpFormEl.bsShow();
});
