/**
 * Fetches the current contacts from the database.
 * @returns {Promise<Array>} an object with the contacts and the counter.
 */
async function getContacts() {
    try {
        let response = await fetch(`${BASE_URL}/contacts.json`);
        let contacts = await response.json();
        return contacts || {}; 
    } catch (error) {
        console.error("❌ Fehler beim Abrufen der Kontakte:", error);
        return null;
    }
};


/**
 * Pushes all the contact data to the database using PUT.

 * @param {Object} newContact - The newContact data to push to the database.
 */
async function addNewContact(newContact) {
    try {
        let contacts = await this.getContacts();

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

        console.log(`New Contact (ID: ${newContactKey}) added to database!`);
    } catch (error) {
        console.error("error at adding the contact:", error);
    }
};