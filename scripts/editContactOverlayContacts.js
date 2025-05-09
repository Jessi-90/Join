/**
 * Displays the Edit Contact Overlay and initializes its content.
 * The overlay is shown with a slight animation delay.
 *
 * @param {string} firebaseId - The unique ID of the contact in Firebase.
 */
function showEditContactOverlay(firebaseId) {
    let contact = currentContactsData.find(c => c.firebaseId === firebaseId);
    if (!contact) return;

    let updatedContact = initializeContactData(contact);
    let overlay = document.getElementById('editContactOverlay');
    if (!overlay) return;

    overlay.innerHTML = showEditContactOverlayHTMLTemplate(updatedContact);
    overlay.setAttribute("data-firebase-id", firebaseId);
    document.getElementById('saveContactButton')?.addEventListener('click', saveContactFromEditOverlay);
    overlay.classList.remove('d-none', 'hide');
    overlay.classList.add('show');

    setTimeout(() => {
        document.querySelector('.overlay')?.classList.add('show');
    }, 10);

    document.getElementById('editContactOverlay')?.addEventListener('click', closeEditContactOverlay);
}


/**
 * Closes the Edit Contact Overlay if clicking outside the modal or on the close button.
 * Prevents closing when clicking inside the modal.
 * 
 * @param {Event} event - click event.
 */
function closeEditContactOverlay(event) {
    let overlay = document.getElementById('editContactOverlay');
    if (!overlay) return;

    let modal = document.querySelector('.modal');

    if (event) {
        if (!modal || !modal.contains(event.target) || event.target.closest('.close-btn')) {
            hideOverlay(overlay);
        }
    } else {
        hideOverlay(overlay);
    }
}


/**
 * Hides the given overlay element with a smooth transition.
 * 
 * This function removes the 'show' class to trigger the CSS transition.
 * Once the transition ends, it adds the 'd-none' class to fully hide the element.
 * A fallback timeout ensures the class is added even if the 'transitionend' event doesn't fire.
 *
 * @param {HTMLElement} overlay - The overlay DOM element to hide.
 */
function hideOverlay(overlay) {
    overlay.classList.remove('show');

    const onTransitionEnd = () => {
        overlay.classList.add('d-none');
        overlay.removeEventListener('transitionend', onTransitionEnd);
    };

    overlay.addEventListener('transitionend', onTransitionEnd);
    setTimeout(onTransitionEnd, 300);
}


/**
 * Initializes contact data by ensuring the contact has initials and a color.
 * If initials or color are missing, they are generated automatically.
 *
 * @param {Object} contact - The contact object.
 * @param {string} contact.name - The name of the contact.
 * @param {string} [contact.initials] - Optional initials of the contact.
 * @param {string} [contact.color] - Optional color associated with the contact.
 * @returns {Object} - The updated contact object with initials and color.
 */
function initializeContactData(contact) {
    return {
        ...contact,
        initials: contact.initials || getContactInitials(contact.name),
        color: contact.color || getRandomColor()
    };
}


/**
 * Retrieves updated contact data from the form inputs.
 *
 * Compares the current input values with those of the existing contact object and 
 * returns an object with only the modified fields.
 *
 * @param {HTMLFormElement} form - The form element that contains the new input values.
 * @param {Object} existingContact - The original contact object used for comparison.
 * @returns {Object|null} An object with the updated data, or null if there are no changes.
 */
function getUpdatedContactData(form, existingContact) {
    const { name, email, phone } = getContactInputs(form);
    let updatedData = {};

    if (name.value.trim() !== existingContact.name)
        updatedData.name = name.value.trim();
    if (email.value.trim() !== existingContact.email)
        updatedData.email = email.value.trim();
    if (phone.value.trim() !== existingContact.phone)
        updatedData.phone = phone.value.trim();

    return Object.keys(updatedData).length ? updatedData : null;
}


/**
 * Saves the updated contact data to Firebase.
 *
 * @async
 * @param {string} firebaseId - The unique Firebase ID of the contact.
 * @param {HTMLFormElement} form - The form containing the updated contact data.
 * @returns {Promise<void>}
 */
async function saveContactChanges(firebaseId, form) {
    let contact = findContactById(firebaseId);
    if (!contact) return;

    let updatedData = getUpdatedContactData(form, contact);
    if (!updatedData) return logNoChanges();

    await updateContact(firebaseId, updatedData);
}


/** Finds the contact by its Firebase ID. */
function findContactById(firebaseId) {
    return currentContactsData.find(c => c.firebaseId === firebaseId);
}


/** Logs a message when no changes are detected. */
function logNoChanges() {
    console.log("No changes detected.");
}


/** Updates the contact on the server and handles the response. */
async function updateContact(firebaseId, updatedData) {
    try {
        let response = await updateContactOnServer(firebaseId, updatedData);
        if (!response.ok) throw new Error("Error updating the contact");

        handleSuccessfulUpdate(firebaseId, updatedData);
    } catch (error) {
        console.error("Error saving contact changes:", error);
    }
}


/**
 * Sends the updated contact data to Firebase.
 *
 * @param {string} firebaseId - The unique ID of the contact in Firebase.
 * @param {Object} updatedData - The data to be updated.
 * @returns {Promise<Response>} - The fetch response.
 */
async function updateContactOnServer(firebaseId, updatedData) {
    return fetch(`${BASE_URL}/contacts/${firebaseId}.json`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
    });
}


/**
 * Handles UI updates after a successful contact update.
 *
 * @param {string} firebaseId - The unique ID of the contact in Firebase.
 * @param {Object} updatedData - The data that was updated.
 */
function handleSuccessfulUpdate(firebaseId, updatedData) {
    updateContactList(firebaseId, updatedData);

    let contactDetailContainer = document.getElementById("contact-detail");
    if (contactDetailContainer && contactDetailContainer.getAttribute("data-firebase-id") === firebaseId) {
        let updatedContact = currentContactsData.find(c => c.firebaseId === firebaseId);
        contactDetailContainer.innerHTML = renderContactDetailTemplate(updatedContact);
        updateMobileEditButtonContainer(updatedContact);
    }

    closeEditContactOverlay();
    mapContactsData();
}


/**
 * Updates the contact list in memory and re-renders it.
 *
 * @param {string} firebaseId - The ID of the contact being updated.
 * @param {Object} updatedData - The updated contact data.
 */
function updateContactList(firebaseId, updatedData) {
    currentContactsData = currentContactsData.map(c =>
        c.firebaseId === firebaseId ? { ...c, ...updatedData } : c
    );
    renderContactList(currentContactsData);
}


/**
 * Handles the click event for the "Save" button in the edit overlay.
 *
 * @param {Event} event - The click event triggered by the save button.
 */
function saveContactFromEditOverlay(event) {
    if (event) event.preventDefault();

    let overlay = getEditOverlay();
    if (!overlay) return;

    let form = getOverlayForm(overlay);
    if (!isValidForm(form)) return;

    let firebaseId = getFirebaseId(overlay);
    if (!firebaseId) return;

    saveContactChanges(firebaseId, form);
}


/** Retrieves the edit overlay element. */
function getEditOverlay() {
    return document.getElementById('editContactOverlay');
}


/** Retrieves the form from the overlay. */
function getOverlayForm(overlay) {
    return overlay?.querySelector("form");
}


/** Validates the contact form. */
function isValidForm(form) {
    return validateContactForm(form);
}


/** Extracts the Firebase ID from the overlay. */
function getFirebaseId(overlay) {
    return overlay?.getAttribute("data-firebase-id");
}


/**
 * Deletes the currently edited contact from the database and removes it from all assigned tasks.
 * If the viewport width is 768px or smaller, it also closes the mobile contact details view.
 * 
 * This function retrieves the contact ID from the edit overlay, removes the contact 
 * from all tasks where it was assigned, updates the tasks in the database, 
 * and then deletes the contact itself. Finally, it hides the edit contact overlay.
 *
 * @async
 * @function deleteContactFromEditOverlay
 * @returns {Promise<void>} - A promise that resolves once the contact is deleted, 
 * the overlay is closed, and (if applicable) the mobile contact details are hidden.
 */
async function deleteContactFromEditOverlay() {
    const firebaseId = document.querySelector('.form-container')?.dataset.firebaseId;
    if (!firebaseId) {
        console.error("No contact ID found.");
        return;
    }

    let updatedTasks = await removeContactFromTasks(firebaseId);
    await updateTasksInDatabase(updatedTasks);
    await deleteContact(firebaseId);

    setTimeout(() => {
        let overlay = document.getElementById('editContactOverlay');
        if (overlay) {
            hideOverlay(overlay);
        }

        if (isMobileView()) {
            closeMobileContactDetail();
            hideMobileOverlay();
        }
    }, 100);
}