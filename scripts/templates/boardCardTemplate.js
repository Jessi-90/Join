/**
 * Generates the HTML template for a board card based on the provided task data.
 * 
 * @function boardCardTemplate
 * @param {Object} task - The task object containing task data.
 * @param {number} task.taskid - The unique ID of the task.
 * @param {string} task.category - The category of the task (e.g., "User Story").
 * @param {string} task.title - The title of the task.
 * @param {string} task.description - The description of the task.
 * @param {Array<Object>} task.subtasks - An array of subtasks associated with the task.
 * @param {boolean} task.subtasks[].completed - The completion status of the subtask.
 * @param {string} task.subtasks[].title - The title of the subtask.
 * @param {string} task.dueDate - The due date of the task.
 * @param {string} task.priority - The priority level of the task (e.g., "Urgent").
 * @param {string} task.assignedUser - The user to whom the task is assigned.
 * @returns {string} The generated HTML template for the board card.
 */
function boardCardTemplate(
    taskId, 
    category, 
    title, 
    description, 
    progressPercentage, 
    completedSubtasks, 
    totalSubtasks, 
    assignedUser, 
    priority
) {
    return `
    <div class="card" id="${taskId}" draggable="true">
        <div class="card-header">
            <span class="card-category ${category}">${category}</span>
        </div>
        <h4 class="card-title">${title}</h4>
        <p class="card-description">${description}</p>
        <div class="card-subtasks-progress">
            <div class="progress-container">
                <div class="progress-bar" style="width: ${progressPercentage}%;"></div>
            </div>
            <div class="task-counter">
                ${completedSubtasks}/${totalSubtasks} Subtasks
            </div>
        </div>
        <div class="card-footer">
            <div class="user">
                ${assignedUser}
            </div>
            <div class="priority ${priority}">
                ${priority}
            </div>
        </div>
    </div>
    `;
}