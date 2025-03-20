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

    setTimeout(() => document.querySelector('.overlay')?.classList.add('show'), 10);
    
    overlay.removeEventListener('click', closeEditContactOverlay);
    overlay.addEventListener('click', closeEditContactOverlay);
}


/**
 * Closes the Edit Contact Overlay if clicking outside the modal or on the close button.
 * Prevents closing when clicking inside the modal.
 * 
 * @param {Event} event - click event.
 */
function closeEditContactOverlay(event) {
    let overlay = document.getElementById('editContactOverlay');
    let modal = document.querySelector('.overlay-container');

    if (!event || !overlay || !modal) {
        hideOverlay(overlay);
        return;
    }

    if (event.target.closest('.close-btn') || !modal.contains(event.target)) {
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
 * Generiert Initialen aus einem Namen (z. B. "John Doe" → "JD").
 * @param {string} name - Der vollständige Name des Kontakts.
 * @returns {string} - Die Initialen.
 */
function getInitials(name) {
    if (!name) return "?";
    const nameParts = name.split(" ");
    return nameParts.length > 1
        ? (nameParts[0][0] + nameParts[1][0]).toUpperCase()
        : nameParts[0][0].toUpperCase();
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
        initials: contact.initials || getInitials(contact.name),
        color: contact.color || getRandomColor()
    };
}


/**
 * Gibt eine zufällige Farbe für das Kontaktbild zurück.
 * @returns {string} - Eine zufällige Hex-Farbe.
 */
function getRandomColor() {
    const colors = ['#6E52FF', '#FC71FF', '#FFBB2B', '#1FD7C1', '#462F8A', '#20B2AA'];
    return colors[Math.floor(Math.random() * colors.length)];
}