/**
 * Sorts an array of contacts alphabetically by first name.
 *
 * @param {Array} contacts - The array of contact objects to be sorted.
 * @param {string} contacts[].name - The full name of the contact.
 * @returns {Array} The sorted array of contacts in ascending order by first name.
 */
function sortContactsByName(contacts) {
    return contacts.sort((a, b) => a.name.localeCompare(b.name));
}


/**
 * Prepares and sorts an array of contacts by first name.
 *
 * @param {Array} data - The raw contact data to be processed.
 * @param {string} data[].name - The full name of the contact.
 * @param {string} data[].color - The assigned color for the contact.
 * @param {string} data[].initials - The initials of the contact.
 * @returns {Array} The processed and sorted array of contacts.
 */
function prepareContacts(data) {
    let contacts = data.map(contact => ({
        name: contact.name,
        userDetails: {
            color: contact.color,
            initials: contact.initials
        }
    }));
    return sortContactsByName(contacts);
}