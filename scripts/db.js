/**
 * The base URL for accessing the database.
 * @constant {string}
 */
const BASE_URL = "https://da-join-project-default-rtdb.europe-west1.firebasedatabase.app/";


/**
 * Fetches tasks data from the server, cleans the data and updates the currentTasksData array.
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
        const rawData = await databaseResponse.json();
        const cleanedData = cleanRawTasksData(rawData);
        currentTasksData = cleanedData;
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
async function getContacts() {
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


/**
 * Cleans the raw assigned users data by converting it to an array (if necessary)
 * and removing placeholder entries.
 *
 * @function
 * @param {Array|string[]|Object} assignedUsersRaw - The raw assigned users data (array or object).
 * @returns {Array<string>} An array of valid assigned user names.
 */
function cleanAssignedUsers(assignedUsersRaw) {
    if (!assignedUsersRaw) return [];

    const usersArray = Array.isArray(assignedUsersRaw)
        ? assignedUsersRaw
        : Object.values(assignedUsersRaw);

    return usersArray.filter(user => user !== "__placeholder__");
}


/**
 * Cleans the raw subtasks object by removing placeholder entries if present.
 *
 * @function
 * @param {Object} subtasksRaw - The raw subtasks data object.
 * @returns {Object} A cleaned object containing only valid subtasks
 */ 
function cleanSubtasks(subtasksRaw) {
    if (!subtasksRaw || subtasksRaw.placeholder) {
        return {};
    }

    return subtasksRaw;
}


/**
 * Cleans the raw task data object by processing each task's `assignedUsers` and `subtasks` fields.
 * 
 * - If the key is `"counter"`, it is added as-is without modification.
 * - For all other tasks, the function removes placeholder entries from `assignedUsers`
 *   and sanitizes `subtasks`.
 * 
 * @function
 * @param {Object} rawData - The raw task data object retrieved from the backend.
 * @param {Object} rawData[key] - An object representing a task or a special key like "counter".
 * @returns {Object} A new object containing the cleaned tasks with valid assigned users and subtasks.
 */
function cleanRawTasksData(rawData) {
    const cleanedData = {};
    for (const [key, value] of Object.entries(rawData)) {
        if (key === "counter") {
            cleanedData[key] = value;
            continue;
        }
        cleanedData[key] = {
            ...value,
            assignedUsers: cleanAssignedUsers(value.assignedUsers),
            subtasks: cleanSubtasks(value.subtasks)
        };
    }
    return cleanedData;
}