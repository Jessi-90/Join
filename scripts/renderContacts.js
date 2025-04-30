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

        await mapContactsData();
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
 * Delegates tasks such as toggling details and applying mobile view adjustments.
 * 
 * @param {Object} contact - The clicked contact.
 */
function onContactClick(contact) {
    toggleContactDetail(contact);

    if (isMobileView()) {
        showContactDetailViewForMobile();
        hideContactListViewForMobile();
        hideMobileAddContactButton();
        addBackButtonToMobileDetail();
    }
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
            const contact = currentContactsData.find(c => String(c.id) === contactId);
            if (contact) {
                onContactClick(contact); 
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
    if (window.innerWidth > 769) {
        const allContacts = document.querySelectorAll('.contact-placeholder-item');
        allContacts.forEach(contact => contact.classList.remove('active'));

        clickedElement.classList.add('active');
    }
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
 * Handles contact detail toggling for screens larger than 768px
 *
 * @param {Object} contact - The contact object to be displayed.
 * @param {string|null} currentOpenContact - The Firebase ID of the currently opened contact.
 */
function handleLargeScreenToggle(contact, currentOpenContact) {
    if (currentOpenContact === String(contact.firebaseId)) {
        closeContactDetail();
    } else {
        easeContactDetailTransitionOut();
        setTimeout(() => {
            openNewContact(contact);
        }, 125);
    }
}


/**
 * Toggles the contact detail view.
 * If the selected contact is already open, it closes the detail view.
 * Otherwise, it applies a transition effect and opens the new contact details.
 *
 * @param {Object} contact - The contact object to be displayed.
 * @param {number|string} contact.firebaseId - The unique Firebase identifier of the contact.
 */
function toggleContactDetail(contact) {
    const container = document.getElementById('contact-detail');
    const screenWidth = window.innerWidth;
    if (!container) {
        openNewContact(contact);
        return;
    }
    const currentOpenContact = container.getAttribute('data-firebase-id') || null;
    if (screenWidth <= 768) {
        handleSmallScreenToggle(contact);
    } else {
        handleLargeScreenToggle(contact, currentOpenContact);
    }
}


/**
 * Opens the contact detail view and displays the selected contact's information.
 * Adds an 'active' class to the selected contact item and updates the contact detail container.
 * 
 * @param {Object} contact - The contact object to be displayed.
 * @param {number|string} contact.id - The unique identifier of the contact.
 */
function openNewContact(contact) {
    const container = document.getElementById('contactDetail');
    const clickedItem = document.querySelector(`[data-contact-id="${contact.id}"]`);

    if (clickedItem) {
        clickedItem.classList.add('active');
    }

    container.innerHTML = renderContactDetailTemplate(contact);
    updateMobileEditButtonContainer(contact);
    setTimeout(() => {
        container.classList.add('show');
    }, 10);
}