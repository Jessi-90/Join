function getSubtaskElements() {
    let inputField = document.getElementById("subtasks");
    let plusButton = document.getElementById("standard-subtask-btn");
    let subtaskNav = document.getElementById("subtask-controls");
    
    return { inputField, plusButton, subtaskNav };
}

function initSubtasksInput() {
    let { inputField, plusButton, subtaskNav } = getSubtaskElements();

    inputField.addEventListener("input", function () {
        toggleSubtaskControlsVisibility(inputField, subtaskNav, plusButton);
    });
}

function toggleSubtaskControlsVisibility(inputField, subtaskNav, plusButton) {
    let isNotEmpty = inputField.value.trim() !== "";

    toggleVisibility(subtaskNav, isNotEmpty);
    toggleVisibility(plusButton, !isNotEmpty);

    addEventListenerOnce(inputField, "keydown", handleEnterKey, "data-enter-listener", isNotEmpty);
    addEventListenerOnce(document.getElementById("add-subtask-btn"), "click", addSubtask, "data-listener-added", isNotEmpty);
}

function toggleVisibility(element, shouldShow) {
    element.classList.toggle("d-none", !shouldShow);
}

function addEventListenerOnce(element, event, handler, dataAttr, condition) {
    if (condition && !element.hasAttribute(dataAttr)) {
        element.addEventListener(event, handler);
        element.setAttribute(dataAttr, "true");
    }
}

function handleEnterKey(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        addSubtask();
    }
}


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

function clearInputField() {
    let { inputField, subtaskNav, plusButton } = getSubtaskElements();
    inputField.value = "";
    toggleSubtaskControlsVisibility(inputField, subtaskNav, plusButton);
}

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