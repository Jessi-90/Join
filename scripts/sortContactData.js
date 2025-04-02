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

