/**
 * Generates the mobile edit button template.
 * 
 * @param {Object} contact - The contact object containing the firebaseId.
 * @returns {string} The HTML string for the mobile edit button.
 */
function editContactMobileButton(contact) {
    return ` 
    <button id="mobile-edit-contact-btn" class="mobile-btn btn-dark d-none" onclick="showEditContactOverlay('${contact.firebaseId}')">
        <img src="../assets/icons/edit-contact-mobiel-btn.svg" alt="editContact_img" />
    </button>
    `;
}
