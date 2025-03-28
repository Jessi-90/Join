/**
 * Shows the Edit Card Details Overlay.
 * Clears previous content and sets up the basic structure if not already present.
 */
function showBoardCardDetailsEdit() {
    let boardCardOverlayRef = document.getElementById('boardCardDetails');
    
    if (!boardCardOverlayRef.querySelector('.board-card-edit-container')) {
        boardCardOverlayRef.innerHTML = cardDetailsEditOverlayHTMLTemplate();
    }

    boardCardOverlayRef.classList.remove('d-none');
    animateEditOverlay();
}


/**
 * Populates the Edit Card Details Overlay with task data.
 * 
 * @param {string|number} taskId - The unique identifier of the task.
 */
function populateEditOverlay(taskId) {
    const task = currentTasksData[taskId];

    document.getElementById('editCardTitle').value = task.title;
    document.getElementById('editCardDescription').value = task.description;
    document.getElementById('editCardDate').value = task.dueDate;

    const priorityButtons = document.querySelectorAll('.prio-btn');
    priorityButtons.forEach(btn => btn.classList.remove('active'));

    if (task.priority) {
        const prioBtn = document.querySelector(`.prio-btn.${task.priority.toLowerCase()}`);
        if (prioBtn) prioBtn.classList.add('active');
    }

    renderCardDetailsAssignedUsers(task, taskId);
    renderCardDetailsSubtasks(task);
}


/**
 * Controls the animation of the Edit Card Details Overlay.
 * 
 * @param {boolean} animate - Whether to animate the overlay.
 */
function animateEditOverlay(animate = true) {
    let overlayContainerRef = document.querySelector('.board-card-edit-container');
    overlayContainerRef.style.position = 'absolute';
    overlayContainerRef.classList.add('show');

    if (animate) {
        setTimeout(() => {
            overlayContainerRef.style.transition = "transform 0.3s ease";
            overlayContainerRef.classList.add('show');
        }, 10);
    } else {
        overlayContainerRef.style.transition = "none";
    }
}


/**
 * Initiates the process to show the edit view of a task.
 * 
 * @param {string|number} taskId - The unique identifier of the task.
 * @param {boolean} animate - Whether to animate the overlay.
 */
function editTask(taskId, animate = true) {
    showBoardCardDetailsEdit();     
    populateEditOverlay(taskId);     
    animateEditOverlay(animate);    
}


/**
 * Displays the details of a specific task in the board's card detail overlay.
 * Adds an Edit button to switch to the edit view.
 * 
 * @param {string|number} taskId - The unique identifier of the task.
 */
function showBoardCardDetails(taskId) {
    const task = currentTasksData[taskId];
    let addTaskOverlayRef = document.getElementById('boardCardDetails');
    addTaskOverlayRef.setAttribute('data-task-id', taskId);
    addTaskOverlayRef.innerHTML = '';
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
 * Helper function to get the currently viewed task ID.
 */
function getCurrentlyViewedTaskId() {
    const overlay = document.getElementById('boardCardDetails');
    return overlay ? overlay.getAttribute('data-task-id') : null;
}


/**
 * Renders the subtasks for a given task in the task edit view.
 *
 * @param {Object} task - The task object containing subtasks.
 */
function renderCardDetailsSubtasks(task) {
    const subtasksContent = document.getElementById('cardDetailSubtasksContent');
    subtasksContent.innerHTML = '';
    const subtasksArray = generateSubtasksArray(task);
    for (let subtaskIndex = 0; subtaskIndex < subtasksArray.length; subtaskIndex++) {
        const subtask = subtasksArray[subtaskIndex];
        subtasksContent.innerHTML += cardDetailSubtasksContentTemplate(subtask);
    }
}


/**
 * Closes the Edit Card Details Overlay, if clicked outside the container or the close button.
 * Clicks inside the container prevent closing.
 * The overlay will be hidden with a delay.
 * 
 * @param {Event} event - click-event.
 */
function closeBoardCardDetails(event) {
    let overlay = document.getElementById('boardCardDetails');
    let overlayContainer = document.getElementById('boardCardDetailContainer');

    if (event.target.closest('.card-detail-edit-btn')) {
        event.stopPropagation();
        return;
    }

    if (event.target.closest('.board-card-detail-container') && !event.target.closest('.close-btn')) {
        event.stopPropagation();
        return;
    }

    overlayContainer.classList.remove('show');
    setTimeout(() => {
        overlay.classList.add('d-none');
    }, 300);
}