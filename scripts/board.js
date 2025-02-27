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
function init() {
    fetchTasksData();
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
        currentTasksData = databaseResponseToJson.results;
        console.log(databaseResponseToJson);
        
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}


function renderTasks(tasks) {
    const container = document.getElementById('tasks-container');
    container.innerHTML = '';
    tasks.forEach(task => {
      
        let taskHtml = `
            <div class="task">
                <h3>${task.category}: ${task.description}</h3>
                <p>Task ID: ${task.taskid}</p>
                <p>Assigned to: ${task.assignedUser}</p>
                <p>Due Date: ${task.dueDate}</p>
                <p>Priority: ${task.priority}</p>
                <ul>
                    ${task.subtasks.map(subtask => `
                        <li>${subtask.title} - ${subtask.completed ? 'Completed' : 'Incomplete'}</li>
                    `).join('')}
                </ul>
            </div>
        `;
        container.innerHTML += taskHtml;
    });
}