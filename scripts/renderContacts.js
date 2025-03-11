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

        document.getElementById('contactList').innerHTML = renderAlphabeticalContactList(contacts);

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
 * Groups the contacts alphabetically by their first name letter.
 * @param {Array} contacts - List of contacts.
 * @returns {Object} Grouped contacts.
 */
function groupContactsAlphabetically(contacts) {
    const grouped = {};

    contacts.forEach(contact => {
        const letter = contact.name[0].toUpperCase();
        if (!grouped[letter]) grouped[letter] = [];
        grouped[letter].push(contact);
    });
    for (const letter in grouped) {
        grouped[letter].sort((a, b) => a.name.localeCompare(b.name));
    }
    return grouped;
}

/**
 * Handles the event when a contact is clicked to view detailed information.
 * @param {Object} contact - The clicked contact.
 */
function onContactClick(contact) {
    renderContactDetail(contact);
}

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