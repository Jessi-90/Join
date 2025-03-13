/**
 * Toggles the visibility of the password input field and changes the icon accordingly.
 * @param {string} inputId - The ID of the password input field.
 * @param {string} iconId - The ID of the icon element.
 */
function togglePasswordVisibility(inputId, iconId) {
	let inputField = document.getElementById(inputId);
	let inputIcon = document.getElementById(iconId);

	inputField.addEventListener("input", function () {
		if (this.value.length > 0) {
			this.classList.add("show-password");
			inputIcon.src = "../assets/icons/visibility_off_icon.svg";
		} else {
			this.classList.remove("show-password", "password-visible");
			inputIcon.src = "../assets/icons/lock_icon.svg";
		}
	});

	inputIcon.addEventListener("mousedown", function (event) {
		event.preventDefault();
		if (inputField.type === "password") {
			inputField.type = "text";
			inputIcon.src = "../assets/icons/visibility_icon.svg";
		} else {
			inputField.type = "password";
			inputIcon.src = "../assets/icons/visibility_off_icon.svg";
		}
		inputField.focus();
	});

	inputField.addEventListener("blur", function () {
		this.type = "password";
		if (this.value.length > 0) {
			inputIcon.src = "../assets/icons/visibility_off_icon.svg";
		} else {
			inputIcon.src = "../assets/icons/lock_icon.svg";
		}
		this.classList.remove("password-visible");
	});
}

togglePasswordVisibility("signUpPassword", "signUpPasswordIcon");
togglePasswordVisibility("signUpConfirmPassword", "signUpConfirmPasswordIcon");
