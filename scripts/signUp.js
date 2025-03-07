function validateEmail(email) {
    const allowedCharacters = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return allowedCharacters.test(email);
}

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

    checkConfirmPasswordLength(isPasswordMatch, confirmPasswordInput, passwordMismatchWarning);
    checkFormFields(isNameFilled, isEmailValid, isPasswordFilled, isConfirmPasswordFilled, isPasswordMatch, isPrivacyChecked);
}

function setupValidation() {
    document.getElementById("signUpName").oninput = validateSignUpForm;
    document.getElementById("signUpEmail").oninput = validateSignUpForm;
    document.getElementById("signUpPassword").oninput = validateSignUpForm;
    document.getElementById("signUpConfirmPassword").oninput = validateSignUpForm;
    document.getElementById("signUpPpCheckbox").onchange = validateSignUpForm;
}

function enableSignUpBtn() {
    let signUpBtn = document.getElementById("signUpBtn");
    signUpBtn.disabled = false;
}

function disableSignUpBtn() {
    let signUpBtn = document.getElementById("signUpBtn");
    signUpBtn.disabled = true;
}

function checkConfirmPasswordlength(isPasswordMatch, confirmPasswordInput, passwordMismatchWarning) {
    if (confirmPasswordInput.value.length > 0) {
        confirmPasswordInput.classList.toggle("input-mismatch", !isPasswordMatch);
        passwordMismatchWarning.classList.toggle("d-none", isPasswordMatch);
    } else {
        passwordMismatchWarning.classList.add("d-none");
    }
}

function handleSignUpSubmit(event) {
    event.preventDefault();
    let overlay = document.getElementById("overlaySignUp");
    overlay.classList.remove("d-none");
    let overlayContainer = document.querySelector('.sign-up-overlay-box');
    overlayContainer.classList.add('show');
    
    setTimeout(() => {
        window.location.href = "../index.html";
    }, 800);
}

function checkFormFields(isNameFilled, isEmailValid, isPasswordFilled, isConfirmPasswordFilled, isPasswordMatch, isPrivacyChecked) {
    if (isNameFilled && isEmailValid && isPasswordFilled && isConfirmPasswordFilled && isPasswordMatch && isPrivacyChecked) {
        enableSignUpBtn();
    } else {
        disableSignUpBtn();
    }
}

setupValidation();
