/**
 * An array to store the data of individual contacs after fetching.
 * @type {Array}
 */
let currentContactsData = [];

/**
 * Initializes the app by fetching data and rendering the contacts.
 */
async function init() {
    await fetchContactsData();
    renderContacts();
    renderContactList(currentContactsData);
    addContactClickEvents();
    summaryGreetingUser();
}

/**
 * Fetches contact data from the Firebase database and stores it in `currentContactsData`.
 * Filters out invalid data and excludes the "counter" field.
 * 
 * @async
 * @function fetchContactsData
 * @returns {Promise<void>} - A promise that resolves when the data is fetched and processed.
 * @throws {Error} - Logs an error if the fetch request fails.
 */
async function fetchContactsData() {
    try {
        let databaseResponse = await fetch(BASE_URL + "contacts.json");
        if (!databaseResponse.ok) {
            throw new Error(`Status: ${databaseResponse.status}`);
        }
        const data = await databaseResponse.json();

        if (!data || typeof data !== 'object') {
            currentContactsData = [];
        } else {
            currentContactsData = Object.keys(data)
                .filter(key => key !== "counter")
                .map(key => ({
                    firebaseId: key,
                    ...data[key]
                }))
                .filter(contact => contact.name)
                .sort((a, b) => a.name.localeCompare(b.name));
        }

    } catch (error) {
        console.error("❌ Fehler beim Laden der Kontakte:", error);
        currentContactsData = [];
    }
}


function showAddContactOverlay() {
    return
}


/**
 * Adds a new contact with a sequential ID to the database.
 * 
 * @async
 * @param {Object} contact - The contact to be added.
 */
async function putContact(contact) {
    try {
        const response = await fetch(`${BASE_URL}/contacts.json`);
        if (!response.ok) throw new Error("Fehler beim Abrufen der Kontakte");

        const contacts = await response.json();
        const nextId = Object.keys(contacts || {}).length + 1;

        const putResponse = await fetch(`${BASE_URL}/contacts/${nextId}.json`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: nextId, ...contact }),
        });

        if (!putResponse.ok) throw new Error("Fehler beim Speichern des Kontakts");

        console.log(`Kontakt ${contact.name} mit ID ${nextId} gespeichert.`);
        await fetchContactsData();
        renderContactList(currentContactsData);

    } catch (error) {
        console.error("Fehler beim Hinzufügen eines Kontakts:", error);
    }
}


/**
 * Retrieves and validates contact form data.
 *
 * @returns {Object|null} The contact object if valid, otherwise null.
 */
function getContactFormData() {
    const name = document.querySelector('input[placeholder="Name"]').value.trim();
    const email = document.querySelector('input[placeholder="Email"]').value.trim();
    const phone = document.querySelector('input[placeholder="Phone"]').value.trim();

    if (!name || !email || !phone) {
        alert("Please fill in all fields.");
        return null;
    }

    return {
        name,
        email,
        phone,
        initials: name.split(" ").map(n => n[0]).join("").toUpperCase(),
        color: getRandomColor()
    };
}


/**
 * Saves a new contact to the Firebase database and updates the UI.
 *
 * @async
 * @param {Object} contact - The contact data to be saved.
 * @returns {Promise<void>} A promise that resolves when the contact is saved and the UI is updated.
 */
async function saveContactToDatabase(contact) {
    try {
        const response = await fetch(`${BASE_URL}contacts.json`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(contact)
        });

        if (!response.ok) {
            throw new Error("Error creating contact.");
        }

        await fetchContactsData();
        renderContactList(currentContactsData);
        closeAddContactOverlay();

    } catch (error) {
        console.error("Error adding contact:", error);
    }
}


/**
 * Handles the form submission to create a new contact.
 *
 * @async
 * @param {Event} event - The event object.
 */
async function createContact(event) {
    event.preventDefault();
    const contact = getContactFormData();
    if (contact) {
        await saveContactToDatabase(contact);
    }
}


/**
 * Generates a random hex color for the contact avatar.
 *
 * @returns {string} A random hex color string.
 */
function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}