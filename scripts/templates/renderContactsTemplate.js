/**
 * Generates the complete HTML template for the contact view.
 * This function renders a two-column layout:
 * - Left section: Contact list sorted alphabetically.
 * - Right section: Contact detail view for the selected contact.
 *
 * @returns {string} HTML string representing the entire contact layout.
 */
function renderContacts() {
    return `
        <section class="contact-view">
            <section>
                <div class="contact-list-wrapper">
                    <div class="contact-list-header">
                        <button class="button-dark-large" onclick="showAddContactOverlay()">Add new contact 
                            <img src="../assets/icons/person_add.svg" alt="addContact_img">
                        </button>
                    </div>
                    <div id="contactList">
                    ${renderContactList(currentContactsData)}
                    </div>
                </div>
            </section>
            <section>
                <div class="contact-detail-wrapper">
                    <div class="contact-detail-header">
                        <h2>Contacts</h2>
                        <div class="vertical-line"></div>
                        <p>Better with a team</p>
                    </div>
                    <div id="contactDetail" class="contact-detail"></div>
                </div>
            </section>
        </section>
    `;
}


/**
 * Generates the HTML template for a letter section.
 *
 * @param {string} letter - The letter of the alphabet.
 * @param {Array} contacts - Array of contact objects.
 * @returns {string} - HTML string for the section.
 */
function generateLetterSection(letter, contacts) {
    return `
        <div class="contact-letter-section">
            <div class="contact-letter">${letter}</div>
            <div class="contact-divider"></div>
            <div class="contact-placeholder">
                ${generateContactItemsForLetter(letter, contacts)}
            </div>
        </div>
    `;
}


/**
 * Generates a placeholder item if no contacts exist for a letter.
 *
 * @param {string} letter - The letter for which no contacts exist.
 * @returns {string} HTML string for the placeholder.
 */
function generatePlaceholderItem(letter) {
    return `
        <div class="contact-placeholder-item">
            <div class="contact-icon-placeholder" style="background-color: ${getRandomColor()}">AA</div>
            <div class="contact-info-placeholder">
                <div class="contact-name-placeholder">Name ${letter}</div>
                <div class="contact-email-placeholder">example@domain.com</div>
            </div>
        </div>
    `;
}


/**
 * Generates the HTML for a single letter section.
 * @param {string} letter - The letter representing the section.
 * @param {Array} contacts - Contacts under this letter.
 * @returns {string} HTML string for the letter section.
 */
function generateLetterSectionHTML(letter, contacts) {
    return `
        <div class="contact-letter-section">
            <div class="contact-letter">${letter}</div>
            <div class="contact-divider"></div>
            ${contacts.map(renderContactListItem).join('')}
        </div>
    `;
}


/**
 * Creates an HTML string for a single contact item in the contact list.
 * Displays the contact's initials, name, and email.
 * 
 * @param {Object} contact - Contact data.
 * @param {string} contact.name - Full name.
 * @param {string} contact.email - Email address.
 * @param {string} contact.color - Background color for initials.
 * @param {string} contact.initials - Contact initials.
 * 
 * @returns {string} HTML string for the contact item.
 */
function renderContactListItem(contact) {
    return `
        <div class="contact-placeholder-item" onclick='onContactClick(${JSON.stringify(contact)})'>
            <div class="contact-icon-placeholder" style="background-color: ${contact.color}">
                ${contact.initials}
            </div>
            <div class="contact-info-placeholder">
                <div class="contact-name-placeholder">${contact.name}</div>
                <div class="contact-email-placeholder">${contact.email}</div>
            </div>
        </div>
    `;
}


/**
 * Generates the HTML template for the contact details.
 * 
 * @param {Object} contact - Contact data.
 * @returns {string} HTML string for the contact details.
 */
function renderContactDetailTemplate(contact) {
    return `
        <div class="contact-detail-name">
            <div class="contact-icon-placeholder-large" style="background-color: ${contact.color}">
                ${contact.initials}
            </div>
            <div class="namefield">
                <span>${contact.name}</span>
                <div class="contact-actions">
                    <button class="edit-button" onclick="showEditContactOverlay()">
                        <img src="../assets/icons/edit.svg" alt="Edit" class="button-icon">Edit
                    </button>
                    <button class="delete-button" onclick="deleteEditContactOverlay(${contact.id})">
                        <img src="../assets/icons/delete.svg" alt="Delete" class="button-icon">Delete
                    </button>
                </div>
            </div>
        </div>
        <div class="contact-info-section">
            <h4>Contact Information</h4>
            <p><strong>Email</strong> <a href="mailto:${contact.email}">${contact.email}</a></p>
            <p><strong>Phone</strong> ${contact.phone}</p>
        </div>
    `;
}