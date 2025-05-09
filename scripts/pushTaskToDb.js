/**
 * Represents the current task status.
 * This variable is used to determine the column in which a new task should be displayed.
 * Possible values:
 * 1 - To do
 * 2 - In progress
 * 3 - Await feedback
 * Default value is 1 (To do).
 */
let currentTaskStatus = 1;


/**
 * Pushes all the task data to the database using PUT to replace the entire structure.
 * @param {Event} event - The form submit event.
 * @param {Object} tasks - The tasks data from the database.
 * @param {Object} newTask - The newTask data to push to the database.
 */
async function addNewTask(event, tasks, newTask) {
    event.preventDefault();
    try {
        let counter = increaseTasksCounter(tasks);
        let newTaskKey = `taskid_${counter}`;

        tasks[newTaskKey] = createNewTask(tasks, newTask, newTaskKey);
        tasks.counter = counter;

        await saveTasksToDatabase(tasks);
    } catch (error) {
        console.error("Error adding the task to the database:", error);
    }
}


/**
 * Saves the updated tasks object to the database using PUT.
 * @param {Object} tasks - The updated tasks object to save.
 */
async function saveTasksToDatabase(tasks) {
    try {
        const response = await fetch(`${BASE_URL}/tasks.json`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(tasks),
        });
        return response
    } catch (error) {
        return { status: 500 }; 
    }
}


/**
 * Returns the updated counter of tasks.
 * @param {Object} tasks 
 * @returns {number} The updated counter.
 */
function increaseTasksCounter(tasks) {
    let counter = tasks?.counter || 0;
    counter++;
    return counter;
}


/**
 * Returns the updated tasks object with the new task.
 * @param {Object} newTask The new task to add.
 * @returns {Object} The new task object.
 */
function createNewTask(newTask) {
    return {
        title: newTask.title || "",
        description: newTask.description || "",
        category: newTask.category || "",
        assignedUsers: convertArrayToFirebaseObject(newTask.assignedUsers || []),
        subtasks: convertSubtasksToObject(newTask.subtasks || []),
        priority: newTask.priority || "low",
        dueDate: newTask.dueDate || "",
        status: currentTaskStatus || 1,
    };
}


/**
 * Converts an array of subtasks into an object format suitable for storage.
 * 
 * @param {Array} subtasksArray - The array of subtasks to be converted.
 * @returns {Object} The object containing subtasks with their IDs as keys.
 */
function convertSubtasksToObject(subtasksArray) {
    const subtasksObject = {};

    if (!Array.isArray(subtasksArray) || subtasksArray.length === 0) {
        return { placeholder: true };
    }

    subtasksArray.forEach((subtask, index) => {
        const subtaskId = `subtaskId${index + 1}`;
        subtasksObject[subtaskId] = processSubtask(subtask);
    });

    return subtasksObject;
}


/**
 * Processes a single subtask into the desired format.
 * 
 * @param {Object} subtask - The subtask object to process.
 * @returns {Object} The processed subtask object with default values.
 */
function processSubtask(subtask) {
    return {
        title: subtask.title || "",
        completed: subtask.completed || false,
    };
}


/**
 * Initializes the form logic.
 * This function adds the submit event listener to the form when called.
 */
function sendTaskFormToDb() {
    const form = document.querySelector("form");
    form.addEventListener("submit", async function (event) {
        const requestResponse =  await handleFormSubmission(event);
        clearFormAndData();
        showUserFeedback(requestResponse);
        setTimeout(() => {
            redirectToBoardPage();
        }, 3000);
        
    });
}


/**
 * Pushes all the task data to the database using PUT to replace the entire structure.
 * @param {Event} event - The form submit event.
 */
async function handleFormSubmission(event) {
    event.preventDefault();
    const newTask = getFormData();
    const tasks = await fetchTasksData();

    let counter = increaseTasksCounter(tasks);
    let newTaskKey = `taskid_${counter}`;

    tasks[newTaskKey] = createNewTask(newTask, newTaskKey);
    tasks.counter = counter;

    const requestResponse =  await saveTasksToDatabase(tasks);
    return requestResponse;
}



/**
 * Displays user feedback based on the HTTP response status after attempting to save tasks to the database.
 * If the response status is not 200, an error message is shown to the user.
 * The feedback container is made visible regardless of the outcome.
 *
 * @async
 * @function showUserFeedback
 * @param {Response|{status: number}} requestResponse - The response object returned from the fetch request,
 * or a custom object with a status property in case of an error.
 */

async function showUserFeedback(requestResponse) {
    const feedbackContainer = document.getElementById("feedbackContainer");
    if (requestResponse.status !== 200) {
        feedbackContainer.innerHTML = `
            Task could not be created. Please try again later.
            `;
    }
    feedbackContainer.classList.remove("d-none");
}


/**
 * Redirects the user to the board page after task submission.
 */
function redirectToBoardPage() {
    window.location.href = "board.html";
}


/**
 * Collects the form data and returns it as an object.
 * @returns {Object} The collected form data.
 */
function getFormData() {
    const title = getTitle();
    const description = getDescription();
    const dueDate = getDueDate();
    const priority = getPriority();
    const assignedUsers = getAssignedUsers();
    const category = getCategory();
    const subtasks = getSubtasks();

    return { title, description, dueDate, priority, assignedUsers, category, subtasks };
}


/**
 * Retrieves the title from the form.
 * @returns {string} The title entered in the form.
 */
function getTitle() {
    return document.getElementById("title").value.trim();
}


/**
 * Retrieves the description from the form.
 * @returns {string} The description entered in the form.
 */
function getDescription() {
    return document.getElementById("description").value.trim();
}


/**
 * Retrieves the due date from the form.
 * @returns {string} The due date entered in the form.
 */
function getDueDate() {
    return document.getElementById("due-date").value.trim();
}


/**
 * Determines the priority based on the active priority button.
 * @returns {string} The priority (low, medium, or urgent).
 */
function getPriority() {
    let priority = "low";
    document.querySelectorAll(".prio-btn").forEach(button => {
        if (button.classList.contains("active")) {
            priority = button.classList.contains("urgent")
                ? "urgent"
                : button.classList.contains("medium")
                    ? "medium"
                    : "low";
        }
    });
    return priority;
}


/**
 * Retrieves assigned users from sessionStorage.
 * @returns {Array<string>} A list of assigned users.
 */
function getAssignedUsers() {
    let assignedUsers = [];
    const storedUsers = sessionStorage.getItem("selectedContacts");
    if (storedUsers) {
        try {
            assignedUsers = JSON.parse(storedUsers);
        } catch (error) {
            console.error("Error parsing assignedUsers from sessionStorage:", error);
        }
    }
    return assignedUsers;
}


/**
 * Retrieves the category from the form.
 * @returns {string} The selected category.
 */
function getCategory() {
    return document.getElementById("category").value.trim();
}


/**
 * Retrieves the list of subtasks from the form.
 * @returns {Array<Object>} An array of subtasks with title and completed status.
 */
function getSubtasks() {
    return Array.from(document.querySelectorAll("#subtask-list li"))
        .map(subtask => ({
            title: subtask.textContent.trim(),
            completed: false
        }));
}


/**
 * Converts an array into a Firebase-compatible object where each array index becomes a key.
 * 
 * - If the array is empty or falsy, it returns an object with a single placeholder entry.
 * - Otherwise, it maps each item in the array to an object property using its index as the key.
 * 
 * This is useful for storing array-like data in Firebase Realtime Database,
 * which does not natively support arrays.
 * 
 * @function
 * @param {Array} arr - The input array to be converted.
 * @returns {Object} An object representation of the array suitable for Firebase.
 */
function convertArrayToFirebaseObject(arr) {
    if (!arr || arr.length === 0) {
        return { 0: "__placeholder__" }; 
    }

    return arr.reduce((acc, val, idx) => {
        acc[idx] = val;
        return acc;
    }, {});
}
