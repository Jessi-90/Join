/**
 * An array to store the data of individual contacs after fetching.
 * @type {Array}
 */
let currentContactsData;

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

        currentContactsData = await databaseResponse.json();

    } catch (error) {
        console.error("Error fetching data:", error);
        currentContactsData = {};
    }
}


function showAddContactOverlay() {
    return
}