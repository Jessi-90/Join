/**
 * The base URL for accessing the database.
 * @constant {string}
 */
const BASE_URL = "https://da-join-project-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Posts mock contact data to Firebase by iterating through a predefined list of contacts.
 * Calls `postContact()` for each contact in the mock data.
 * 
 * @async
 * @returns {Promise<void>} Resolves when all mock contacts have been posted.
 */
async function postMockContacts() {
    const mockContacts = getMockContacts();

    for (const contact of mockContacts) {
        await postContact(contact);
    }
}


/**
 * Posts a single contact to Firebase.
 * 
 * @async
 * @param {Object} contact - The contact object to be uploaded.
 * @param {string} contact.name - The full name of the contact.
 * @param {string} contact.email - The email address of the contact.
 * @param {string} contact.phone - The phone number of the contact.
 * @param {string} contact.color - A color associated with the contact.
 * @param {string} contact.initials - The initials of the contact.
 * @throws Will throw an error if the HTTP request fails.
 * @returns {Promise<void>} Resolves when the contact is successfully posted.
 */
async function postContact(contact) {
    try {
        const response = await fetch(`${BASE_URL}/contacts.json`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(contact)
        });

        if (!response.ok) {
            throw new Error(`Fehler beim Hochladen: ${response.status}`);
        }

        const data = await response.json();
        console.log(`Kontakt hochgeladen:`, contact.name, data);
    } catch (error) {
        console.error("Fehler beim Posten eines Kontakts:", error);
    }
}

/**
 * Returns a list of predefined mock contacts.
 * 
 * @returns {Array<Object>} An array of mock contact objects.
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
 * Sends mock contact data to Firebase, then fetches and logs the stored contacts.
 * 
 * @async
 * @returns {Promise<void>} Resolves when data is sent and retrieved successfully.
 */
async function loadAndLogMockContacts() {
    console.log("Sende Mockup-Daten an Firebase...");
    await postMockContacts();
    console.log("Lade jetzt die Daten aus Firebase...");
    await fetchContactsData();
    console.log("Alle geladenen Kontakte:", currentContactsData);
}

/** 
 *  Start the process of posting and loading mock contacts
*/
loadAndLogMockContacts();
