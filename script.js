function toggleInputIcon(event) {
    let inputPassword = document.getElementById('input-password');

    if (event.type === 'focus') {
      inputPassword.style.backgroundImage = "url('../assets/icons/visibility_off_icon.svg')";
    } else if (event.type === 'blur') {
      inputPassword.style.backgroundImage = "url('../assets/icons/lock_icon.svg')";
    }
  }
