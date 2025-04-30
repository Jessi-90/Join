/**
 * Generates the mobile edit button template.
 * 
 * @param {Object} contact - The contact object containing the firebaseId.
 * @returns {string} The HTML string for the mobile edit button.
 */
function editContactMobileButton(contact) {
    return ` 
    <button id="mobile-edit-contact-btn" class="mobile-btn btn-dark d-none" onclick="showMobileActionButtonsOverlay()">
        <img src="../assets/icons/edit-contact-mobiel-btn.svg" alt="editContact_img" />
    </button>
    <div id="mobile-edit-contact-action-btn-overlay" class="d-none">
        <div id="mobile-edit-contact-btn" class="edit-button mobile-contact-action-btn" onclick="showEditContactOverlay('${contact.firebaseId}')">
            <img src="../assets/icons/edit.svg" alt="mobile-edit-contact">
            <span>Edit</span>
        </div>
        <div id="mobile-delete-contact-btn" class="delete-button mobile-contact-action-btn" onclick="deleteContact('${contact.firebaseId}')">
            <img src="../assets/icons/delete.svg" alt="mobile-delete-contact">
            <span>Delete</span>
        </div>
  </div>
    `;
}