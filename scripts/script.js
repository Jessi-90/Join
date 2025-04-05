/**
 * Handles the focus and blur events of the password input field.
 * - When the field is focused, it changes the icon to "eye closed".
 * - When the field loses focus, it toggles the cursor style.
 * 
 * @param {Event} event - The focus or blur event.
 */
function toggleInputIcon(event) {
  let inputPasswdIcon = document.getElementById('input-password-icon');

  if (event.type === 'focus') {
    inputPasswdIcon.src = "../assets/icons/visibility_off_icon.svg";
    togglePointerToIcon();
  } else if (event.type === 'blur') {
    togglePointerToIcon();
  }
}

/**
 * Toggles the cursor style of the password visibility icon.
 * - If the cursor is set to "pointer" (clickable), it switches to "default".
 * - Otherwise, it sets it to "pointer".
 */
function togglePointerToIcon() {
  let inputPasswdIcon = document.getElementById('input-password-icon');

  if (inputPasswdIcon.style.cursor === "pointer") {
    inputPasswdIcon.style.cursor = "default";
  } else {
    inputPasswdIcon.style.cursor = "pointer";
  }
}

/**
 * Toggles the visibility of the password field.
 * - Switches the input type between "password" (hidden) and "text" (visible).
 * - Keeps the cursor at the end of the entered text when toggling visibility.
 * - Ensures a smooth user experience by maintaining focus on the input field.
 */
function togglePasswordVisibility() {
  let inputPasswd = document.getElementById('input-password');

  let cursorPosition = inputPasswd.value.length;

  if (inputPasswd.type === "password") {
    inputPasswd.type = "text";
  } else {
    inputPasswd.type = "password";
  }
  inputPasswd.focus();
  inputPasswd.setSelectionRange(cursorPosition, cursorPosition);
}

/**
 * Updates the password visibility icon based on the input type.
 * - If the password is visible, it shows the "eye open" icon.
 * - If the password is hidden, it shows the "eye closed" icon.
 * 
 * @param {HTMLInputElement} inputPasswd - The password input field.
 */
function togglePasswordIcon(inputPasswd) {
  let inputPasswdIcon = document.getElementById('input-password-icon');

  if (inputPasswd.type === "password") {
    inputPasswdIcon.src = "../assets/icons/visibility_off_icon.svg";
  } else {
    inputPasswdIcon.src = "../assets/icons/visibility_icon.svg";
  }
}

/**
 * Resets the password visibility icon to the default lock icon.
 * - This is used when the password field is empty.
 */
function resetInputIcon() {
  let inputPasswdIcon = document.getElementById('input-password-icon');

  inputPasswdIcon.src = "../assets/icons/lock_icon.svg";
}

/**
 * Prevents event bubbling when clicking on the password visibility icon.
 * - Stops the event from propagating to parent elements.
 * 
 * @param {Event} event - The event to stop propagation.
 */
function protectionEventBubbeling(event) {
  event.stopPropagation();
}

/**
 * Handles the user input in the password field.
 * - If the user types something, the icon changes to the "eye closed" icon.
 * - If the field is empty, the icon resets to the default lock icon.
 * - Ensures that the cursor indicates when the icon is clickable.
 */
document.addEventListener("DOMContentLoaded", function () {
  let inputPasswd = document.getElementById("input-password");
  let inputPasswdIcon = document.getElementById("input-password-icon");
  let isPasswordVisible = false;

  inputPasswd.addEventListener("input", function () {
    if (inputPasswd.value.length > 0) {
      if (!isPasswordVisible) {
        inputPasswdIcon.src = "./assets/icons/visibility_off_icon.svg";
      }
      inputPasswdIcon.style.cursor = "pointer";
    } else {
      resetInputIcon();
    }
  });

  /**
 * Toggles the visibility of the password field when the eye icon is clicked.
 * - Prevents event bubbling to avoid unintended side effects.
 * - Does nothing if the password field is empty.
 * - Switches between text and password input types.
 * - Updates the icon accordingly (open or closed eye).
 * 
 * @param {Event} event - The click event on the password visibility icon.
 */
  inputPasswdIcon.addEventListener("click", function (event) {
    event.stopPropagation();

    if (inputPasswd.value.length === 0) return;

    isPasswordVisible = !isPasswordVisible;

    if (isPasswordVisible) {
      inputPasswd.type = "text";
      inputPasswdIcon.src = "./assets/icons/visibility_icon.svg";
    } else {
      inputPasswd.type = "password"
      inputPasswdIcon.src = "./assets/icons/visibility_off_icon.svg";
    }
  });

  /**
  * Resets the password icon to the lock symbol 
  * when the input field is empty.
  */
  function resetInputIcon() {
    inputPasswdIcon.src = "./assets/icons/lock_icon.svg";
    inputPasswdIcon.style.cursor = "default";
    isPasswordVisible = false;
  }
});

/**
 * Validates the log-in form fields and updates UI accordingly.
 */
function validateLogInForm() {
  let emailInput = document.getElementById("input-mail");
  let passwordInput = document.getElementById("input-password");

  let isEmailValid = validateEmail(emailInput.value);
  let isPasswordFilled = passwordInput.value.trim() !== "";

  checkEmailValidity(isEmailValid, emailInput);
  checkLogInFormFields(isEmailValid, isPasswordFilled);
}

/**
 * Checks if all required login form fields are valid and enables/disables the log-in button accordingly.
 *
 * @param {boolean} isEmailValid - Whether the email is valid.
 * @param {boolean} isPasswordFilled - Whether the password field is filled.
 */
function checkLogInFormFields(isEmailValid, isPasswordFilled) {
  if (isEmailValid && isPasswordFilled) {
    enableBtn("logInBtn");
  } else {
    disableBtn("logInBtn");
  }
}

/**
 * Sets up input event listeners for form validation.
 */
function LogInValidation() {
  document.getElementById("input-mail").oninput = validateLogInForm;
  document.getElementById("input-password").oninput = validateLogInForm;
}

document.addEventListener("DOMContentLoaded", function () {
  LogInValidation();
});

/**
 * Login function that validates user credentials against contacts
 * and redirects to summary page on success.
 * @param {Event} event - The form submit event.
 */
async function login(event) {
  event.preventDefault();
  await mapContactsData();

  let emailInput = document.getElementById('input-mail').value.trim();
  let passwordInput = document.getElementById('input-password').value;
  let matchedContact = currentContactsData.find(contact => contact.email === emailInput);
  
  if (matchedContact && String(matchedContact.password) === String(passwordInput)) {
      storeUserAndForwardToSummary(matchedContact);
  } else {
      showUserFeedbackForFailedLoginAttempt();
  }
}

/**
 * Stores user information in sessionStorage and redirects to the summary page.
 * @param {Object} user - The user object containing user details.
 */
function storeUserAndForwardToSummary(user) {
  localStorage.setItem("userType", "loggedIn");
  localStorage.setItem("loggedInUserEmail", user.email);
  sessionStorage.setItem('currentUser', JSON.stringify({
      email: user.email,
      name: user.name,
      color: user.color,
      initials: user.initials,
      phone: user.phone
  }));
  window.location.href = './html/summary.html';
}

/**
 * Shows user feedback for a failed login attempt by highlighting the input fields
 * and displaying an error message below the password input field.
 */
function showUserFeedbackForFailedLoginAttempt() {
    document.getElementById('input-mail').classList.add('input-mismatch');
    document.getElementById('input-password').classList.add('input-mismatch');
    
    let passwordInputElement = document.getElementById('input-password');
    passwordInputElement.insertAdjacentHTML('afterend', failedLoginTemplate());
}

/**
 * Sets up event listeners for the login form and login button
 * after the DOM content is fully loaded.
 */
document.addEventListener('DOMContentLoaded', function() {
  /**
   * Adds a submit event listener to the login form.
   * @type {HTMLFormElement}
   */
  let loginForm = document.querySelector('.log-in-form');
  if (loginForm) {
      loginForm.addEventListener('submit', login);
  }

  /**
   * Adds a click event listener to the login button.
   * @type {HTMLButtonElement}
   */
  let loginBtn = document.getElementById('logInBtn');
  if (loginBtn) {
      loginBtn.addEventListener('click', login);
  }
});

/**
 * Checks if a user or guest is logged in.
 * If not, redirects the user to the login page.
 */
function checkIfUserIsLoggedIn() {
  const userType = localStorage.getItem("userType");
  const isOnLoginPage = window.location.pathname.includes("index.html") || window.location.pathname === "/" || window.location.pathname.endsWith("/");

  if (userType !== "loggedIn" && userType !== "guest" && !isOnLoginPage) {
    window.location.href = "./index.html";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  checkIfUserIsLoggedIn();
});
