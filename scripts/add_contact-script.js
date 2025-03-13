/**
 * Displays the Add Contact Overlay by injecting the HTML template, 
 * making the overlay visible, and adding an animation effect.
 * Also attaches an event listener to handle form submission.
 */
function showAddContactOverlay() {
    let addContactOverlayRef = document.getElementById('overlay');
    addContactOverlayRef.innerHTML = "";
    addContactOverlayRef.innerHTML += showAddContactOverlayHTMLTemplate();
    addContactOverlayRef.classList.remove('d-none');

    setTimeout(() => {
        let overlayContainerRef = document.querySelector('.overlay');
        overlayContainerRef.classList.add('show');
    }, 10);

    let form = document.querySelector(".form-container form");
    if (form) {
        form.addEventListener("submit", handleAddContact);
    }
}


/**
 * Closes the Add Contact Overlay when clicking outside the modal, on the close button, 
 * or on the cancel button. Prevents closing if clicking inside the modal.
 * The overlay is hidden with a delay for a smooth transition.
 * 
 * @param {Event} event - The click event that triggers the function.
 */
function closeAddContactOverlay(event) {
    let overlay = document.getElementById('overlay');
    let overlayContainer = document.querySelector('.overlay');

    if (event.target.closest('.overlay') && !event.target.closest('.close-btn') && 
       !event.target.closest('.add-contact-cancel')) {
        event.stopPropagation();
        return;
    }

    overlayContainer.classList.remove('show');

    setTimeout(() => {
        overlay.classList.add('d-none');
    }, 300);
}


/**
 * Handles form submission to add a new contact.
 * Prevents default submission and logs input values.
 *
 * @param {Event} event - The form submit event.
 */
function handleAddContact(event) {
    event.preventDefault();

    let name = document.querySelector("input[placeholder='Name']").value;
    let email = document.querySelector("input[placeholder='Email']").value;
    let phone = document.querySelector("input[placeholder='Phone']").value;

    if (!name || !email) {
        alert("Name and Email are required!");
        return;
    }

    let newContact = {
        name: name,
        email: email,
        phone: phone
    };

    closeAddContactOverlay(event);
}