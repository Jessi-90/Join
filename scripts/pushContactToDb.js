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

        let counter = contacts?.counter || 0;
        counter++; 

        let newContactKey = `contact_${counter}`;

        contacts[newContactKey] = {
            name: newContact.name || "",
            email: newContact.email || "",
            phone: newContact.phone || "",
            color: newContact.color || "",
            initials: newContact.initials || "",
            password: newContact.password || ""
        };

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