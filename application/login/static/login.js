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

$(function () {
  let currentURL = window.location.href;
  let splitURL = currentURL.split("/");
  let currentEntity = splitURL[splitURL.length - 1];

  $loginForm = $(".login-form");

  $loginForm.validate({
    rules: {
      password: {
        required: true,
        minlength: 6,
      },
    },
    messages: {
      password: {
        minlength: "Password should contain atleast 6 characters!",
      },
    },
  });

  $loginForm.on("submit", function (e) {
    e.preventDefault();

    if ($loginForm.valid()) {
      let email = $("#email").val();
      let password = $("#password").val();
      let loginCred = {
        email: email,
        password: password,
      };

      $.ajax({
        type: "POST",
        url: `${API_BASE_URL}/auth/login/${currentEntity}`,
        data: JSON.stringify(loginCred),
        dataType: "json",
        contentType: "application/json",
        beforeSend: function () {
          $(".loader-ctr").toggleClass("d-none");
        },
        complete: function () {
          $(".loader-ctr").toggleClass("d-none");
        },
      })
        .done(function (response) {
          let data = response[0];
          console.log(response);
          let id = data._id;
          let email = data.email;

          // SAVE ID TO LOCALSTORAGE FOR FURTHER USE
          localStorage.setItem("entity", currentEntity);
          localStorage.setItem("id", id);
          localStorage.setItem("email", email);

          // REDIRECT TO HOMEPAGE
          location.href = `/${currentEntity}/`;
        })
        .catch(function () {
          let formTitle = $(".form-title");
          formTitle.siblings(".error-msg-ctr").remove();
          $(alert("Invalid login credentials!")).insertAfter(formTitle);
        });
    }
  });
});
