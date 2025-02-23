function showAddTaskOverlayHTMLTemplate() {
    return `
    <div class="container">
        <h1>Add Task</h1>
        <button class="close-button" onclick="closeAddTaskOverlay()">
        <form>
            <div class="form-container">
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
                        <label for="assigned">Assigned to</label>
                        <div class="custom-select-wrapper">
                            <select id="assigned">
                                <option>Select contacts to assign</option>
                            </select>
                            <img class="custom-arrow" src="../img/icon/arrow_drop_down.svg" alt="Dropdown Arrow">
                        </div>
                    </div>
                </div>

                <div class="divider"></div>

                <div class="form-column-right">
                    <div class="form-group">
                        <label for="due-date">Due date<span class="star">*</span></label>
                        <div class="date-input">
                            <input id="due-date" required placeholder="dd/mm/yyyy">
                            <button type="button" class="calendar-button">
                                <img src="../img/icon/event.svg" alt="Kalender öffnen">
                            </button>
                        </div>
                        <span class="error-message">This field is required</span>
                    </div>

                    <div class="form-group">
                        <label>Prio</label>
                        <div class="prio-buttons">
                            <button type="button" class="prio-btn urgent">Urgent <img class="urgent-image"
                                    src="../img/icon/Prio alta.svg"></button>
                            <button type="button" class="prio-btn medium">Medium <img class="medium-image"
                                    src="../img/icon/Prio media (1).svg"></button>
                            <button type="button" class="prio-btn low">Low <img src="../img/icon/Prio baja.svg"></button>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="category">Category<span class="star">*</span></label>
                        <div class="custom-select-wrapper">
                            <select id="category" required>
                                <option>Select task category</option>
                                <option>Technical Task</option>
                                <option>User Story</option>
                            </select>
                            <img class="custom-arrow" src="../img/icon/arrow_drop_down.svg" alt="Dropdown Arrow">
                        </div>
                        <span class="error-message">This field is required</span>
                    </div>

                    <div class="form-group">
                        <label for="subtasks">Subtasks</label>
                        <div class="input-container">
                            <input type="text" class="input-field" placeholder="Add new subtask">
                            <button class="plus-button">+</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="buttons">
                <button type="reset" class="clear">Clear <img src="../img/icon/iconoir_cancel.svg"></button>
                <button type="submit" class="create">Create Task <img src="../img/icon/check.svg"></button>
            </div>
        </form>

        <div class="field-required">
            <span class="star">*</span>
            <p class="note">This field is required</p>
        </div>
    </div>
    `;
}