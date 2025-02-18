function toggleInputIcon(event) {
  let inputPasswdIcon = document.getElementById('input-password-icon');

  if (event.type === 'focus') {
    inputPasswdIcon.src = "../assets/icons/visibility_off_icon.svg";
    togglePointerToIcon();
  } else if (event.type === 'blur') {
    togglePointerToIcon();
  }
}

function togglePointerToIcon() {
  let inputPasswdIcon = document.getElementById('input-password-icon');

  if (inputPasswdIcon.style.cursor === "pointer") {
    inputPasswdIcon.style.cursor = "default";
  } else {
    inputPasswdIcon.style.cursor = "pointer";
  }
}

function togglePasswordVisibility() {
  let inputPasswd = document.getElementById('input-password');
  inputPasswd.focus();

  if (inputPasswd.type === "password") {
    inputPasswd.type = "text";
    togglePasswordIcon(inputPasswd);
  } else {
    inputPasswd.type = "password";
    togglePasswordIcon(inputPasswd);
  }
}

function togglePasswordIcon(inputPasswd) {
  let inputPasswdIcon = document.getElementById('input-password-icon');

  if (inputPasswd.type === "password") {
    inputPasswdIcon.src = "../assets/icons/visibility_off_icon.svg";
  } else {
    inputPasswdIcon.src = "../assets/icons/visibility_icon.svg";
  }
}

function resetInputIcon() {
  let inputPasswdIcon = document.getElementById('input-password-icon');

  inputPasswdIcon.src = "../assets/icons/lock_icon.svg";
}

function protectionEventBubbeling(event) {
  event.stopPropagation();

}