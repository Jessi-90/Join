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
        <div class="board-card-edit-content-wrapper">
            <div class="board-card-edit-content">
                <label for="editCardTitle">Title</label>
                <input type="text" name="editCardTitle" id="editCardTitle">
                <label for="editCardDescription">Description</label>
                <textarea name="editCardDescription" id="editCardDescription"></textarea>
                <label for="editCardDate">Due Date</label>
                <div class="date-input due-date-edit">
                <input type="date" name="editCardDate" id="editCardDate">
                <button onclick="setTodayDate()" type="button" class="calendar-button">
                                    <img src="../assets/icons/calender.svg" alt="Kalender öffnen">
                                </button>
                            </div>
                         <div>
                    <label>Prio</label>
                    <div class="prio-buttons prio-edit">
                        <button type="button" class="prio-btn urgent">Urgent <img class="urgent-image" src="../assets/icons/prio urgent.svg"></button>
                        <button type="button" class="prio-btn medium">Medium <img class="medium-image" src="../assets/icons/prio medium.svg"></button>
                        <button type="button" class="prio-btn low">Low <img src="../assets/icons/prio low.svg"></button>
                    </div>
                </div>
                <label for="assigned">Assigned to</label>
                <div class="custom-dropdown" id="assignedDropdown">
                    <div class="selected-option" onclick="toggleDropdown()">
                        Select contacts to assign
                        <img class="custom-arrow" src="../assets/icons/arrow_drop_down.svg" alt="Dropdown Arrow">
                    </div>
                    <ul class="dropdown-options" id="dropdownOptions"></ul>
                </div>
              <div id="selectedContactsContainer" class="selected-contacts-container"></div>
              <div class="form-group">
                            <label for="subtasks">Subtasks</label>
                            <div class="input-container">
                                <input type="text" id="subtasks" class="input-field" placeholder="Add new subtask">
                                <button id="standard-subtask-btn" class="subtask-btn plus-btn" onclick="setFocusOnInput(event)"></button>
                                <div id="subtask-controls" class="subtask-nav d-none">
                                    <button onclick="clearInputField(event)" id="clear-subtask-btn"
                                        class="subtask-btn clear-subtask-btn"></button>
                                    <div class="subtask-separator"></div>
                                    <button id="add-subtask-btn" class="subtask-btn add-subtask-btn"></button>
                                </div>
                            </div>
                            <ul id="subtask-list"></ul>
                        </div>     
                 </div>
            </div>
            <div class="card-edit-footer">
                <button class="btn-dark ok-btn">OK <img src="../assets/icons/check.svg" alt="check"></button>
            </div>
        </div>
    </div>
    `;
}
