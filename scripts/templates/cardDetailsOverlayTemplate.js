/**
 * Generates an HTML template string for displaying task details in an overlay.
 *
 * @param {Object} task - The task object containing details.
 * @param {string} task.category - The category of the task.
 * @param {string} task.title - The title of the task.
 * @param {string} task.description - A description of the task.
 * @param {string} task.dueDate - The due date of the task.
 * @param {string} task.priority - The priority level of the task.
 * @returns {string} The HTML template as a string.
 */
function cardDetailsOverlayHTMLTemplate(task) {
    return `
        <div class="board-card-detail-container" id="boardCardDetailContainer">
            <div class="board-card-detail-header">
                <span class="card-category ${task.category}">${task.category}</span>
                <button class="close-btn"><img src="../assets/icons/close_btn.svg" alt="close" /></button>
            </div>
            <h4 class="card-detail-title">${task.title}</h4>
            <p class="card-detail-description">${task.description}</p>
            <div class="card-detail-due-date">
                <p class="card-detail-list-title">Due Date:</p>
                <p>${task.dueDate}</p>
            </div>
            <div class="card-detail-priority">
                <p class="card-detail-list-title">Priority:</p>
                <div class="card-deatil-priority-content">
                    <p>${task.priority}</p>
                    <img class="card-priority" src="../assets/icons/Priority-normal.svg" alt="priority" />
                </div>
            </div>
            <div class="card-detail-assignee">
                <p class="card-detail-list-title">Assigned To:</p>
                <div class="card-deatil-assignee-content">
                    <div class="card-detail-assignee-user">
                        <img src="../assets/icons/Profile badge1.svg" alt="User" class="user-avatar" />
                        <p>Anton Mayer</p>
                    </div>
                    <div class="card-detail-assignee-user">
                        <img src="../assets/icons/Profile badge2.svg" alt="User" class="user-avatar" />
                        <p>Emmanuel Mauer</p>
                    </div>
                    <div class="card-detail-assignee-user">
                        <img src="../assets/icons/Profile badge3.svg" alt="User" class="user-avatar" />
                        <p>Marcel Bauer</p>
                    </div>
                </div>
            </div>
            <div class="card-detail-subtasks">
                <p class="card-detail-list-title">Subtasks:</p>
                <div class="card-deatil-subtasks-content">
                    <div class="card-deatil-subtasks-tasks">
                        <input type="checkbox" id="subtask1" name="subtask1" value="subtask1">
                        <label for="subtask1">Implement Recipe Recommendation</label>
                    </div>
                    <div class="card-deatil-subtasks-tasks">
                        <input type="checkbox" id="subtask2" name="subtask2" value="subtask2">
                        <label for="subtask2">Start Page Layout</label>
                    </div>
                </div>
            </div>
            <div class="card-detail-footer">
                <button class="card-detail-delete-btn btn-no-bg" onclick="deleteTask()"></button>
                <button class="card-detail-edit-btn btn-no-bg" onclick="editTask()"></button>
            </div>
        </div>
          `;
}