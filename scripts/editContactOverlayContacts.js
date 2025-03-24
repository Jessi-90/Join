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
    let modal = document.querySelector('.modal');

    if (!overlay || !modal) {
        hideOverlay(overlay);
        return;
    }

    if (!modal.contains(event.target) || event.target.closest('.close-btn')) {
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