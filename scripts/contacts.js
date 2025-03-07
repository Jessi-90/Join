/**
 * An array to store the data of individual contacs after fetching.
 * @type {Array}
 */
let currentContactsData;

/**
 * Initializes the app by fetching data and rendering the contacts.
 */
async function init() {
    await fetchContactsData();
    renderContacts();
    renderContactList(currentContactsData);
    addContactClickEvents();
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

        currentContactsData = await databaseResponse.json();

        if (!Array.isArray(currentContactsData)) {
            throw new Error('Fetched data is not an array');
        }
    
    } catch (error) {
        console.error("Error fetching data:", error);
        currentContactsData = getMockContacts();
    }
}

function showAddContactOverlay() {
    return
}