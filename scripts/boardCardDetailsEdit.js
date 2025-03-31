/**
 * Closes the board card details overlay when the close button is clicked.
 * 
 * Listens for click events on elements with the class 'close-btn' and 
 * triggers the closeOverlay() function to hide the overlay.
 * 
 * @param {Event} event - The click event triggered by the user.
 */
document.addEventListener('click', (event) => {
       const closeButton = event.target.closest('.close-btn');
    if (closeButton) {
        const overlay = document.getElementById('boardCardDetails');
        const detailContainer = overlay.querySelector('.board-card-detail-container');
        const editContainer = overlay.querySelector('.board-card-edit-container');
        closeOverlay(overlay, detailContainer, editContainer);
    }
});


/**
 * Initializes the contact selection process by setting up the assigned users.
 * 
 * Creates a set of selected contacts based on the provided user list and 
 * asynchronously populates the contact list. Additionally, sets up the dropdown toggle.
 * 
 * @param {Array<Object>} assignedUsers - An array of user objects with a 'name' property.
 */
async function initContactSelection(assignedUsers = []) {
    selectedContacts = new Set(assignedUsers.map(user => user.name));
    await populateContacts(); 
    setupDropdownToggle(); 
}


/**
 * Sets up the click event listener for the assigned users dropdown.
 * 
 * This function checks if the assigned dropdown element exists and 
 * attaches the toggleDropdown function to its onclick event.
 */
function setupDropdownToggle() {
    const assignedDropdown = document.getElementById('assignedDropdown');
    if (assignedDropdown) {
        assignedDropdown.onclick = toggleDropdown; 
    }
}


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

    setTimeout(() => {
        initContactSelection();
      }, 50);
}


/**
 * Populates the basic task data (title, description, date) in the edit overlay.
 * 
 * @param {Object} task - The task object containing the data.
 */
function populateBasicTaskData(task) {
    const titleInput = document.getElementById('editCardTitle');
    const descriptionTextarea = document.getElementById('editCardDescription');
    const dateInput = document.getElementById('editCardDate');
    
    titleInput.value = task.title || '';
    descriptionTextarea.value = task.description || '';
    dateInput.value = task.dueDate || '';
}


/**
 * Populates the complex task data (assignees, subtasks, priority) in the edit overlay.
 * 
 * @param {Object} task - The task object containing the data.
 */
function populateComplexTaskData(task) {
    const assigneeSelect = document.getElementById('editCardAssignee');
    const subtasksList = document.querySelector('.edit-card-subtasks-list ul');
    const prioButtons = document.querySelectorAll('.prio-btn');
       
    subtasksList.innerHTML = '';
    if (task.subtasks && task.subtasks.length > 0) {
        task.subtasks.forEach(subtask => {
            const listItem = document.createElement('li');
            listItem.textContent = subtask.title || subtask;
            subtasksList.appendChild(listItem);
        });
    }
    prioButtons.forEach(button => {
        button.classList.remove('selected');
        if (button.classList.contains(task.priority.toLowerCase())) {
            button.classList.add('selected');
        }
    });
}


/**
 * Populates the Edit Card Details Overlay with task data.
 * 
 * @param {string|number} taskId - The unique identifier of the task.
 */
function populateEditOverlay(taskId) {
    const task = currentTasksData[taskId];  
    if (!task) {
        console.error(`Task with ID ${taskId} not found.`);
        return;
    }

    populateBasicTaskData(task);
    populateComplexTaskData(task);
    initContactSelection(task.assignedUsers || []);
    
    const overlay = document.getElementById('boardCardDetails');
    overlay.setAttribute('data-edit-task-id', taskId);
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
 * Initiates the editing process for a specific task.
 * 
 * Logs the task ID and, if valid, displays the edit overlay with task details 
 * and triggers the animation. If no task ID is provided, logs an error message.
 * 
 * @param {string|number} taskId - The unique identifier of the task to be edited.
 */
function editTask(taskId = getCurrentlyViewedTaskId()) {
    console.log("Editing Task ID:", taskId);  
    if (taskId) {
        showBoardCardDetailsEdit();   
        populateEditOverlay(taskId);    
        animateEditOverlay(true);     
    } else {
        console.error("No taskId provided in editTask");
    }
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
 * Handles the click event to determine whether the board card details overlay should be closed.
 * 
 * This function checks if the click event occurred on specific elements that should prevent closing 
 * (like the edit button), or on elements that indicate a close action (like the close button or 
 * clicking outside the overlay). If a close action is detected, it calls the closeOverlay function.
 * 
 * @param {Event} event - The click event that triggered the function.
 */
function handleCloseClick(event) {
    let overlay = document.getElementById('boardCardDetails');
    let detailContainer = overlay.querySelector('.board-card-detail-container');
    let editContainer = overlay.querySelector('.board-card-edit-container');

    if (event.target.closest('.card-detail-edit-btn')) {
        return;
    }

    if (event.target.closest('.close-btn')) {
        closeOverlay(overlay, detailContainer, editContainer);
        return;
    }

    if (!event.target.closest('.board-card-detail-container') && 
        !event.target.closest('.board-card-edit-container')) {
        closeOverlay(overlay, detailContainer, editContainer);
    }
}


/**
 * Closes the board card details overlay with an animation.
 * 
 * This function removes the 'show' class from the detail and edit containers,
 * then hides the overlay after a delay to allow for a smooth transition.
 * 
 * @param {HTMLElement} overlay - The overlay element to be hidden.
 * @param {HTMLElement} detailContainer - The container for card details.
 * @param {HTMLElement} editContainer - The container for editing card details.
 */

function closeOverlay(overlay, detailContainer, editContainer) {
    if (detailContainer) detailContainer.classList.remove('show');
    if (editContainer) editContainer.classList.remove('show');
    setTimeout(() => {
        overlay.classList.add('d-none');
    }, 300);
}



