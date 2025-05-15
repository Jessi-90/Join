function initEditTaskSubtasks() {
    initSubtasksInput();
    setFocusOnInput();
}

/**
 * Handles global click events for managing overlay visibility and dropdown behavior.
 * This listener:
 * - Closes the assigned contacts dropdown if the user clicks outside of it.
 * - Closes the board card edit overlay when the close button is clicked or a click occurs outside the overlay.
 * - Prevents propagation when clicking inside the edit container to avoid unintended closures.
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
        dropdown.classList.add('d-none');
    }

    if (editContainer && editContainer.contains(event.target)) {
        event.stopPropagation();
        return;
    }
    // closeBoardCardDetails(event);
});


/**
 * Waits for the DOM to be fully loaded before executing any code that interacts with the page elements.
 * 
 * - Looks for an element with the ID 'ok-button'.
 * - If found, adds a click event listener to it.
 * - When clicked, the button triggers saving the edited task and closing the task details overlay.
 */
document.addEventListener('DOMContentLoaded', (event) => {
    const okButton = document.getElementById('ok-button');
    if (okButton) {
        okButton.addEventListener('click', () => {
            saveEditedTask();
            closeBoardCardDetails(event);
        });
    }
});


/**
 * Initializes the contact selection dropdown and pre-selects assigned users.
 * 
 * Converts the provided list of assigned users into a Set of selected contact names,
 * populates the contact list in the dropdown, and sets up the dropdown toggle behavior.
 * After rendering, it also initializes the subtask input functionality if available.
 * @async
 * @param {Array<Object>} [assignedUsers=[]] - An array of user objects with a 'name' property.
 */
async function initContactSelection(assignedUsers = []) {
    selectedContacts = new Set(assignedUsers.map(user => user.name || user));
    await populateContacts();
    
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
        dropdown.addEventListener('click', function (event) {
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
        addCloseListener(getParentContainer())
        dropdown.classList.toggle('d-none');
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
 * Shows the editable overlay for a board card.
 * Renders it if not already present, makes it visible, and starts the animation.
 */
function showBoardCardDetailsEdit() {
    const boardCardOverlayRef = document.getElementById('boardCardDetails');
    const taskId = getCurrentlyViewedTaskId();

    if (!boardCardOverlayRef.querySelector('.board-card-edit-container')) {
        renderEditOverlayTemplate(boardCardOverlayRef);
        initializeDatepicker("#datepicker");
        
        // ⚠️ Problem 2: Direktes Setzen der Basisdaten hier, 
        // ohne initContactSelection aufzurufen
        const task = currentTasksData[taskId] || {};
        
        // Grundlegende Aufgabendaten setzen
        setTimeout(() => {
            populateBasicTaskData(task);
            populateSubtasks(normalizeSubtasks(task.subtasks));

            
            // Prioritätsbutton setzen
            if (typeof initPriorityButtons === 'function') {
                initPriorityButtons({ skipDefault: true });
            }
            
            // Avatare rendern
            if (typeof prepareContacts === 'function' && typeof renderAvatars === 'function') {
                const contacts = prepareContacts(currentContactsData);
                selectedContacts = new Set(task.assignedUsers?.map(user => user.name || user) || []);
                renderAvatars(contacts);
            }
        }, 50);
    }

    boardCardOverlayRef.classList.remove('d-none');
}


function normalizeSubtasks(subtasks) {
    if (Array.isArray(subtasks)) return subtasks;
    if (subtasks && typeof subtasks === 'object') return Object.values(subtasks);
    return [];
}


/**
 * Renders the HTML template for the edit overlay inside the specified container.
 * 
 * - Replaces the container's content with the edit overlay template.
 * - Uses `requestAnimationFrame` twice to defer the initialization of overlay content
 *   until after the DOM has been updated and painted.
 * @param {HTMLElement} container - The DOM element where the edit overlay should be rendered.
 */
function renderEditOverlayTemplate(container) {
    container.innerHTML = cardDetailsEditOverlayHTMLTemplate();

    // ⚠️ Problem 3: Verzögere die Initialisierung, um sicherzustellen, 
    // dass das Template vollständig gerendert ist
    setTimeout(() => {
        initEditOverlayContent();
    }, 100);
}


/**
 * Initializes the content and functionality of the edit overlay.
 * - Retrieves the currently selected task using its ID.
 * - Initializes contact selection, priority buttons, and subtasks editing if the corresponding
 *   functions are available.
 * - Binds the click event for the "OK" button to save the edited task and close the overlay.
 */
function initEditOverlayContent() {
    const taskId = getCurrentlyViewedTaskId();
    const task = currentTasksData[taskId] || {};

    // ⚠️ Problem 4: Anstatt initContactSelection aufzurufen, nur die Subtasks initialisieren
    if (typeof initEditTaskSubtasks === 'function') {
        initEditTaskSubtasks();
    }

    // OK-Button einrichten
    const okButton = document.getElementById('ok-button');
    if (okButton) {
        okButton.addEventListener('click', () => {
            saveEditedTask();
            closeBoardCardDetails();
        });
    }
    
    // ⚠️ Problem 5: Verzögere die Initialisierung des Dropdown-Menüs 
    // (nicht die Avatare), um Konflikte zu vermeiden
    setTimeout(() => {
        setupDropdownToggle();
        
        // Dropdown-Funktionalität initialisieren, aber keine Avatare beeinflussen
        if (typeof populateContacts === 'function') {
            populateContacts();
        }
    }, 200);
}


/**
 * Eine Variante von initContactSelection, die nur den Dropdown initialisiert, ohne die Avatare zu beeinflussen.
 * 
 * @async
 * @param {Array<Object>} [assignedUsers=[]] - An array of user objects with a 'name' property.
 */
async function initContactSelectionWithoutAvatars(assignedUsers = []) {
    // Speichere die aktuell ausgewählten Kontakte
    const currentlySelected = new Set([...selectedContacts]);
    
    // Setze die ausgewählten Kontakte basierend auf den zugewiesenen Benutzern
    selectedContacts = new Set(assignedUsers.map(user => user.name || user));
    
    // Füge die vorherigen ausgewählten Kontakte wieder hinzu
    currentlySelected.forEach(contact => selectedContacts.add(contact));
    
    // Initialisiere den Dropdown, aber ohne die Avatare zu rendern
    await populateContacts();
    
    // Initialisiere die Subtasks, wenn nötig
    requestAnimationFrame(() => {
        if (typeof initEditTaskSubtasks === 'function') {
            initEditTaskSubtasks();
        }
    });
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
    const dateInput = document.getElementById('datepicker');

    if (titleInput) titleInput.value = task.title || '';
    if (descriptionTextarea) descriptionTextarea.value = task.description || '';
    if (dateInput) dateInput.value = task.dueDate || '';
    
    // Prioritätsbutton setzen, falls vorhanden
    if (task.priority && typeof setPriorityButton === 'function') {
        setPriorityButton(task.priority);
    }
}


/**
 * Retrieves the button element corresponding to the given priority.
 * 
 * @param {string} priority - The priority level (urgent, medium, low).
 * @returns {Element|null} The corresponding button element or null if not found.
 */
function getPriorityButton(priority) {
    return document.querySelector(`.prio-btn.${priority}`);
}


/**
 * Sets the active state on the button corresponding to the given priority.
 * Removes active states from all other priority buttons.
 * 
 * @param {string} priority - The priority level to activate (urgent, medium, low).
 */
function setPriorityButton(priority) {
    const priorities = ["urgent", "medium", "low"];

    // Remove active class from all priority buttons
    priorities.forEach(prio => getPriorityButton(prio)?.classList.remove("active"));

    // Activate the selected priority button
    const selectedBtn = getPriorityButton(priority.toLowerCase());
    if (selectedBtn) {
        selectedBtn.classList.add("active");
    } else {
        console.warn(`Unknown priority: ${priority}`);
    }
}


/**
 * Populates the complex task data such as subtasks in the edit overlay.
 * Checks if the task contains a valid subtasks array and passes it to populateSubtasks().
 * 
 * @param {Object} task - The task object containing subtasks.
 */
function populateComplexTaskData(task) {
    // copyAssignedUsersFromCachedHTML();

    const subtasks = task.subtasks;

    if (Array.isArray(subtasks) && subtasks.length > 0) {
        populateSubtasks(subtasks);
    }
}

/**
 * Populates the subtask list in the edit overlay with existing subtasks.
 * 
 * Iterates over the given subtasks array, creates DOM elements for each subtask, 
 * attaches click event listeners, and appends them to the subtask list container.
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
 * @param {string|number} taskId - The unique identifier of the task to be edited.
 */
function editTask(taskId = getCurrentlyViewedTaskId()) {
    if (taskId) {
        showBoardCardDetailsEdit();
        
        // ⚠️ Problem 1: Entferne den populateEditOverlay Aufruf
        // und integriere ihn direkt in showBoardCardDetailsEdit
        // populateEditOverlay(taskId);
        
        animateEditOverlay(true);

        // Warten, bis das Overlay gerendert ist, und dann die Dropdown-Toggle-Logik aufrufen
        setTimeout(() => {
            setupDropdownToggle();
        }, 10);
    } else {
        console.error("No taskId provided in editTask");
    }
}

/**
 * Displays the details of a specific task in the board's card detail overlay.
 * Adds an Edit button to switch to the edit view.
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
 * Sets up the toggle behavior for the assigned user dropdown.
 * - Ensures no duplicate listeners by removing any existing one.
 * - Adds a click listener to 'assignedDropdown' that stops propagation
 *   and toggles the dropdown via `toggleDropdown()`.
 */
function setupDropdownToggle() {
    const dropdown = document.getElementById('assignedDropdown');
    if (dropdown) {
        dropdown.removeEventListener('click', toggleDropdown);
        dropdown.addEventListener('click', function (event) {
            event.stopPropagation();
            toggleDropdown();
        });
    }
}


/**
 * Builds and returns an updated task object from the form inputs.
 * Merges new title, description, due date, priority, assignees, and subtasks
 * into the existing task data.
 * @param {string} taskId - ID of the task to update.
 * @returns {Object} Updated task object.
 */
function prepareUpdatedTask(taskId) {
    const title = document.getElementById('editCardTitle')?.value.trim() || '';
    const description = document.getElementById('editCardDescription')?.value.trim() || '';
    const dueDate = document.getElementById('editCardDate')?.value.trim() || '';

    const updatedTask = {
        ...currentTasksData[taskId],
        title,
        description,
        dueDate,
        priority: getPriority(),
        assignedUsers: convertArrayToFirebaseObject(getAssignedUsers()),
        subtasks: convertSubtasksToObject(getEditedSubtasks()),
    };
    return updatedTask;
}


/**
 * Updates the edited task locally and in the database, then refreshes the UI.
 * @returns {Promise<void>}
 */
async function saveEditedTask() {
    const taskId = getCurrentlyViewedTaskId();
    if (!taskId || !currentTasksData[taskId]) return;

    const updatedTask = prepareUpdatedTask(taskId);
    currentTasksData[taskId] = updatedTask;

    await updateTaskInDatabase(taskId, updatedTask);
    await fetchTasksData();
    renderTasks(currentTasksData);
    showBoardCardDetails(taskId);
}