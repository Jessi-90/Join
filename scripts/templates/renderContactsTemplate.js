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
                        <button class="btn-dark" onclick="showAddContactOverlay()">Add new contact 
                            <img src="../assets/icons/person_add.svg" alt="addContact_img">
                        </button>
                    </div>
                    <div id="contactList">
                        ${renderAlphabeticalContactList()}
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