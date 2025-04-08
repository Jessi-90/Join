function initEditTaskSubtasks() {
    initSubtasksInput();            
    setFocusOnInput();       
}


/**
 * Initializes the contact selection dropdown and pre-selects assigned users.
 * 
 * Converts the provided list of assigned users into a Set of selected contact names,
 * populates the contact list in the dropdown, and sets up the dropdown toggle behavior.
 * After rendering, it also initializes the subtask input functionality if available.
 * 
 * @async
 * @param {Array<Object>} [assignedUsers=[]] - An array of user objects with a 'name' property.
 */
async function initContactSelection(assignedUsers = []) {
    selectedContacts = new Set(assignedUsers.map(user => user.name));
    await populateContacts();  
    requestAnimationFrame(() => {
        if (typeof initEditTaskSubtasks === 'function') {
            initEditTaskSubtasks(); 
        }
    });
}


/**
 * Creates an object to manage contact selection within a specified container.
 * 
 * @param {string} [containerId='assignedDropdown'] - The ID of the container element.
 * @returns {Object} An object with methods to initialize contact selection and toggle the dropdown.
 */
function setupContactSelection(containerId = 'assignedDropdown') {
    return {
        init: (users) => initContactSelection(users),
        toggle: toggleDropdown
    };
}


/**
 * Displays and initializes the edit overlay for a board task card.
 * 
 * Injects the edit HTML template into the overlay if it hasn't been rendered yet.
 * Initializes contact selection, priority buttons, and subtask input functionality.
 * Also makes the overlay visible and triggers its appearance animation.
 * Adds a click event listener to handle dropdown interactions.
 * 
 * This function safely checks if dependent functions exist before calling them.
 */
function showBoardCardDetailsEdit() {
    let boardCardOverlayRef = document.getElementById('boardCardDetails');

    if (!boardCardOverlayRef.querySelector('.board-card-edit-container')) {
        boardCardOverlayRef.innerHTML = cardDetailsEditOverlayHTMLTemplate();
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                if (typeof initContactSelection === 'function') {
                    const taskId = getCurrentlyViewedTaskId(); 
                    const task = currentTasksData[taskId] || {};
                    initContactSelection(task.assignedUsers || []);
                } else {
                    console.error('initContactSelection nicht gefunden!');
                }
                if (typeof initPriorityButtons === 'function') {
                    initPriorityButtons();
                } else {
                    console.error('initPriorityButtons nicht gefunden!');
                }
                if (typeof initEditTaskSubtasks === 'function') {
                    initEditTaskSubtasks();
                }
            });
        });
    }

    boardCardOverlayRef.classList.remove('d-none');
    animateEditOverlay();
}


/**
 * Helper function to determine if a click should keep the dropdown open.
 * 
 * @param {Event} event - The click event to evaluate.
 * @param {Element} toggleButton - The element that toggles the dropdown.
 * @param {Element} dropdown - The dropdown element itself.
 * @returns {boolean} Returns true if the dropdown should remain open.
 */
function shouldKeepDropdownOpen(event, toggleButton, dropdown) {
    return (toggleButton && toggleButton.contains(event.target)) ||
           (dropdown && dropdown.contains(event.target));
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
 * Populates the complex task data such as subtasks in the edit overlay.
 * 
 * Checks if the task contains a valid subtasks array and passes it to populateSubtasks().
 * 
 * @param {Object} task - The task object containing subtasks.
 */
function populateComplexTaskData(task) {
    const subtasks = task.subtasks;
    if (!Array.isArray(subtasks) || subtasks.length === 0) return;
    populateSubtasks(subtasks);
}


/**
 * Populates the subtask list in the edit overlay with existing subtasks.
 * 
 * Iterates over the given subtasks array, creates DOM elements for each subtask, 
 * attaches click event listeners, and appends them to the subtask list container.
 * 
 * @param {Array<Object|string>} subtasks - An array of subtask objects or strings.
 * Each subtask should either be an object with a 'title' property or a string.
 */
function populateSubtasks(subtasks) {
    if (!Array.isArray(subtasks)) {
        console.error("populateSubtasks erwartet ein Array, erhalten:", subtasks);
        return;
    }
    const subtasksList = document.getElementById('subtask-list');
    if (!subtasksList) {
        console.warn("Subtask-List Element nicht gefunden!");
        return;
    }
    subtasksList.innerHTML = '';

    subtasks.forEach((subtask) => {
        const subtaskElement = createSubtaskElement(subtask.title || subtask);
        addClickEventToSubtask(subtaskElement);
        subtasksList.appendChild(subtaskElement);
    });
}


/**
 * Populates the Edit Card Details Overlay with task data.
 * 
 * @param {string|number} taskId - The unique identifier of the task.
 * Retrieves the task data and populates basic and complex information.
 * Attempts to initialize contact selection with assigned users, logging an error if it fails.
 */
function populateEditOverlay(taskId) {
    const task = currentTasksData[taskId];
    
    populateBasicTaskData(task);
    populateComplexTaskData(task);

    try {
        initContactSelection(task.assignedUsers || []);
    } catch (e) {
        console.error('Fehler in initContactSelection:', e);
    }
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
    if (taskId) {
        showBoardCardDetailsEdit();   
        populateEditOverlay(taskId);    
        animateEditOverlay(true);
        setTimeout(() => {
            initializeDropdown();  
        }, 10);
           
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