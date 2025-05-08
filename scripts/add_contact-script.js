/**
 * Displays the Add Contact Overlay by injecting the HTML template,  
 * making the overlay visible, and adding an animation effect.  
 * Also attaches event listeners for form submission and input validation.  
 */
function showAddContactOverlay() {
    let addContactOverlayRef = document.getElementById('addContactOverlay');
    addContactOverlayRef.innerHTML = "";
    addContactOverlayRef.innerHTML += showAddContactOverlayHTMLTemplate();
    addContactOverlayRef.classList.remove('d-none');

    setTimeout(() => {
        let overlayContainerRef = document.querySelector('.overlay');
        overlayContainerRef.classList.add('show');

        document.addEventListener("click", handleOutsideClick);
    }, 10);

    let form = document.querySelector(".form-container form");
    if (form) {
        form.addEventListener("submit", handleAddContact)

        document.querySelectorAll(".input-group input").forEach(input => {
            input.addEventListener("input", resetInputBorder);
        });
    }
}


/**
 * Closes the Add Contact Overlay when clicking outside the modal, on the close button, 
 * or on the cancel button. Prevents closing if clicking inside the modal.
 * The overlay is hidden with a delay for a smooth transition.
 * 
 * @param {Event} event - The click event that triggers the function.
 */
function closeAddContactOverlay() {
    let addContactOverlay = document.getElementById('addContactOverlay');
    let overlayContainer = document.querySelector('.overlay');

    handleCloseAnimation(overlayContainer);
    hideOverlayWithDelay(addContactOverlay, overlayContainer);
}


/**
 * Handles the animation class for closing the overlay based on viewport width.
 * @param {HTMLElement} overlayContainer - The overlay container element.
 */
function handleCloseAnimation(overlayContainer) {
    const isDesktopView = window.innerWidth > 768;

    overlayContainer.classList.remove('show');
    if (isDesktopView) {
        overlayContainer.classList.add('slideOutToRight');
    } else {
        overlayContainer.classList.add('slideOutToBottom');
    }
}


/**
 * Hides the overlay with a delay for smooth transition and removes event listener.
 * @param {HTMLElement} addContactOverlay - The main overlay element.
 * @param {HTMLElement} overlayContainer - The overlay container element.
 */
function hideOverlayWithDelay(addContactOverlay, overlayContainer) {
    setTimeout(() => {
        addContactOverlay.classList.add('d-none');
        overlayContainer.classList.remove('slideOutToRight', 'slideOutToBottom');
        document.removeEventListener("click", handleOutsideClick);
    }, 500);
}


/**
 * Handles clicks outside of the overlay.
 * @param {Event} event - The click event.
 */
function handleOutsideClick(event) {
    let overlayContainer = document.querySelector('.form-container');

    if (overlayContainer.contains(event.target)) {
        return;
    }

    closeAddContactOverlay();
}


/**
 * Validates the contact form fields.
 * Highlights empty fields in red and returns a boolean indicating validity.
 *
 * @returns {boolean} True if all fields are filled, otherwise false.
 */
function validateContactForm() {
    let nameInput = document.querySelector("input[placeholder='Name']");
    let emailInput = document.querySelector("input[placeholder='Email']");
    let phoneInput = document.querySelector("input[placeholder='Phone']");
    let isValid = true;

    document.querySelectorAll(".input-group input").forEach(input => {
        input.classList.remove("input-mismatch");
    });

    [nameInput, emailInput, phoneInput].forEach(input => {
        const isEmpty = !input.value.trim();
        input.classList.toggle("input-mismatch", isEmpty);
        if (isEmpty) isValid = false;
    });

    return isValid;
}


/**
 * Resets the input border to its original color when the user starts typing.
 *
 * @param {Event} event - The input event.
 */
function resetInputBorder(event) {
    event.target.style.border = ""; 
}


/**
 * Handles form submission to add a new contact.
 * Prevents default submission and validates input fields.
 * If valid, closes the overlay and shows the feedback image.
 *
 * @param {Event} event - The form submit event.
 */
function handleAddContact(event) {
    event.preventDefault();

    if (!validateContactForm()) {
        return;
    }

    closeAddContactOverlay();
    showFeedbackImage();
}


/**
 * Displays a feedback image after a successful contact creation.
 */
function showFeedbackImage() {
    let body = document.body;

    let feedbackContainer = document.createElement("div");
    feedbackContainer.className = "feedback-container";

    let feedbackImage = document.createElement("img");
    feedbackImage.src = "../assets/img/create-feedback.svg";
    feedbackImage.alt = "Contact Created";

    feedbackContainer.appendChild(feedbackImage);
    body.appendChild(feedbackContainer);

    setTimeout(() => {
        feedbackContainer.remove();
    }, 2000); 
}


/**
 * Validates the contact form fields (name, email, phone).
 * 
 * Checks that the name is not empty, the email has a valid format,
 * and the phone number contains only valid characters and is of reasonable length.
 * 
 * @returns {boolean} - Returns true if all fields are valid, otherwise false.
 */
function isContactFormValid() {
    const name = document.querySelector("input[placeholder='Name']").value.trim();
    const email = document.querySelector("input[placeholder='Email']").value.trim();
    const phone = document.querySelector("input[placeholder='Phone']").value.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[+]?[\d\s\-()]{6,}$/;

    return (
        name.length > 0 &&
        emailRegex.test(email) &&
        phoneRegex.test(phone)
    );
}


/**
 * Validates the Name, Email, and Phone input fields and highlights any errors.
 * 
 * This function performs the following steps:
 * 1. Resets any previous error styles on the input fields.
 * 2. Validates the Name, Email, and Phone input fields by calling respective validation functions.
 * 3. Applies error highlighting to any invalid fields based on the validation results.
 *
 * @function highlightInvalidInputs
 */
function highlightInvalidInputs() {
    const nameInput = document.querySelector("input[placeholder='Name']");
    const emailInput = document.querySelector("input[placeholder='Email']");
    const phoneInput = document.querySelector("input[placeholder='Phone']");

    resetInputErrors([nameInput, emailInput, phoneInput]);
    validateName(nameInput);
    validateEmail(emailInput);
    validatePhone(phoneInput);
}


/**
 * Resets error styles and error messages for the provided input fields.
 * 
 * This function performs the following steps:
 * 1. Removes the "input-mismatch" class from each input field to reset any error styling.
 * 2. Clears the error message displayed next to each input field, if present.
 *
 * @function resetInputErrors
 * @param {HTMLElement[]} inputs - An array of input elements to reset the error state for.
 */
function resetInputErrors(inputs) {
    inputs.forEach(input => {
        input.classList.remove("input-mismatch");
        const errorEl = input.nextElementSibling;
        if (errorEl) errorEl.textContent = "";
    });
}


/**
 * Validates the Name input field to ensure it is not empty.
 * 
 * This function performs the following:
 * 1. Checks if the input field's value is empty or only contains whitespace.
 * 2. If the value is invalid, adds an error class to the input and sets an error message next to the field.
 *
 * @function validateName
 * @param {HTMLElement} input - The input element representing the Name field to validate.
 */
function validateName(input) {
    if (!input.value.trim()) {
        input.classList.add("input-mismatch");
        const errorEl = input.nextElementSibling;
        if (errorEl) errorEl.textContent = "Name darf nicht leer sein.";
    }
}


/**
 * Validates the Email input field to ensure it contains a valid email address.
 * 
 * This function performs the following:
 * 1. Checks if the input field's value matches a regular expression for a valid email format.
 * 2. If the value is invalid, adds an error class to the input and sets an error message next to the field.
 *
 * @function validateEmail
 * @param {HTMLElement} input - The input element representing the Email field to validate.
 */
function validateEmail(input) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.value.trim())) {
        input.classList.add("input-mismatch");
        const errorEl = input.nextElementSibling;
        if (errorEl) errorEl.textContent = "Gültige E-Mail eingeben.";
    }
}


/**
 * Validates the Phone input field to ensure it contains a valid phone number.
 * 
 * This function performs the following:
 * 1. Checks if the input field's value matches a regular expression for a valid phone number format.
 * 2. If the value is invalid, adds an error class to the input and sets an error message next to the field.
 *
 * @function validatePhone
 * @param {HTMLElement} input - The input element representing the Phone field to validate.
 */
function validatePhone(input) {
    const phoneRegex = /^[+]?[\d\s\-()]{6,}$/;
    if (!phoneRegex.test(input.value.trim())) {
        input.classList.add("input-mismatch");
        const errorEl = input.nextElementSibling;
        if (errorEl) errorEl.textContent = "Gültige Nummer eingeben.";
    }
}


/**
 * Validates the contact form by checking the input fields for validity.
 * 
 * This function first highlights any invalid fields by calling `highlightInvalidInputs()`,
 * then checks whether all fields (name, email, phone) are valid using the `isContactFormValid()` function.
 * 
 * @returns {boolean} `true` if the form is valid (all fields are properly filled out), 
 *                   `false` if any of the fields are invalid (name, email, or phone).
 */
function validateContactForm() {
    highlightInvalidInputs();
    return isContactFormValid();
}