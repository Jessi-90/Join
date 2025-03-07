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
 * Generates the alphabetically sorted list of placeholder contacts.
 * For each letter from A to Z, a section with dummy contact data is created.
 * Each contact gets a random background color for its icon.
 *
 * @returns {string} HTML string representing the alphabetically sorted contact list.
 */
function renderAlphabeticalContactList() {
    const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    let html = '';

    alphabet.forEach(letter => {
        html += `
            <div class="contact-letter-section">
                <div class="contact-letter">${letter}</div>
                   <div class="contact-divider"></div>
                          <div class="contact-placeholder">
                               <div class="contact-placeholder-item">
                                  <div class="contact-icon-placeholder"style="background-color: ${getRandomColor()}">AA</div>
                                  <div class="contact-info-placeholder">
                               <div class="contact-name-placeholder" id="contact-name">Name ${letter}</div>
                            <div class="contact-email-placeholder" id="e-mail-contact">example@domain.com</div>
                         </div>
                    </div>
                </div>
            </div>
        `;
    });

    return html;
}

/**
 * Generates the complete HTML for the contact list.
 * @param {Array} contacts - Array mit allen Kontakten.
 */
function renderContactList(contacts) {
    const contactListContainer = document.getElementById('contactList');
    if (!contacts || contacts.length === 0) {
        contactListContainer.innerHTML = `<p class="no-contacts">No contacts available.</p>`;
        return;
    }

    const groupedContacts = groupContactsAlphabetically(contacts);
    contactListContainer.innerHTML = '';

    for (const letter in groupedContacts) {
        contactListContainer.innerHTML += `
            <div class="contact-letter-section">
                <div class="contact-letter">${letter}</div>
                <div class="contact-divider"></div>
                ${groupedContacts[letter].map(renderContactListItem).join('')}
            </div>
        `;
    }
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
              <button class="edit-button" onclick="showEditContactOverlay()">
              <img src="../assets/icons/edit.svg" alt="Edit" class="button-icon">Edit</button>
              <button class="delete-button" onclick="deleteEditContactOverlay(${contact.id})">
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