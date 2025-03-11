/**
 * An array to store the data of individual contacs after fetching.
 * @type {Array}
 */
let currentContactsData = [];

/**
 * Initializes the application by fetching task data.
 */
async function init() {
    await fetchContactsData();
}

/**
 * Fetches contacts data from the server and updates the currentTasksData array.
 * Uses the fetch API to get data from the specified endpoint.
 * 
 * @throws Will throw an error if the fetch operation fails or the response is not okay.
 */
async function fetchContactsData() {
    try {
        let databaseResponse = await fetch(BASE_URL + "contacts.json");
        if (!databaseResponse.ok) {
            throw new Error(`Status: ${databaseResponse.status}`);
        }
        const data = await databaseResponse.json(); 
        
        if (!data) {
            currentContactsData = [];
        } else {
            currentContactsData = Object.keys(data).map(key => ({
                firebaseId: key,   
                ...data[key]       
            }));
        }
        console.log("Geladene Kontakte:", currentContactsData);

    } catch (error) {
        console.error("Error fetching data:", error);
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
    } catch (error) {
        console.error("Fehler beim Hinzufügen eines Kontakts:", error);
    }
}