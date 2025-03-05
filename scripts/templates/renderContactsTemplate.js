/**
 * Renders the HTML structure for displaying a list of contacts, along with an option to add new contacts and a section to display contact details.
 * 
 * This function generates a contact view, which includes:
 * - A button to add new contacts, which triggers the `showAddContactOverlay` function when clicked.
 * - A contact list section that is populated with contacts rendered alphabetically (using `renderAlphabeticalContactList`).
 * - A contact detail section that will be populated with the details of a selected contact (though this section is empty at this stage).
 * 
 * @returns {string} The HTML structure as a string to be injected into the DOM.
 */

function renderContacts() {
    const contacts = getMockContacts();
    const contactListHtml = renderAlphabeticalContactList(contacts);

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
                        ${contactListHtml}
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
 * Groups the contacts by the first letter of their name.
 * 
 * This function organizes a list of contacts into groups based on the first letter of each contact's name. 
 * Each letter (A-Z) is used as a key, and the value is an array of contacts whose names begin with that letter.
 * If the list of contacts is empty or undefined, it logs an error message and returns an empty object.
 * 
 * @param {Array<Object>} contacts - An array of contact objects, where each object must have a `name` property.
 * @returns {Object} An object where the keys are letters (A-Z) and the values are arrays of contacts whose names start with that letter.
 * 
 * const groupedContacts = groupContactsAlphabetically(contacts);
 * console.log(groupedContacts['B']); // Output: [{ name: 'Benedikt Ziegler', email: 'benedikt@gmail.com' }]
 */
function groupContactsAlphabetically(contacts) {
    const grouped = {};

    if (!contacts || contacts.length === 0) {
        console.error("Keine Kontakte zum Gruppieren gefunden");
        return grouped;
    }

    contacts.forEach(contact => {
        const letter = contact.name[0].toUpperCase(); 
        if (!grouped[letter]) grouped[letter] = [];
        grouped[letter].push(contact);
    });

    return grouped;
}

/**
 * Renders a list of contacts in alphabetical order, grouped by the first letter of their name.
 * 
 * This function first groups the contacts by the first letter of their name, then dynamically 
 * creates and inserts HTML elements to display each group in a container. Each group is 
 * displayed under its corresponding letter with the contacts listed below it. 
 * 
 * @param {Array<Object>} contacts - An array of contact objects, where each contact must have 
 *                                    at least a `name` property (string).
 * 
 * @returns {void} This function does not return any value. It modifies the DOM directly.
 * 
 * renderContactList(contacts);
 * // The contact list will be rendered alphabetically with 'A', 'B', and 'C' sections
 */
function renderContactList(contacts) {
    const container = document.getElementById('contactList');
    container.innerHTML = '';

    const groupedContacts = groupContactsAlphabetically(contacts);

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    alphabet.forEach(letter => {
        if (groupedContacts[letter] && groupedContacts[letter].length > 0) {
            container.innerHTML += `
                <div class="contact-letter-section">
                    <div class="contact-letter">${letter}</div>
                    <div class="contact-divider"></div>
                    ${groupedContacts[letter].map(contact => renderContactListItem(contact)).join('')}
                </div>
            `;
        }
    });
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
        <div class="contact-placeholder-item" data-contact='${JSON.stringify(contact)}'>
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
 * Handles the event when a contact is clicked.
 * 
 * This function receives the contact object and triggers the rendering 
 * of the detailed view for that specific contact.
 */
function onContactClick(contact) {
    renderContactDetail(contact);
}

/**
 * Displays the detailed view of a selected contact.
 * Shows contact's initials, name, email, and phone number.
 *
 * @param {Object} contact - Contact data.
 * @param {string} contact.name - Full name.
 * @param {string} contact.email - Email address.
 * @param {string} contact.phone - Phone number.
 * @param {string} contact.color - Background color for initials.
 * @param {string} contact.initials - Contact initials.
 */
function renderContactDetail(contact) {
    const container = document.getElementById('contactDetail');
    container.innerHTML = '';
    container.innerHTML = `
           <div class="contact-detail-name">
            <div class="contact-icon-placeholder-large" style="background-color: ${contact.color}">
                ${contact.initials}
            </div>
            <div class="namefield">
                <span>${contact.name}</span>
                <div class="contact-actions">
                    <button class="edit-button">
                        <img src="../assets/icons/edit.svg" alt="Edit" class="button-icon">Edit</button>
                    <button class="delete-button" onclick="showEditContactOverlay()">
                        <img src="../assets/icons/delete.svg" alt="Delete" class="button-icon">Delete</button>
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