/**
 * Fetches the current contacts from the database.
 * @returns {Promise<Array>} an object with the contacts and the counter.
 */
async function getContacts(event) {
    event.preventDefault();
    try {
        let response = await fetch(BASE_URL + "contacts.json");
        if (!response.ok) {
            throw new Error(`Status: ${response.status}`);
        }
        let contacts = await response.json();
        return contacts || {}; 
    } catch (error) {
        console.error("Error while fetching conacts data", error);
        return null;
    }
};


/**
 * Pushes all the contact data to the database using PUT.
 * @param {Event} event - The form submit event.
 * @param {Object} contacts - The contacts data from the database.
 * @param {Object} newContact - The newContact data to push to the database.
 */
async function addNewContact(event, contacts, newContact) {
    event.preventDefault();
    try {

        let counter = increaseContactsCounter(contacts);

        let newContactKey = `contact_${counter}`;

        let newContacts = createNewContact(contacts, newContact, newContactKey);
        
        contacts.counter = counter; 

        await fetch(`${BASE_URL}/contacts.json`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(contacts) 
        });

    } catch (error) {
        console.error("error at adding the contacts to the database:", error);
    }
};

/**
 * Returns the updated counter of contacts.
 * @param {Object} contacts 
 * @returns {number} The updated counter.
 */
function increaseContactsCounter(contacts) {
    let counter = contacts?.counter || 0;
    counter++; 
    return counter;
}

/**
 * Returns the updated contacts object with the new contact.
 * @param {Object} contacts The current contacts object.
 * @param {Object} newContact The new contact to add.
 * @param {string} newContactKey The key for the new contact.
 * @returns {Object} The updated contacts object.
 */
function createNewContact(contacts, newContact, newContactKey) {
    contacts[newContactKey] = {
        name: newContact.name || "",
        email: newContact.email || "",
        phone: newContact.phone || "",
        color: newContact.color || "",
        initials: newContact.initials || "",
        password: newContact.password || ""
    };

    return contacts;
}