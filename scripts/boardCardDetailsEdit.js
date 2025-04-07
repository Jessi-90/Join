/**
 * Initializes the editable subtasks section within the board card edit overlay.
 * 
 * This includes setting up the input field for new subtasks and automatically focusing it.
 */
function initEditTaskSubtasks() {
    initSubtasksInput();            
    setFocusOnInput();       
}


/**
 * Handles global click events for managing overlay visibility and dropdown behavior.
 * 
 * This listener:
 * - Closes the assigned contacts dropdown if the user clicks outside of it.
 * - Closes the board card edit overlay when the close button is clicked or a click occurs outside the overlay.
 * - Prevents propagation when clicking inside the edit container to avoid unintended closures.
 * 
 * Note: Requires `isClickOutsideOverlay` and `closeBoardCardDetails()` to be defined elsewhere.
 * 
 * @param {MouseEvent} event - The click event triggered by the user.
 */
document.addEventListener('click', (event) => {
    const dropdown = document.getElementById('dropdownOptions');
    const dropdownToggle = document.getElementById('assignedDropdown');
    const editContainer = document.querySelector('.board-card-edit-container');
    const overlay = document.getElementById('boardCardDetails');

    if (
        dropdown && dropdownToggle &&
        !dropdown.contains(event.target) &&
        !dropdownToggle.contains(event.target)
    ) {
        dropdown.style.display = 'none';
    }
    
    if (editContainer && editContainer.contains(event.target)) {
        event.stopPropagation();
        return;
    }
    closeBoardCardDetails(event);
});


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
    setupDropdownToggle(); 

    requestAnimationFrame(() => {
        if (typeof initEditTaskSubtasks === 'function') {
            initEditTaskSubtasks(); 
        }
    });
}


/**
 * Initializes the toggle functionality for the 'assignedDropdown' element.
 * Removes any previous click event listener to avoid duplicates, then adds a new one.
 * Stops event propagation and toggles the dropdown visibility on click.
 */
function setupDropdownToggle() {
    const dropdown = document.getElementById('assignedDropdown');
    if (dropdown) {
  
        dropdown.removeEventListener('click', toggleDropdown);
      
        dropdown.addEventListener('click', function(event) {
            event.stopPropagation(); 
            toggleDropdown();
        });
    }
}


/**
 * Toggles the visibility of the 'dropdownOptions' element.
 * Switches between 'block' and 'none' display styles on each call.
 */
function toggleDropdown() {
    const dropdown = document.getElementById('dropdownOptions');
    if (dropdown) {
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    }
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
 * Displays the board card edit overlay and initializes its content.
 * 
 * If the edit overlay content has not been rendered yet, it injects the HTML template
 * and initializes necessary UI components (e.g. contact selection, priority buttons, subtasks).
 * 
 * Uses two nested `requestAnimationFrame` calls to ensure the DOM is ready before initialization.
 * Then triggers the overlay's animation and makes it visible.
 */
function showBoardCardDetailsEdit() {
    let boardCardOverlayRef = document.getElementById('boardCardDetails');

    if (!boardCardOverlayRef.querySelector('.board-card-edit-container')) {
        boardCardOverlayRef.innerHTML = cardDetailsEditOverlayHTMLTemplate();

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                initializeBoardCardEditContent();
            });
        });
    }

    boardCardOverlayRef.classList.remove('d-none');
    animateEditOverlay();
}


/**
 * Initializes the interactive elements of the board card edit overlay.
 * 
 * This includes setting up:
 * - the contact/user selection based on the assigned users of the current task,
 * - the priority button group,
 * - and the editable subtasks section.
 * 
 * Safely checks if each initializer function is defined before calling it.
 */
function initializeBoardCardEditContent() {
    const taskId = getCurrentlyViewedTaskId(); 
    const task = currentTasksData[taskId] || {};

    if (typeof initContactSelection === 'function') {
        initContactSelection(task.assignedUsers || []);
    }

    if (typeof initPriorityButtons === 'function') {
        initPriorityButtons();
    }

    if (typeof initEditTaskSubtasks === 'function') {
        initEditTaskSubtasks();
    }
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
    } else {
        console.error("No taskId provided in editTask");
    }
}


/**
 * Displays the board card detail overlay for a specific task.
 * 
 * This function prepares the overlay container, sets the current task ID,
 * clears any previous content, renders the task details, and animates the appearance.
 * 
 * @param {string} taskId - The ID of the task to be shown in the detail overlay.
 */
function showBoardCardDetails(taskId) {
    const task = currentTasksData[taskId];
    const addTaskOverlayRef = document.getElementById('boardCardDetails');

    addTaskOverlayRef.setAttribute('data-task-id', taskId);
    addTaskOverlayRef.innerHTML = '';

    renderBoardCardDetailsContent(taskId, task);

    addTaskOverlayRef.classList.remove('d-none');

    setTimeout(() => {
        const overlayContainerRef = document.querySelector('.board-card-detail-container');
        overlayContainerRef.classList.add('show');
    }, 10);
}


/**
 * Renders the content of the board card detail overlay for a given task.
 * 
 * This includes generating the HTML template with category-specific styling,
 * rendering the assigned users, and displaying the subtasks for the task.
 * 
 * @param {string} taskId - The ID of the task to render.
 * @param {Object} task - The task data object containing details like category, assigned users, and subtasks.
 */
function renderBoardCardDetailsContent(taskId, task) {
    const addTaskOverlayRef = document.getElementById('boardCardDetails');
    const categoryClassName = transformTaskCategoryToClassName(task.category);

    addTaskOverlayRef.innerHTML += cardDetailsOverlayHTMLTemplate(task, categoryClassName);
    renderCardDetailsAssignedUsers(task, taskId);
    renderCardDetailsSubtasks(task);
}


/**
 * Helper function to get the currently viewed task ID.
 */
function getCurrentlyViewedTaskId() {
    const overlay = document.getElementById('boardCardDetails');
    return overlay ? overlay.getAttribute('data-task-id') : null;
}


/**
 * Initializes the toggle functionality for the assigned user dropdown.
 * 
 * - Removes any previously attached click event listener to prevent duplicates.
 * - Adds a new click event listener to the 'assignedDropdown' element.
 * - On click, it prevents the event from bubbling up (to avoid unwanted closing)
 *   and toggles the visibility of the dropdown menu.
 * 
 * Relies on the 'toggleDropdown()' function and the presence of an element with the ID 'assignedDropdown'.
 */
function setupDropdownToggle() {
    const dropdown = document.getElementById('assignedDropdown');
    if (dropdown) {
        dropdown.removeEventListener('click', toggleDropdown); 
        dropdown.addEventListener('click', function(event) {
            event.stopPropagation(); 
            toggleDropdown();
        });
    }
}

