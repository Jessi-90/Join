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