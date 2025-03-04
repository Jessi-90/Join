/**
 * Generates an HTML template string for displaying the Edit Task overlay.
 *
 * @returns {string} The HTML template as a string.
 */
function cardDetailsEditOverlayHTMLTemplate() {
    return `
    <div class="board-card-edit-container">
            <div class="board-card-edit-header">
                <button class="close-btn"><img src="../assets/icons/close_btn.svg" alt="close"/></button>
            </div>
            <div class="board-card-edit-content-wrapper"></div>
                <div class="board-card-edit-content">
                    <label for="editCardTitle">Title</label>
                    <input type="text" name="editCardTitle" id="editCardTitle">
                    <label for="editCardDescription">Description</label>
                    <textarea name="editCardDescription" id="editCardDescription"></textarea>
                    <label for="editCardDate">Due Date</label>
                    <input type="date" name="editCardDate" id="editCardDate">
                    <div>
                        <label>Prio</label>
                            <div class="prio-buttons">
                                <button type="button" class="prio-btn urgent">Urgent <img class="urgent-image"
                                        src="../img/icon/Prio alta.svg"></button>
                                <button type="button" class="prio-btn medium">Medium <img class="medium-image"
                                        src="../img/icon/Prio media (1).svg"></button>
                                <button type="button" class="prio-btn low">Low <img src="../img/icon/Prio baja.svg"></button>
                            </div>
                    </div>
                    <label for="editCardAssignee">Assigned to</label>
                    <select name="editCardAssignee" id="editCardAssignee">
                        <option value="user_1">User 1</option>
                    </select>
                    <div class="edit-card-users">
                        <img src="../assets/icons/Profile badge1.svg" alt="User" class="user-avatar" />
                        <img src="../assets/icons/Profile badge2.svg" alt="User" class="user-avatar" />
                        <img src="../assets/icons/Profile badge3.svg" alt="User" class="user-avatar" />
                    </div>
                    <label for="editCardSubtasks">Subtasks</label>
                    <input type="text" name="editCardSubtasks" id="editCardSubtasks" placeholder="Add new subtask">
                    <div class="edit-card-subtasks-list">
                        <ul>
                            <li>Implement Recipe Recommendation</li>
                            <li>Start Page Layout</li>
                        </ul>
                    </div>
                </div> 
                <div class="card-edit-footer">
                    <button class="btn-dark ok-btn">OK <img src="../assets/icons/check.svg" alt="check"></button>
                </div>
            </div>
        </div>
    `;
}