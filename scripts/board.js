/**
 * The base URL for accessing the database.
 * @constant {string}
 */
const BASE_URL = "https://da-join-project-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * An array to store the data of individual tasks after fetching.
 * @type {Array}
 */
let currentTasksData;

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
       
        currentTasksData = await databaseResponse.json();
        console.log(currentTasksData);

    } catch (error) {
        console.error("Error fetching data:", error);
        currentTasksData = {}; 
    }
}

function renderTasks(tasks) {
    const container = document.getElementById('to-do');
    container.innerHTML = '';

    if (!tasks || Object.keys(tasks).length === 0) {
        console.error('No tasks to render');
        return;
    }

    for (const taskId in tasks) {
        if (taskId !== 'counter') {
            const currentTask = tasks[taskId];

            const { completedSubtasks, totalSubtasks } = countSubtasks(currentTask.subtasks);
            const progressPercentage = calculateSubtaskProgress(completedSubtasks, totalSubtasks);

            const taskHtml = boardCardTemplate(
                taskId,
                currentTask.category || 'No Category',
                currentTask.title || 'Untitled Task', 
                currentTask.description || 'No description',
                progressPercentage,
                completedSubtasks,
                totalSubtasks,
                currentTask.assignedUser || 'Unassigned',
                currentTask.priority || 'No Priority'
            );

            container.innerHTML += taskHtml;
        }
    }
}

function countSubtasks(subtasks) {
    let completedSubtasks = 0;
    let totalSubtasks = 0;

    if (subtasks) {
        totalSubtasks = Object.keys(subtasks).length;

        for (const subtaskId in subtasks) {
            if (subtasks[subtaskId].completed) {
                completedSubtasks++;
            }
        }
    }

    return { completedSubtasks, totalSubtasks };
}

function calculateSubtaskProgress(completed, total) {
    return total > 0 ? (completed / total) * 100 : 0;
}