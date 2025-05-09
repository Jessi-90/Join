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
 * Retrieves the contact input elements from the provided form.
 *
 * This function searches for the input fields for name, email, and phone within the given form,
 * using selectors for both the add and edit overlays.
 *
 * @param {HTMLFormElement} form - The form element to query for input fields.
 * @returns {{name: HTMLInputElement, email: HTMLInputElement, phone: HTMLInputElement}} An object containing the name, email, and phone input elements.
 */
function getContactInputs(form) {
    return {
        name: form.querySelector("input[placeholder='Name'], input#editContactName"),
        email: form.querySelector("input[placeholder='Email'], input#editContactEmail"),
        phone: form.querySelector("input[placeholder='Phone'], input#editContactPhone")
    };
}


/**
 * Checks if the contact form inputs are valid.
 *
 * Validates that the name is not empty, the email input matches a valid email format,
 * and the phone input contains valid characters and meets a minimum length requirement.
 *
 * @param {HTMLFormElement} form - The form element containing the contact inputs.
 * @returns {boolean} True if all input fields are valid; otherwise, false.
 */
function isContactFormValid(form) {
    const { name, email, phone } = getContactInputs(form);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[+]?[\d\s\-()]{6,}$/;

    return (
        name.value.trim().length > 0 &&
        emailRegex.test(email.value.trim()) &&
        phoneRegex.test(phone.value.trim())
    );
}


/**
 * Highlights invalid inputs within the provided form by applying error styles and messages.
 *
 * Resets any previous error states on the input fields, then validates each field individually.
 *
 * @param {HTMLFormElement} form - The form element containing the contact inputs.
 */
function highlightInvalidInputs(form) {
    const { name, email, phone } = getContactInputs(form);
    resetInputErrors([name, email, phone]);
    validateName(name);
    validateEmail(email);
    validatePhone(phone);
}


/**
 * Removes error styles and clears error messages for the given list of input elements.
 *
 * @param {HTMLInputElement[]} inputs - An array of input elements to reset.
 */
function resetInputErrors(inputs) {
    inputs.forEach(input => {
        input.classList.remove("input-mismatch");
        const errorEl = input.nextElementSibling;
        if (errorEl) errorEl.textContent = "";
    });
}


/**
 * Validates the name input field to ensure it is not empty.
 *
 * If the name field is empty, it adds an error class and sets an error message.
 *
 * @param {HTMLInputElement} input - The input element for the name field.
 */
function validateName(input) {
    if (!input.value.trim()) {
        input.classList.add("input-mismatch");
        const errorEl = input.nextElementSibling;
        if (errorEl) errorEl.textContent = "Name cannot be empty.";
    }
}


/**
 * Validates the email input field for a proper email format.
 *
 * If the email doesn't match a valid format, an error class is added and an error message is displayed.
 *
 * @param {HTMLInputElement} input - The input element for the email field.
 */
function validateEmail(input) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.value.trim())) {
        input.classList.add("input-mismatch");
        const errorEl = input.nextElementSibling;
        if (errorEl) errorEl.textContent = "Enter a valid email.";
    }
}


/**
 * Validates the phone input field to ensure it contains a valid phone number.
 *
 * If the phone number does not meet the regex criteria, an error class is applied and an error message is set.
 *
 * @param {HTMLInputElement} input - The input element for the phone field.
 */
function validatePhone(input) {
    const phoneRegex = /^[+]?[\d\s\-()]{6,}$/;
    if (!phoneRegex.test(input.value.trim())) {
        input.classList.add("input-mismatch");
        const errorEl = input.nextElementSibling;
        if (errorEl) errorEl.textContent = "Enter a valid number.";
    }
}


/**
 * Validates the contact form by highlighting invalid inputs and checking overall validity.
 *
 * Uses the helper functions to show error messages for invalid fields and then returns
 * whether all form fields pass the validation.
 *
 * @param {HTMLFormElement} form - The form element containing the contact inputs.
 * @returns {boolean} True if the form is valid; otherwise, false.
 */
function validateContactForm(form) {
    highlightInvalidInputs(form);
    return isContactFormValid(form);
}