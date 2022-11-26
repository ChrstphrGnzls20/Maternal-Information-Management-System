let contactReference = {};
// EXECUTE WHEN NEXT-BTN IN CONTACT-REF STEP IS CLICKED
$("#cr-next-btn").on("click", function (e) {
  e.preventDefault();

  if (registerForm.valid()) {
    $(".contact-ref-form input:not([type*='submit'])").each(function () {
      if ($(this).val().trim()) {
        let name = $(this).attr("name");
        let value = $(this).val().trim();

        contactReference[name] = value;
      }
    });
  }
  // UPDATE CONTACT-REF SUMMARY
  summaryClass.updateContactRef();

  console.log(contactReference);
  // GO TO SUMMARY
  contactRefFormEl.bsHide();
  summaryFormEl.bsShow();
});

// EXECUTE WHEN PREV-BTN IN CONTACT-REF STEP IS CLICKED
$("#cr-prev-btn").on("click", function (e) {
  e.preventDefault();

  //clear slHistArr before going back
  socialLifestyleHistory.length = 0;

  //go to prev step
  contactRefFormEl.bsHide();
  slHistFormEl.bsShow();
});

// EXECUTE WHEN THE CONFIRM-BTN ON SUMMARY IS CLICKED
registerForm.on("submit", function (evt) {
  evt.preventDefault();

  console.log("FORM SUBMITTED!");

  let registerData = {
    ...loginCredentials,
    patientHistory: {
      pastMedicalHistory: [...pastMedicalHistory],
      socialLifestyleHistory: [...socialLifestyleHistory],
    },
    contactReference: contactReference,
  };
  console.log(registerData);

  $.ajax({
    type: "POST",
    url: `${API_BASE_URL}/patients`,
    data: JSON.stringify(registerData),
    dataType: "json",
    contentType: "application/json",
  })
    .done(function () {
      location.href = "/patient/register/success";
    })
    .catch(function (xhr) {
      // let errMsg = xhr.responseJSON.errorMsg;

      console.log(xhr);
    });
});
