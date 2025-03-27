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
        addSubtask();
    }
}

/**
 * Adds a new subtask based on the content of the input field.
 */
function addSubtask() {
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
    let templateWrapper = document.createElement("div");

    templateWrapper.innerHTML = addTaskSubtasksListTemplate();
    let newSubtask = templateWrapper.firstElementChild;

    newSubtask.querySelector(".subtask-text").textContent = subtaskContent;
    subtaskList.appendChild(newSubtask);

    const subtaskItem = newSubtask;
    subtaskItem.addEventListener('click', (event) => {
        if (!event.target.closest('.subtask-actions')) {
            editSubtask(subtaskItem.querySelector('.subtask-edit-btn'));
        }
    });
}

/**
 * Clears the subtask input field and resets the visibility of controls.
 */
function clearInputField() {
    let { inputField, subtaskNav, plusButton } = getSubtaskElements();
    inputField.value = "";
    toggleSubtaskControlsVisibility(inputField, subtaskNav, plusButton);
}

/**
 * Deletes a subtask based on the given button reference.
 * @param {HTMLElement} button - The button that triggered the delete action.
 */
function deleteSubtask(button) {
    let wrapper = button.closest('.edit-input-wrapper');

    if (wrapper) {
        const subtaskItem = wrapper.closest('.subtask-item') || wrapper.previousElementSibling;

        if (subtaskItem && subtaskItem.classList.contains('subtask-item')) {
            subtaskItem.remove();
        }
    } else {
        let subtaskItem = button.closest('.subtask-item');
        if (subtaskItem) {
            subtaskItem.remove();
        }
    }
}

/**
 * Edits an existing subtask and allows modification or deletion.
 * @param {HTMLElement} button - The button that triggered the edit action.
 */
function editSubtask(button) {
    const subtaskItem = button.closest('.subtask-item');
    const inputWrapper = document.createElement('div');
    inputWrapper.classList.add('edit-input-wrapper');

    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.value = subtaskItem.querySelector('.subtask-text').textContent.trim();
    inputField.classList.add('subtask-edit-input');

    inputWrapper.innerHTML = editSubtaskControlsTemplate();
    inputWrapper.prepend(inputField);
    let isDeleting = false;

    const deleteButton = inputWrapper.querySelector('#delete-edit-subtask-btn');
    if (deleteButton) {
        deleteButton.addEventListener('mousedown', () => {
            isDeleting = true;
            subtaskItem.remove();
            inputWrapper.remove();
        });
    }

    const saveButton = inputWrapper.querySelector('#edit-add-subtask-btn');
    if (saveButton) {
        saveButton.addEventListener('click', () => {
            const subtaskText = inputField.value.trim();
            subtaskItem.querySelector('.subtask-text').textContent = subtaskText;
            inputWrapper.replaceWith(subtaskItem);
        });
    }
    subtaskItem.replaceWith(inputWrapper);
    inputField.focus();
    inputField.addEventListener('blur', () => {
        if (isDeleting) {
            return;
        }

        const subtaskText = inputField.value.trim();
        subtaskItem.querySelector('.subtask-text').textContent = subtaskText;
        inputWrapper.replaceWith(subtaskItem);
    });
}