/**
 * Fetches the current tasks from the database.
 * @returns {Promise<Object>} The tasks object from the database.
 */
async function getTasks(event) {
    event.preventDefault();
    try {
        let response = await fetch(BASE_URL + "tasks.json");  
        if (!response.ok) {
            throw new Error(`Status: ${response.status}`);
        }
        let tasks = await response.json();
        return tasks || {}; 
    } catch (error) {
        console.error("Error while fetching tasks data", error);
        return null;
    }
};


/**
 * Pushes all the task data to the database using PUT.
 * @param {Event} event - The form submit event.
 * @param {Object} tasks - The tasks data from the database.
 * @param {Object} newTask - The newTask data to push to the database.
 */
async function addNewTask(event, tasks, newTask) {
    event.preventDefault();
    try {

        let counter = increaseTasksCounter(tasks);
        let newTaskKey = `task_${counter}`;
        let newTasks = createNewTask(tasks, newTask, newTaskKey);
        
        tasks.counter = counter;  
        
        await fetch(`${BASE_URL}/tasks.json`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(newTasks) 
        });

    } catch (error) {
        console.error("error at adding the task to the database:", error);
    }
};


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
 * @param {Object} tasks The current tasks object.
 * @param {Object} newTask The new task to add.
 * @param {string} newTaskKey The key for the new task.
 * @returns {Object} The updated tasks object.
 */
function createNewTask(tasks, newTask, newTaskKey) {
    tasks[newTaskKey] = {
        title: newTask.title || "",
        description: newTask.description || "",
        category: newTask.category || "",
        assignedUsers: newTask.assignedUsers || [],   
        subtasks: newTask.subtasks || [],  
        priority: newTask.priority || "low",  
        dueDate: newTask.dueDate || "",  
        status: newTask.status ?? columnStatus,    
    };

    return tasks;
}
