/**
 * The base URL for accessing the database.
 * @constant {string}
 */
const BASE_URL = "https://da-join-project-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * An array to store the data of individual tasks after fetching.
 * @type {Array}
 */
let currentTasksData = [];

/**
 * Initializes the application by fetching task data.
 */
async function init() {
    await fetchTasksData();
    renderTasks(currentTasksData);
}

/**
 * Fetches tasks data from the server and updates the currentTasksData array.
 * Uses the fetch API to get data from the specified endpoint.
 * 
 * @throws Will throw an error if the fetch operation fails or the response is not okay.
 */
async function fetchTasksData() {
    try {
        let databaseResponse = await fetch(BASE_URL + "tasks.json");
        if (!databaseResponse.ok) {
            throw new Error(`Status: ${databaseResponse.status}`);
        }
        let databaseResponseToJson = await databaseResponse.json();
        currentTasksData = [databaseResponseToJson];
        console.log(currentTasksData);

    } catch (error) {
        console.error("Error fetching data:", error);
        currentTasksData = [];
    }
}

function renderTasks(tasks) {
    const container = document.getElementById('to-do');
    container.innerHTML = '';

    if (!tasks || tasks.length === 0) {
        console.error('No tasks to render');
        return;
    }

    for (let taskIndex = 0; taskIndex < currentTasksData.length; index++) {
        let currentTask = currentTasksData[taskIndex].taskid1;
        const taskHtml = boardCardTemplate(currentTask);
        container.innerHTML += taskHtml;
        
    }
}