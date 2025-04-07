/**
 * Initializes the subtask input, allowing new subtasks to be added to the list.
 */
function initSubtasks() {
    const addSubtaskButton = document.getElementById("addSubtask");
    const subtasksInput = document.getElementById("subtasks");
    const subtaskList = document.getElementById("subtaskList");

    if (addSubtaskButton && subtasksInput && subtaskList) {
        addSubtaskButton.addEventListener("click", function () {
            addSubtask(subtasksInput, subtaskList);
        });
    } else {
        console.error("Elemente nicht gefunden! Bitte überprüfe die IDs.");
    }
}


/**
 * Adds a new subtask to the subtask list.
 * Clears the input field after adding the subtask.
 * 
 * @param {HTMLInputElement} inputField - The input field where the subtask is entered.
 * @param {HTMLElement} listElement - The list where subtasks are appended.
 */
function addSubtask(inputField, listElement) {
    const subtask = inputField.value.trim();
    if (subtask) {
        const li = document.createElement("li");
        li.textContent = subtask;
        listElement.appendChild(li);
        inputField.value = ""; // Clear the input field
    }
}


/**
 * Retrieves references to the subtask input elements.
 * @returns {Object} An object containing inputField, plusButton, and subtaskNav elements.
 */
function getSubtaskElements() {
    let inputField = document.getElementById("subtasks");
    let plusButton = document.getElementById("standard-subtask-btn");
    let subtaskNav = document.getElementById("subtask-controls");

    return { inputField, plusButton, subtaskNav };
}


/**
 * Sets focus to the input field with the ID 'subtasks'.
 * Prevents the default action of the event, which may include form submission.
 *
 * @param {Event} event - The event triggered by the button click.
 */
function setFocusOnInput(event) {
    if (event && event.preventDefault) {
        event.preventDefault();
    }
}


/**
 * Initializes the subtask input by adding an input event listener to the inputField.
 */
function initSubtasksInput() {
    let { inputField, plusButton, subtaskNav } = getSubtaskElements();

    inputField.addEventListener("input", function () {
        toggleSubtaskControlsVisibility(inputField, subtaskNav, plusButton);
    });
}


/**
 * Toggles the visibility of subtask controls based on the inputField's state.
 * @param {HTMLElement} inputField - The input element for subtasks.
 * @param {HTMLElement} subtaskNav - The navigation element for subtasks.
 * @param {HTMLElement} plusButton - The plus button element.
 */
function toggleSubtaskControlsVisibility(inputField, subtaskNav, plusButton) {
    let isNotEmpty = inputField.value.trim() !== "";

    toggleVisibility(subtaskNav, isNotEmpty);
    toggleVisibility(plusButton, !isNotEmpty);

    addEventListenerOnce(inputField, "keydown", handleEnterKey, "data-enter-listener", isNotEmpty);
    addEventListenerOnce(document.getElementById("add-subtask-btn"), "click", addSubtask, "data-listener-added", isNotEmpty);
}


/**
 * Toggles the visibility of an element by adding or removing the "d-none" class.
 * @param {HTMLElement} element - The element whose visibility is toggled.
 * @param {boolean} shouldShow - Whether the element should be visible or not.
 */
function toggleVisibility(element, shouldShow) {
    element.classList.toggle("d-none", !shouldShow);
}


/**
 * Adds an event listener to an element only once if a condition is met.
 * @param {HTMLElement} element - The element to add the event listener to.
 * @param {string} event - The event type (e.g., "click").
 * @param {Function} handler - The function to handle the event.
 * @param {string} dataAttr - The data attribute used to track the listener.
 * @param {boolean} condition - The condition to check before adding the listener.
 */
function addEventListenerOnce(element, event, handler, dataAttr, condition) {
    if (condition && !element.hasAttribute(dataAttr)) {
        element.addEventListener(event, handler);
        element.setAttribute(dataAttr, "true");
    }
}


/**
 * Handles the Enter key press event for the subtask input.
 * @param {KeyboardEvent} event - The keydown event.
 */
function handleEnterKey(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        addSubtask(event);
    }
}


/**
 * Adds a new subtask based on the content of the input field.
 */
function addSubtask(event) {
    event.preventDefault();
    let { inputField, plusButton, subtaskNav } = getSubtaskElements();
    let subtaskContent = inputField.value.trim();

    if (subtaskContent !== "") {
        createSubtaskElement(subtaskContent);
        inputField.value = "";
        toggleSubtaskControlsVisibility(inputField, subtaskNav, plusButton);
        inputField.focus();
    }
}


/**
 * Creates a new subtask element and appends it to the subtask list.
 * @param {string} subtaskContent - The text content of the new subtask.
 */
function createSubtaskElement(subtaskContent) {
    let subtaskList = document.getElementById("subtask-list");
    let newSubtask = createNewSubtaskElement(subtaskContent);

    subtaskList.appendChild(newSubtask);
    addClickEventToSubtask(newSubtask);
}


/**
 * Creates a new subtask element using a template and sets its content.
 * @param {string} subtaskContent - The text content of the new subtask.
 * @returns {HTMLElement} The new subtask element.
 */
function createNewSubtaskElement(subtaskContent) {
    let templateWrapper = document.createElement("div");

    templateWrapper.innerHTML = addTaskSubtasksListTemplate();
    let newSubtask = templateWrapper.firstElementChild;

    newSubtask.querySelector(".subtask-text").textContent = subtaskContent;
    return newSubtask;
}


/**
 * Adds a click event listener to a subtask element.
 * The event triggers the editing of the subtask if clicked outside subtask actions.
 * @param {HTMLElement} subtaskItem - The subtask element to which the event listener is added.
 */
function addClickEventToSubtask(subtaskItem) {
    subtaskItem.addEventListener('click', (event) => {
        event.stopPropagation();
        if (!event.target.closest('.subtask-actions')) {
            editSubtask(subtaskItem.querySelector('.subtask-edit-btn'));
        }
    });
}


/**
 * Clears the subtask input field and resets the visibility of controls.
 */
function clearInputField(event) {
    event.preventDefault();

    let { inputField, subtaskNav, plusButton } = getSubtaskElements();

    inputField.value = "";
    toggleSubtaskControlsVisibility(inputField, subtaskNav, plusButton);
}


/**
 * Finds the closest subtask item associated with the given button.
 * @param {HTMLElement} button - The button that triggered the delete action.
 * @returns {HTMLElement|null} The subtask item to be deleted, or null if not found.
 */
function findSubtaskItem(button) {
    let wrapper = button.closest('.edit-input-wrapper');
    if (wrapper) {
        return wrapper.closest('.subtask-item') || wrapper.previousElementSibling;
    } else {
        return button.closest('.subtask-item');
    }
}


/**
 * Removes a given subtask item from the DOM.
 * @param {HTMLElement} subtaskItem - The subtask item to be removed.
 */
function removeSubtaskItem(subtaskItem) {
    if (subtaskItem && subtaskItem.classList.contains('subtask-item')) {
        subtaskItem.remove();
    }
}


/**
 * Deletes a subtask based on the given button reference.
 * @param {HTMLElement} button - The button that triggered the delete action.
 */
function deleteSubtask(button) {
    const subtaskItem = findSubtaskItem(button);
    removeSubtaskItem(subtaskItem);
}


/**
 * Edits an existing subtask and allows modification or deletion.
 * @param {HTMLElement} button - The button that triggered the edit action.
 */
function editSubtask(button) {
    const subtaskItem = button.closest('.subtask-item');
    const inputWrapper = createEditInputWrapper(subtaskItem);
    let isDeleting = false;

    setupDeleteButton(inputWrapper, subtaskItem, () => isDeleting = true);
    setupSaveButton(inputWrapper, subtaskItem);

    subtaskItem.replaceWith(inputWrapper);
    const inputField = inputWrapper.querySelector('.subtask-edit-input');
    inputField.focus();

    setupBlurHandler(inputField, subtaskItem, inputWrapper, () => isDeleting);
}


/**
 * Creates and configures the edit input wrapper with necessary elements.
 * @param {HTMLElement} subtaskItem - The original subtask item element.
 * @returns {HTMLElement} The configured input wrapper element.
 */
function createEditInputWrapper(subtaskItem) {
    const inputWrapper = document.createElement('div');
    inputWrapper.classList.add('edit-input-wrapper');

    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.value = subtaskItem.querySelector('.subtask-text').textContent.trim();
    inputField.classList.add('subtask-edit-input');

    inputWrapper.innerHTML = editSubtaskControlsTemplate();
    inputWrapper.prepend(inputField);

    return inputWrapper;
}


/**
 * Sets up the delete button functionality.
 * @param {HTMLElement} inputWrapper - The input wrapper element.
 * @param {HTMLElement} subtaskItem - The original subtask item element.
 * @param {Function} setDeleting - Callback to set the deleting state.
 */
function setupDeleteButton(inputWrapper, subtaskItem, setDeleting) {
    const deleteButton = inputWrapper.querySelector('#delete-edit-subtask-btn');
    if (deleteButton) {
        deleteButton.addEventListener('mousedown', () => {
            setDeleting();
            subtaskItem.remove();
            inputWrapper.remove();
        });
    }
}


/**
 * Sets up the save button functionality.
 * @param {HTMLElement} inputWrapper - The input wrapper element.
 * @param {HTMLElement} subtaskItem - The original subtask item element.
 */
function setupSaveButton(inputWrapper, subtaskItem) {
    const saveButton = inputWrapper.querySelector('#edit-add-subtask-btn');
    if (saveButton) {
        saveButton.addEventListener('click', () => {
            updateSubtaskText(inputWrapper, subtaskItem);
            inputWrapper.replaceWith(subtaskItem);
        });
    }
}


/**
 * Sets up the blur event handler for the input field.
 * @param {HTMLElement} inputField - The input field element.
 * @param {HTMLElement} subtaskItem - The original subtask item element.
 * @param {HTMLElement} inputWrapper - The input wrapper element.
 * @param {Function} isDeleting - Function to check if deletion is in progress.
 */
function setupBlurHandler(inputField, subtaskItem, inputWrapper, isDeleting) {
    inputField.addEventListener('blur', () => {
        if (isDeleting()) {
            return;
        }

        updateSubtaskText(inputWrapper, subtaskItem);
        inputWrapper.replaceWith(subtaskItem);
    });
}


/**
 * Updates the text content of the subtask item.
 * @param {HTMLElement} inputWrapper - The input wrapper element.
 * @param {HTMLElement} subtaskItem - The subtask item to update.
 */
function updateSubtaskText(inputWrapper, subtaskItem) {
    const inputField = inputWrapper.querySelector('.subtask-edit-input');
    const subtaskText = inputField.value.trim();
    subtaskItem.querySelector('.subtask-text').textContent = subtaskText;
}