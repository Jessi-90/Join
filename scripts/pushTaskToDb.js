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
        await fetch(`${BASE_URL}/tasks.json`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(tasks),
        });
    } catch (error) {
        console.error("Error saving tasks to the database:", error);
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
 * @param {string} newTaskKey The key for the new task.
 * @returns {Object} The new task object.
 */
function createNewTask(newTask, newTaskKey) {
    return {
        title: newTask.title || "",
        description: newTask.description || "",
        category: newTask.category || "",
        assignedUsers: newTask.assignedUsers || [],
        subtasks: convertSubtasksToObject(newTask.subtasks || []),
        priority: newTask.priority || "low",
        dueDate: newTask.dueDate || "",
        status: newTask.status !== undefined ? newTask.status : 1,
    };
}

/**
 * Converts an array of subtasks into an object with unique IDs.
 * @param {Array} subtasksArray - The array of subtasks.
 * @returns {Object} The subtasks in object format.
 */
function convertSubtasksToObject(subtasksArray) {
    const subtasksObject = {};
    subtasksArray.forEach((subtask, index) => {
        const subtaskId = `subtaskId${index + 1}`;
        subtasksObject[subtaskId] = {
            title: subtask.title || "",
            completed: subtask.completed || false,
        };
    });
    return subtasksObject;
}