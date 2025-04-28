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
 * Hides the given overlay by removing the 'show' class and adding 'd-none' after a delay.
 * This ensures a smooth transition effect.
 *
 * @param {HTMLElement} overlay - The overlay element to be hidden.
 */
function hideOverlay(overlay) {
    overlay.classList.remove('show');

    setTimeout(() => {
        overlay.classList.add('d-none');
    }, 300);
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
 * @param {Object} contact - The original contact object.
 * @returns {Object|null} - The updated data object or null if no changes exist.
 */
function getUpdatedContactData(contact) {
    let updatedName = document.getElementById('editContactName').value.trim();
    let updatedEmail = document.getElementById('editContactEmail').value.trim();
    let updatedPhone = document.getElementById('editContactPhone').value.trim();

    let updatedData = {};
    if (updatedName && updatedName !== contact.name) updatedData.name = updatedName;
    if (updatedEmail && updatedEmail !== contact.email) updatedData.email = updatedEmail;
    if (updatedPhone && updatedPhone !== contact.phone) updatedData.phone = updatedPhone;

    return Object.keys(updatedData).length > 0 ? updatedData : null;
}


/**
 * Saves the updated contact data to Firebase using PATCH.
 *
 * @param {string} firebaseId - The unique ID of the contact in Firebase.
 */
async function saveContactChanges(firebaseId) {
    let contact = currentContactsData.find(c => c.firebaseId === firebaseId);
    if (!contact) return;

    let updatedData = getUpdatedContactData(contact);
    if (!updatedData) {
        console.log("Keine Änderungen vorhanden.");
        return;
    }

    try {
        let response = await updateContactOnServer(firebaseId, updatedData);
        if (!response.ok) throw new Error("Fehler beim Aktualisieren des Kontakts");

        handleSuccessfulUpdate(firebaseId, updatedData);

    } catch (error) {
        console.error("Fehler beim Speichern der Kontaktänderungen:", error);
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
 * Handles the save button click from the edit overlay.
 * Extracts the firebaseId and calls saveContactChanges.
 */
function saveContactFromEditOverlay(event) {
    if (event) event.preventDefault(); 

    let overlay = document.getElementById('editContactOverlay');
    if (!overlay) return;

    let firebaseId = overlay.getAttribute("data-firebase-id"); 
    if (!firebaseId) return;

    saveContactChanges(firebaseId);
}

/**
 * Deletes the currently edited contact from the database and removes it from all assigned tasks.
 * 
 * This function retrieves the contact ID from the edit overlay, removes the contact 
 * from all tasks where it was assigned, updates the tasks in the database, 
 * and then deletes the contact itself. Finally, it hides the edit contact overlay.
 * 
 * @async
 * @function deleteContactFromEditOverlay
 * @returns {Promise<void>} - A promise that resolves once the contact is deleted and the overlay is closed.
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
    }, 100);
}

