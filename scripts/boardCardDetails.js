/**
 * Displays the details of a specific task in the board's card detail overlay.
 * It retrieves task data, generates the overlay content, and renders assigned users and subtasks.
 *
 * @param {string|number} taskId - The unique identifier of the task.
 */
function showBoardCardDetails(taskId) {
    const task = currentTasksData[taskId];
    let addTaskOverlayRef = document.getElementById('boardCardDetails');
    addTaskOverlayRef.innerHTML = "";
    const categoryClassName = transformTaskCategoryToClassName(task.category);
    addTaskOverlayRef.innerHTML += cardDetailsOverlayHTMLTemplate(task, categoryClassName);
    renderCardDetailsAssignedUsers(currentTasksData[taskId], taskId);
    renderCardDetailsSubtasks(task);
    addTaskOverlayRef.classList.remove('d-none');
    setTimeout(() => {
        let overlayContainerRef = document.querySelector('.board-card-detail-container');
        overlayContainerRef.classList.add('show');
    }, 10);
}


/**
 * Closes the board card details overlay when the user clicks outside the container
 * or on the close button. If the click is inside the container (excluding the close button),
 * the event is ignored.
 *
 * @param {Event} event - The click event that triggered the function.
 */
function closeBoardCardDetails(event) {
    let overlay = document.getElementById('boardCardDetails');
    let overlayContainer = document.getElementById('boardCardDetailContainer');

    updateTasksInDatabase(currentTasksData);
    if (event.target.closest('.board-card-edit-container') || event.target.closest('.input-container')) {
        event.stopPropagation();
        return;
    }

    if (event.target.closest('.close-btn')) {
        overlayContainer.classList.remove('show');

        setTimeout(() => {
            overlay.classList.add('d-none');
        }, 300);
    }
}

/**
 * Renders the assigned users for a task in the task detail view.
 *
 * @param {Object} task - The task object containing assigned users.
 * @param {number|string} taskId - The unique identifier of the task.
 */
function renderCardDetailsAssignedUsers(task, taskId) {
    const assignedUsersContent = document.getElementById('cardDetailAssigneeContent');
    assignedUsersContent.innerHTML = "";
    for (let assigneeIndex = 0; assigneeIndex < task.assignedUsers.length; assigneeIndex++) {
        assignedUsersContent.innerHTML += cardDetailAssigneeContentTemplate(task, assigneeIndex, taskId);
        const user = [task.assignedUsers[assigneeIndex]];
        generateUserAvatars(user, `${taskId}-detail-${assigneeIndex}`);
    }
}

/**
 * Renders the subtasks for a given task in the task detail view.
 *
 * @param {Object} task - The task object containing subtasks.
 */
function renderCardDetailsSubtasks(task) {
    const subtasksContent = document.getElementById('cardDetailSubtasksContent');
    subtasksContent.innerHTML = "";
    const subtasksArray = generateSubtasksArray(task);
    for (let subtaskIndex = 0; subtaskIndex < subtasksArray.length; subtaskIndex++) {
        const subtask = subtasksArray[subtaskIndex];
        subtasksContent.innerHTML += cardDetailSubtasksContentTemplate(subtask);
    }
    setupSubtaskEventListeners(task.id);
}

/**
 * Converts the subtasks object of a task into an array of subtask objects.
 *
 * @param {Object} task - The task object containing subtasks.
 * @param {Object} task.subtasks - An object where keys are subtask IDs and values are subtask data.
 * @returns {Array} An array of subtask objects, each containing an `id` and its corresponding subtask data.
 */
function generateSubtasksArray(task) {
    const subtasksArray = Object.entries(task.subtasks).map(([id, data]) => ({
        id,
        ...data
    }));
    return subtasksArray;
}

/**
 * Transforms a task category string into a valid CSS class name format.
 * Converts the string to lowercase and replaces spaces with hyphens.
 *
 * @param {string} taskCategory - The task category name.
 * @returns {string} The transformed category name formatted as a CSS class name.
 */
function transformTaskCategoryToClassName(taskCategory) {
    const categoryClassName = taskCategory.toLowerCase().replace(/\s+/g, '-');
    return categoryClassName;
}

/**
 * Attaches change event listeners to all subtask checkboxes in the task detail view.
 * 
 * When a checkbox is toggled, the corresponding subtask's completion state is updated
 * using the `updateSubtaskState` function.
 *
 * @param {string} taskId - The unique identifier of the task whose subtasks are being tracked.
 */
function setupSubtaskEventListeners(taskId) {
    const checkboxes = document.querySelectorAll('#cardDetailSubtasksContent input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const subtaskId = e.target.id;
            const isChecked = e.target.checked;
            updateSubtaskState(subtaskId, isChecked);
            });
    });
}


/**
 * Updates the completion state of a specific subtask for the currently open task.
 * 
 * Retrieves the current open task from the DOM, identifies the subtask by its ID,
 * and sets its `completed` property to the provided checkbox state.
 * The updated subtask state is stored back in the global `currentTasksData`.
 *
 * @param {string} subtaskId - The unique identifier of the subtask to update.
 * @param {boolean} isChecked - Indicates whether the subtask is completed (`true`) or not (`false`).
 */
function updateSubtaskState(subtaskId, isChecked) {
    const currentOpenTask = document.getElementById("boardCardDetails");
    const taskId = currentOpenTask.dataset.taskId;
    const task = currentTasksData[taskId];
    const subtask = task.subtasks[subtaskId];
    if (subtask) {
        subtask.completed = isChecked;
        currentTasksData[taskId].subtasks[subtaskId].completed = isChecked;  
    }
}