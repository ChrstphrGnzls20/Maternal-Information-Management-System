const API_BASE_URL = `https://${location.origin}/api`;
const ABSOLUTE_BASE_URL = `https://${location.origin}`;

print(API_BASE_URL, ABSOLUTE_BASE_URL);

// SPINNERS
const buttonWithSpinner = (className, innerText) => `
    <button class="${className}" type="button" disabled>
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        ${innerText}
    </button>
`;

function replaceButtonWithSpinner(buttonEl) {
  buttonEl.replaceWith(buttonWithSpinner(buttonEl.attr("class"), "Submitting"));
}

function revertToOriginalButton(originalBtn, newBtn) {
  originalBtn.replaceWith(newBtn);
}
