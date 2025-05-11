/**
 * Generates an HTML template string for displaying the Add Task overlay.
 *
 * @returns {string} The HTML template as a string.
 */
function showAddTaskOverlayHTMLTemplate() {
    return `
    <div class="add-task-overlay-container">
        <div class="add-task-overlay-header">
            <h1>Add Task</h1>
            <button class="close-btn" onclick="closeAddTaskOverlay(event)">
                <img src="../assets/icons/close_btn.svg" alt="close">
            </button>
        </div>
             <form>
                <div class="form-container" id="taskForm">
                    <div class="form-column-left">
                        <div class="form-group">
                            <label for="title">Title<span class="star">*</span></label>
                            <input type="text" id="title" placeholder="Enter a title" required>
                            <span class="error-message">This field is required</span>
                        </div>
                        <div class="form-group">
                            <label for="description">Description</label>
                            <textarea id="description" placeholder="Enter a Description"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="due-date">Due date<span class="star">*</span></label>
                            <input type="text" name="due-date" id="datepicker" readonly>
                            <span class="error-message">This field is required</span>
                        </div>
                    </div>
                    <div class="divider"></div>
                    <div class="form-column-right">
                        <div class="form-group">
                            <label>Prio</label>
                            <div class="prio-buttons">
                                <button type="button" class="prio-btn urgent">Urgent <img class="urgent-image"
                                        src="../assets/icons/prio urgent.svg"></button>
                                <button type="button" class="prio-btn medium">Medium <img class="medium-image"
                                        src="../assets/icons/prio medium.svg"></button>
                                <button type="button" class="prio-btn low">Low <img
                                        src="../assets/icons/prio low.svg"></button>
                            </div>
                        </div>
                        <div class="form-group assigend-to-group">
                            <label for="assigned">Assigned to</label>
                            <div class="custom-dropdown" id="assignedDropdown">
                                <div class="selected-option">
                                    Select contacts to assign
                                    <img class="custom-arrow" src="../assets/icons/arrow_drop_down.svg"
                                        alt="Dropdown Arrow">
                                </div>
                                <ul class="dropdown-options d-none" id="dropdownOptions"></ul>
                            </div>
                            <div id="selectedContactsContainer" class="selected-contacts-container"></div>
                        </div>
                        <div class="form-group">
                            <label for="category">Category<span class="star">*</span></label>
                            <div class="custom-select-wrapper">
                                <select id="category" required>
                                    <option>Select task category</option>
                                    <option>Technical Task</option>
                                    <option>User Story</option>
                                </select>
                                <img class="custom-arrow" src="../assets/icons/arrow_drop_down.svg" alt="Dropdown Arrow">
                            </div>
                            <span class="error-message">This field is required</span>
                        </div>
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
                <div class="buttons">
                    <button onclick="clearFormAndData()" type="reset" class="clear btn-light" id="clear-button">
                        Clear
                        <img id="clear-icon" src="../assets/icons/cancel.svg">
                    </button>
                    <button type="submit" class="create" id="create-task" onclick="sendTaskFormToDb()" disabled>
                        Create Task
                        <img src="../assets/icons/check.svg">
                    </button>
                </div>
            </form>
            <div class="field-required">
                <span class="star">*</span>
                <p class="note">This field is required</p>
            </div>
        </div>
    `;
}