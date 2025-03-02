document.addEventListener('DOMContentLoaded', async () => {
    await initContacts();
});

/**
 * Initializes the contacts page.
 * 
 * This function selects the `<main>` element in the document and injects the 
 * HTML returned by `renderContacts()` into the `main` element. 
 * 
 * This is the main entry point for rendering the contact page layout after the page loads.
 */
function initContacts() {
    const mainElement = document.querySelector('main');
    mainElement.innerHTML = renderContacts();

    const contacts = getMockContacts();
    renderContactList(contacts);
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
 * Returns a list of mock contact objects.
 * Each contact contains an id, name, email, phone number, color, and initials.
 * This is used as sample data to simulate real contact data in the application.
 */
function getMockContacts() {
    return [
        { id: '1', name: 'Benedikt Ziegler', email: 'benedikt@gmail.com', phone: '12345678', color: '#6E52FF', initials: 'BZ' },
        { id: '2', name: 'David Eisenberg', email: 'davideberg@gmail.com', phone: '12345678', color: '#FC71FF', initials: 'DE' },
        { id: '3', name: 'Eva Fischer', email: 'eva@gmail.com', phone: '12345678', color: '#FFBB2B', initials: 'EF' },
        { id: '4', name: 'Emmanuel Mauer', email: 'emmanuelma@gmail.com', phone: '12345678', color: '#1FD7C1', initials: 'EM' },
        { id: '5', name: 'Marcel Bauer', email: 'bauer@gmail.com', phone: '12345678', color: '#462F8A', initials: 'MB' },
        { id: '6', name: 'Tatjana Wolf', email: 'wolf@gmail.com', phone: '+49 2222 222 22 2', color: '#FFA500', initials: 'TW' },
    ];
}

/**
 * Groups a list of contacts into categories based on the first letter of their name.
 * Each letter (A-Z) serves as a key, with the associated value being an array of contacts whose names start with that letter.
 *
 * @param {Array<Object>} contacts - An array of contact objects.
 * Each contact object must have a `name` property.
 *
 * @returns {Object} An object where each key is a letter (A-Z), and the value is an array of contacts whose names start with that letter.
 *
 * @example
 * const contacts = getMockContacts();
 * const grouped = groupContactsAlphabetically(contacts);
 * console.log(grouped['B']); // Array of contacts whose names start with "B"
 */
function groupContactsAlphabetically(contacts) {
    const grouped = {};

    contacts.forEach(contact => {
        const letter = contact.name[0].toUpperCase();
        if (!grouped[letter]) grouped[letter] = [];
        grouped[letter].push(contact);
    });

    return grouped;
}

/**
 * Adds click event listeners to all contacts.
 * 
 * When a contact is clicked, it gets marked as active, and all other contacts lose their active state.
 * This function should be called after rendering the contact list.
 */
function addContactClickEvents() {
    const contactItems = document.querySelectorAll('.contact-placeholder-item');
    contactItems.forEach(item => {
        item.addEventListener('click', function () {
            setActiveContact(item);
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