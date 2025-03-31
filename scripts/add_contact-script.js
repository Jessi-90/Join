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

    overlayContainer.classList.remove('show');

    setTimeout(() => {
        addContactOverlay.classList.add('d-none');


        document.removeEventListener("click", handleOutsideClick);
    }, 300);
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