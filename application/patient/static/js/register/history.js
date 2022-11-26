// PAST MEDICAL HISTORY
let pastMedicalHistoryItem = {};
let pastMedicalHistory = [];

// EXECUTE WHEN NEXT-BTN IN PM-HISTORY STEP IS CLICKED
$("#pm-next-btn").on("click", function (evt) {
  evt.preventDefault();

  // GET ALL THE CHECKED RADIO BUTTON WITH VALUE EITHER SELF OR FAMILY
  $(".register-form > .pm-hist-form input[type='radio']:checked").each(
    function () {
      if ($(this).val().trim()) {
        let name = $(this).attr("name");
        let value = $(this).val().trim();
        let rs = $(this).parent().siblings("select").val();

        pastMedicalHistoryItem[name] = value;

        if (value !== "self") {
          pastMedicalHistoryItem["relationship"] = rs;
        }
        pastMedicalHistory.push(pastMedicalHistoryItem);
        pastMedicalHistoryItem = {};
      }
    }
  );
  let other = $(".pm-hist-form input[name='other']");

  if (other.val().trim()) {
    let name = other.attr("name");
    let value = other.val().trim();

    pastMedicalHistoryItem[name] = value;

    pastMedicalHistory.push(pastMedicalHistoryItem);
  }
  console.log(pastMedicalHistory);

  // UPDATE PM-HISTORY SUMMARY
  summaryClass.updatePMHist();

  // GO TO NEXT STEP
  pmHistFormEl.bsHide();
  slHistFormEl.bsShow();
});

// EXECUTE WHEN PREV-BTN IN PM-HISTORY STEP IS CLICKED
$("#pm-prev-btn").on("click", function (evt) {
  evt.preventDefault();

  // GO TO PREV STEP
  pmHistFormEl.bsHide();
  basicFormEl.bsShow();
});

// SOCIAL LIFESTYLE HISTORY
// FOR ENABLING TABACCO SELECT
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

// FOR ENABLING ALCOHOL SELECT
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

// FOR ENABLING DOMESTICABUSE SELECT
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

let socialLifestyleHistory = [];
// EXECUTE WHEN NEXT-BTN IN SL-HISTORY STEP IS CLICKED
$("#sl-next-btn").on("click", function (e) {
  e.preventDefault();
  let slHistObj = {};

  if (registerForm.valid()) {
    // GET VALUES OF INPUT, SELECT (MARITAL STATUS)
    let maritalStatus = $("select[name=maritalStatus]").val();
    let occupation = $("input[name=occupation]").val();

    socialLifestyleHistory["maritalStatus"] = maritalStatus;
    socialLifestyleHistory["occupation"] = occupation;

    //GET VALUES OF RADIO AND THEIR SELECT IF ANY
    $(".register-form > .sl-hist-form input[type*='radio']:checked").each(
      function () {
        let key = $(this).attr("name");
        let value = $(this).val();
        let rs = $(`.sl-hist-form select[name*=${key}]`).val();

        slHistObj[key] = value;

        if ((value === "yes" || value === "current") && Boolean(rs)) {
          slHistObj["classification"] = rs;
        }
        socialLifestyleHistory.push(slHistObj);
        slHistObj = {};
      }
    );

    console.log(socialLifestyleHistory);

    // registerData.push({ slHist: { ...slHistArr } });

    // UPDATE SL-HISTORY SUMMARY
    summaryClass.updateSLHist();

    // GO TO NEXT STEP
    slHistFormEl.bsHide();
    contactRefFormEl.bsShow();
  }
});

// EXECUTE WHEN PREV-BTN IN PM-HISTORY STEP IS CLICKED
$("#sl-prev-btn").on("click", function (e) {
  e.preventDefault();

  //clear pmHist before going back
  pastMedicalHistory.length = 0;

  // GO TO PREV STEP
  slHistFormEl.bsHide();
  pmHistFormEl.bsShow();
});
