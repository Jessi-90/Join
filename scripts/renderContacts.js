document.addEventListener('DOMContentLoaded', async () => {
    await initContacts();
});


/**
 * Initializes the contacts page by rendering the contact list and setting up event listeners.
 * 
 * This function:
 * - Replaces the main content with the contact list layout.
 * - Fetches contact data asynchronously.
 * - Renders the contact list grouped alphabetically.
 * - Updates the contact list section with the rendered contacts.
 * - Adds click event listeners for interactivity.
 * 
 * @async
 * @function initContacts
 * @returns {Promise<void>} A promise that resolves when the initialization is complete.
 */
async function initContacts() {
        const mainElement = document.querySelector('main');
        mainElement.innerHTML = renderContacts(); 

        await fetchContactsData();
        renderContactList(currentContactsData);

        document.getElementById('contactList').innerHTML = renderAlphabeticalContactList(currentContactsData);

        addContactClickEvents();                    
    }


/**
 * Sets up the page initialization process.
 * 
 * This event listener waits for the entire HTML document to be fully loaded 
 * (including all HTML tags). Once the DOM is ready, it calls `initContacts` 
 * to render the contact page.
 */
document.addEventListener('DOMContentLoaded', initContacts);


/**
 * Returns a random color from a predefined color palette.
 * This ensures that contact icons have varied colors.
 *
 * @returns {string} A random hex color code (e.g., "#FF5733").
 */
function getRandomColor() {
    const colors = ['#6E52FF', '#FC71FF', '#FFBB2B', '#1FD7C1', '#462F8A', '#20B2AA'];
    return colors[Math.floor(Math.random() * colors.length)];
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
 * Groups contacts alphabetically based on the first letter of their name.
 * Invalid contacts (missing or incorrectly formatted) are ignored.
 * 
 * @function groupContactsAlphabetically
 * @param {Array<Object>} contacts - An array of contact objects.
 * @param {string} contacts[].name - The name of the contact.
 * @returns {Object} - An object where keys are uppercase letters (A-Z) and values are arrays of contacts.
 */
function groupContactsAlphabetically(contacts) {
    const grouped = {};

    contacts.forEach(contact => {
        if (!contact || typeof contact !== 'object' || !contact.name) {
            return;
        }

        const letter = contact.name[0].toUpperCase();
        if (!grouped[letter]) grouped[letter] = [];
        grouped[letter].push(contact);
    });

    return grouped;
}


/**
 * Handles the event when a contact is clicked to view detailed information.
 * @param {Object} contact - The clicked contact.
 */
function onContactClick(contact) {
    renderContactDetail(contact);
}


/**
 * Adds click event listeners to all contact items.
 * 
 * When a contact item is clicked, it:
 * - Sets the clicked item as the active contact.
 * - Retrieves the contact ID from the `data-contact-id` attribute.
 * - Searches for the contact in `currentContactsData`.
 * - If the contact exists, it renders the contact's details.
 */
function addContactClickEvents() {
   
    const contactItems = document.querySelectorAll('.contact-placeholder-item');    
    contactItems.forEach(item => {
        item.addEventListener('click', function () {
            setActiveContact(item); 
            const contactId = item.getAttribute('data-contact-id'); 
            const contact = currentContactsData.find(c => c.id === contactId);
            if (contact) {
                renderContactDetail(contact); 
            }
        });
    });
}


/**
 * Sets the clicked contact as active.
 * 
 * Removes the 'active' class from all contacts and adds it to the clicked contact.
 * This visually highlights the selected contact.
 * 
 * @param {HTMLElement} clickedElement - The contact element that was clicked.
 */
function setActiveContact(clickedElement) {
    const allContacts = document.querySelectorAll('.contact-placeholder-item');
    allContacts.forEach(contact => contact.classList.remove('active'));

    clickedElement.classList.add('active');
}


/**
 * Generates the alphabetical contact list HTML.
 * Iterates over each letter of the alphabet and calls `generateLetterSection`.
 *
 * @param {Array} contacts - Array of contact objects.
 * @returns {string} - HTML string for the contact list.
 */
function renderAlphabeticalContactList(contacts) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    return alphabet.map(letter => generateLetterSection(letter, contacts)).join('');
}


/**
 * Generates a list of contact items for a given letter.
 * If there are no valid contacts for the letter, it returns a placeholder item.
 * 
 * @function generateContactItemsForLetter
 * @param {string} letter - The letter to filter contacts by (should be an uppercase letter).
 * @param {Array<Object>} contacts - An array of contact objects.
 * @param {string} contacts[].name - The name of the contact.
 * @returns {string} - An HTML string containing contact list items or a placeholder.
 */
function generateContactItemsForLetter(letter, contacts) {
    if (!Array.isArray(contacts)) {
        console.warn(`⚠️ Keine gültigen Kontakte für "${letter}" gefunden!`, contacts);
        return generatePlaceholderItem(letter); 
    }

    const contactsForLetter = contacts.filter(contact => 
        contact.name && contact.name[0]?.toUpperCase() === letter
    );

    return contactsForLetter.length > 0 
        ? contactsForLetter.map(contact => renderContactListItem(contact)).join('') 
        : generatePlaceholderItem(letter);
}


/**
 * Generates the complete HTML for the contact list.
 * @param {Array} contacts - Array mit allen Kontakten.
 */
function renderContactList(contacts) {
    const contactListContainer = document.getElementById('contactList');

    if (!contacts || contacts.length === 0) {
        renderNoContactsMessage(contactListContainer);
        return;
    }

    const groupedContacts = groupContactsAlphabetically(contacts);
    contactListContainer.innerHTML = generateContactListHTML(groupedContacts);
}


/**
 * Generates the HTML for the entire contact list.
 * @param {Object} groupedContacts - Contacts grouped by letter.
 * @returns {string} HTML string for the contact list.
 */
function generateContactListHTML(groupedContacts) {
    return Object.keys(groupedContacts)
        .map(letter => generateLetterSectionHTML(letter, groupedContacts[letter]))
        .join('');
}


/**
 * Renders a message when no contacts are available.
 * @param {HTMLElement} container - The container element for the contact list.
 */
function renderNoContactsMessage(container) {
    container.innerHTML = `<p class="no-contacts">No contacts available.</p>`;
}


/**
 * Displays the detailed view of a selected contact.
 * Injects the generated contact details template into the DOM.
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
    container.innerHTML = renderContactDetailTemplate(contact);
}
