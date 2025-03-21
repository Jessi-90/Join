/**
 * Generates the HTML template for a dropdown item.
 * 
 * @param {Object} contact - The contact object containing name and user details.
 * @returns {string} - The HTML string for the dropdown item.
 */
function addTaskUserDropdownItemTemplate(contact) {
    return `
        <div class="dropdown-avatar-and-name">
            ${UserAvatarTemplate(contact.userDetails)}
            ${contact.name}
        </div>
        ${checkboxTemplate()}
    `;
}
