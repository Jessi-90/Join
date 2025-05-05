/**
 * Generates the HTML template for displaying detailed information about a task
 * in the board card details overlay.
 *
 * @param {Object} task - The task object containing the details to be displayed.
 * @param {string} task.title - The title of the task.
 * @param {string} task.description - A brief description of the task.
 * @param {string} task.category - The category of the task.
 * @param {string} task.dueDate - The due date of the task.
 * @param {string} task.priority - The priority level of the task (e.g., "Low", "Medium", "High").
 * @param {Object} task.assignedUsers - The users assigned to the task.
 * @param {Object} task.subtasks - The subtasks related to the task.
 * @param {string} categoryClassName - The CSS class name corresponding to the task category.
 * 
 * @returns {string} The HTML string representing the board card details overlay.
 */
function cardDetailsOverlayHTMLTemplate(task, categoryClassName) {
    const priorityImage = getPriorityImage(task.priority);
    return `
        <div class="board-card-detail-container" id="boardCardDetailContainer">
            <div class="board-card-detail-header">
                <span class="card-category card-category-detail ${categoryClassName}">${task.category}</span>
                <button class="close-btn" onclick="closeBoardCardDetails(event)"><img src="../assets/icons/close_btn.svg" alt="close" /></button>
            </div>
            <h4 class="card-detail-title">${task.title}</h4>
            <p class="card-detail-description">${task.description}</p>
            <div class="card-detail-due-date">
                <p class="card-detail-list-title">Due Date:</p>
                <p>${task.dueDate}</p> 
            </div>
            <div class="card-detail-priority">
                <p class="card-detail-list-title">Priority:</p>
                <div class="card-detail-priority-content">
                    <p>${task.priority}</p>
                    <img class="card-priority" src="${priorityImage}" alt="priority" />
                </div>
            </div>
            <div class="card-detail-assignee">
                <p class="card-detail-list-title">Assigned To:</p>
                <div class="card-detail-assignee-content" id="cardDetailAssigneeContent">
                    ${generateAssigneeHTML(task)}
                </div>
            </div>
            <div class="card-detail-subtasks">
                <p class="card-detail-list-title">Subtasks:</p>
                <div class="card-detail-subtasks-content" id="cardDetailSubtasksContent">
                    ${generateSubtasksHTML(task.subtasks)}
                </div>
            </div>
            <div class="card-detail-footer">
                <button class="card-detail-delete-btn btn-no-bg" onclick="deleteTask(event)"></button>
                <button class="card-detail-edit-btn btn-no-bg" onclick="editTask(getCurrentlyViewedTaskId())"></button>
            </div>
        </div>
    `;
}

/**
 * Generates an HTML template for displaying an assignee in the task detail view.
 *
 * @param {Object} task - The task object containing assigned users.
 * @param {number|string} assigneeId - The unique identifier of the assignee.
 * @param {number|string} taskId - The unique identifier of the task.
 * @returns {string} The HTML string representing the assignee's details.
 */
function cardDetailAssigneeContentTemplate(task, assigneeId, taskId) {
    return `
        <div class="card-detail-assignee-user">
            <div id="user-icons-${taskId}-detail-${assigneeId}" class="user"></div>
            <p>${task.assignedUsers[assigneeId]}</p>
        </div>
    `;
}

/**
 * Generates an HTML template for displaying a subtask in the task detail view.
 *
 * @param {Object} subtask - The subtask object containing its details.
 * @param {number|string} subtask.id - The unique identifier of the subtask.
 * @param {string} subtask.title - The title of the subtask.
 * @param {boolean} subtask.completed - Indicates whether the subtask is completed.
 * @returns {string} The HTML string representing the subtask element.
 */
function cardDetailSubtasksContentTemplate(subtask) {
    return `
     <div class="card-detail-subtasks-tasks">
         <label class="custom-checkbox">
             <input type="checkbox" id="${subtask.id}" name="${subtask.id}" ${subtask.completed ? 'checked' : ''}>
             <span class="checkmark"></span>
             <span class="subtask-title">${subtask.title}</span>
         </label>
     </div>
 `;
}