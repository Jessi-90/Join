/**
 * The base URL for accessing the database.
 * @constant {string}
 */
const BASE_URL = "https://da-join-project-default-rtdb.europe-west1.firebasedatabase.app/";


/**
 * Fetches tasks data from the server and updates the currentTasksData array.
 * Uses the fetch API to get data from the specified endpoint.
 * 
 * @throws Will throw an error if the fetch operation fails or the response is not okay.
 * @returns {Object} The updated currentTasksData object.
 */
async function fetchTasksData() {
    try {
        let databaseResponse = await fetch(BASE_URL + "tasks.json");
        if (!databaseResponse.ok) {
            throw new Error(`Status: ${databaseResponse.status}`);
        }

        currentTasksData = await databaseResponse.json();

    } catch (error) {
        console.error("Error fetching data:", error);
        currentTasksData = {};
    }
    return currentTasksData;
}


/**
 * Fetches the current contacts from the database.
 * @returns {Promise<Array>} an object with the contacts and the counter.
 */
async function getContacts(event) {
    event.preventDefault();
    let contacts;
    try {
        let response = await fetch(BASE_URL + "contacts.json");
        if (!response.ok) {
            throw new Error(`Status: ${response.status}`);
        }
        contacts = await response.json();
        
    } catch (error) {
        console.error("Error while fetching conacts data", error);
        contacts = {};
    }
    return contacts; 
};