/**
 * Generates the HTML template for a board card based on the provided task data.
 * 
 * @function boardCardTemplate
 * @param {string} taskId - The unique ID of the task.
 * @param {string} category - The category of the task (e.g., "User Story").
 * @param {string} title - The title of the task.
 * @param {string} description - The truncated description of the task.
 * @param {number} progressPercentage - The completion percentage of the subtasks.
 * @param {number} completedSubtasks - The number of completed subtasks.
 * @param {number} totalSubtasks - The total number of subtasks.
 * @param {Array<Object>} assignedUsers - An array of assigned user objects.
 * @param {string} assignedUsers[].firstName - The first name of the assigned user.
 * @param {string} assignedUsers[].lastName - The last name of the assigned user.
 * @param {string} priorityImage - The file path of the priority icon based on the task priority.
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
    assignedUsers, 
    priorityImage
) {
    return `
    <div class="card" id="${taskId}" draggable="true">
        <div class="card-header">
            <span class="card-category" id="category-task">${category}</span>
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
                ${generateUserAvatars(assignedUsers)}
            </div>
            <div class="card-priority">
                <img id="card-priority-img" src="${priorityImage}" alt="priority">
            </div>
        </div>
    </div>
    `;
}


