/**
 * Validates an email address.
 *
 * @param {string} email - The email address to validate.
 * @returns {boolean} True if the email is valid, otherwise false.
 */
function validateEmail(email) {
    const allowedCharacters = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return allowedCharacters.test(email);
}

/**
 * Validates the sign-up form fields and updates UI accordingly.
 */
function validateSignUpForm() {
    let nameInput = document.getElementById("signUpName");
    let emailInput = document.getElementById("signUpEmail");
    let passwordInput = document.getElementById("signUpPassword");
    let confirmPasswordInput = document.getElementById("signUpConfirmPassword");
    let passwordMismatchWarning = document.getElementById("signUpPasswordMismatch");
    let privacyCheckbox = document.getElementById("signUpPpCheckbox");

    let isNameFilled = nameInput.value.trim() !== "";
    let isEmailValid = validateEmail(emailInput.value);
    let isPasswordFilled = passwordInput.value.trim() !== "";
    let isConfirmPasswordFilled = confirmPasswordInput.value.trim() !== "";
    let isPasswordMatch = passwordInput.value === confirmPasswordInput.value;
    let isPrivacyChecked = privacyCheckbox.checked;

    checkEmailValidity(isEmailValid, emailInput);
    checkConfirmPasswordLength(isPasswordMatch, confirmPasswordInput, passwordMismatchWarning);
    checkFormFields(isNameFilled, isEmailValid, isPasswordFilled, isConfirmPasswordFilled, isPasswordMatch, isPrivacyChecked);
}

/**
 * Sets up input event listeners for form validation.
 */
function signUpValidation() {
    if (window.location.pathname.endsWith("signUp.html")) {
        document.getElementById("signUpName").oninput = validateSignUpForm;
        document.getElementById("signUpEmail").oninput = validateSignUpForm;
        document.getElementById("signUpPassword").oninput = validateSignUpForm;
        document.getElementById("signUpConfirmPassword").oninput = validateSignUpForm;
        document.getElementById("signUpPpCheckbox").onchange = validateSignUpForm;
    }
}

/**
 * Enables the specified button by its ID.
 * This function can be used to enable both the sign-up and log-in buttons.
 *
 * @param {string} btnId - The ID of the button to be enabled.
 */
function enableBtn(btnId) {
    let signUpBtn = document.getElementById(btnId);
    signUpBtn.disabled = false;
}

/**
 * Disables the specified button by its ID.
 * This function can be used to disable both the sign-up and log-in buttons.
 *
 * @param {string} btnId - The ID of the button to be disabled.
 */
function disableBtn(btnId) {
    let signUpBtn = document.getElementById(btnId);
    signUpBtn.disabled = true;
}

/**
 * Checks if the email input is valid and updates UI accordingly.
 *
 * @param {boolean} isEmailValid - Indicates if the email is valid.
 * @param {HTMLInputElement} emailInput - The email input field.
 */
function checkEmailValidity(isEmailValid, emailInput) {
    if (emailInput.value.length > 0) {
        emailInput.classList.toggle("input-mismatch", !isEmailValid);
    }
}

/**
 * Checks if the confirmed password matches and updates UI accordingly.
 *
 * @param {boolean} isPasswordMatch - Indicates if the passwords match.
 * @param {HTMLInputElement} confirmPasswordInput - The confirm password input field.
 * @param {HTMLElement} passwordMismatchWarning - The warning element for password mismatch.
 */
function checkConfirmPasswordLength(isPasswordMatch, confirmPasswordInput, passwordMismatchWarning) {
    if (confirmPasswordInput.value.length > 0) {
        confirmPasswordInput.classList.toggle("input-mismatch", !isPasswordMatch);
        passwordMismatchWarning.classList.toggle("d-none", isPasswordMatch);
    } else {
        passwordMismatchWarning.classList.add("d-none");
    }
}

/**
 * Displays the overlay after submitting the form, and redirects after a delay.
 * @param {Event} event - The form submit event.
 */
function showSignUpSubmitFeedback(event) {
    event.preventDefault();
    let overlay = document.getElementById("overlaySignUp");
    overlay.classList.remove("d-none");
    let overlayContainer = document.querySelector('.sign-up-overlay-box');
    overlayContainer.classList.add('show');
    setTimeout(() => {
        window.location.href = "../index.html";
    }, 800);
}

/**
 * Checks if all required form fields are valid and enables/disables the sign-up button accordingly.
 *
 * @param {boolean} isNameFilled - Whether the name field is filled.
 * @param {boolean} isEmailValid - Whether the email is valid.
 * @param {boolean} isPasswordFilled - Whether the password field is filled.
 * @param {boolean} isConfirmPasswordFilled - Whether the confirm password field is filled.
 * @param {boolean} isPasswordMatch - Whether passwords match.
 * @param {boolean} isPrivacyChecked - Whether the privacy policy checkbox is checked.
 */
function checkFormFields(isNameFilled, isEmailValid, isPasswordFilled, isConfirmPasswordFilled, isPasswordMatch, isPrivacyChecked) {
    if (isNameFilled && isEmailValid && isPasswordFilled && isConfirmPasswordFilled && isPasswordMatch && isPrivacyChecked) {
        enableBtn("signUpBtn");
    } else {
        disableBtn("signUpBtn");
    }
}

/**
 * Collects data from the sign-up form fields.
 * @returns {Object} The collected data.
 */
function collectSignUpData() {
    let signUpName = document.getElementById("signUpName").value.trim();
    return {
        name: signUpName,
        email: document.getElementById("signUpEmail").value.trim(),
        password: document.getElementById("signUpPassword").value.trim(),
        color: getRandomColor(),
        initials: getContactInitials(signUpName),
    };
}


/**
 * Validates all required inputs and marks invalid ones.
 * @returns {boolean} True if all inputs are valid
 */
function validateSignUpInputs() {
    const name = document.getElementById("signUpName");
    const email = document.getElementById("signUpEmail");
    const pwd = document.getElementById("signUpPassword");
    const confirmPwd = document.getElementById("signUpConfirmPassword");
    const checkbox = document.getElementById("signUpPpCheckbox");
    let isValid = true;
  
    [name, email, pwd, confirmPwd].forEach(input => {
      const empty = !input.value.trim();
      markInputMismatch(input, empty);
      if (empty) isValid = false;
    });
  
    const pwdMismatch = pwd.value !== confirmPwd.value;
    markInputMismatch(confirmPwd, pwdMismatch);
    if (pwdMismatch) isValid = false;
  
    const checkboxBox = checkbox.closest(".sign-up-form-checkbox-box");
    markInputMismatch(checkboxBox, !checkbox.checked);
    if (!checkbox.checked) isValid = false;
  
    return isValid;
}
  
/**
 * Adds or removes 'input-mismatch' class on given element.
 * @param {HTMLElement} el - The element to mark
 * @param {boolean} isError - Whether to add or remove the class
 */
function markInputMismatch(el, isError) {
if (!el) return;
el.classList.toggle("input-mismatch", isError);
}


/**
 * Attaches blur listeners to validate inputs as user interacts.
 */
function setupLiveValidation() {
    const inputs = [
      document.getElementById("signUpName"),
      document.getElementById("signUpEmail"),
      document.getElementById("signUpPassword"),
      document.getElementById("signUpConfirmPassword")
    ];
    inputs.forEach(input => {
      input.addEventListener("blur", () => {
        const isEmpty = !input.value.trim();
        const isConfirm = input.id === "signUpConfirmPassword";
        markInputMismatch(input, isConfirm ? input.value !== document.getElementById("signUpPassword").value : isEmpty);
      });
    });
  
    const checkbox = document.getElementById("signUpPpCheckbox");
    checkbox.addEventListener("change", () => {
      const box = checkbox.closest(".sign-up-form-checkbox-box");
      markInputMismatch(box, !checkbox.checked);
    });
  }


/**
 * Handles the sign-up form submission.
 * @param {Event} event - The form submit event.
 */
async function handleSignUpFormSubmission(event) {
    event.preventDefault();
    if (!validateSignUpInputs()) return;
    let signUpData = collectSignUpData();
    let contacts = await getContacts();
    await addNewContact(event, contacts, signUpData);
    showSignUpSubmitFeedback(event)
}


signUpValidation();
window.addEventListener("DOMContentLoaded", setupLiveValidation);
