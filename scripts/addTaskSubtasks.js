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
    
    
    subtaskNav.classList.toggle("d-none", !isNotEmpty);
    
    
    plusButton.classList.toggle("d-none", isNotEmpty);

   
    if (isNotEmpty && !document.getElementById("add-subtask-btn").hasAttribute("data-listener-added")) {
        let addSubtaskButton = document.getElementById("add-subtask-btn");

        addSubtaskButton.addEventListener("click", addSubtask);
        addSubtaskButton.setAttribute("data-listener-added", "true");
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
    let newSubtask = document.createElement("li");

    newSubtask.textContent = subtaskContent;
    subtaskList.appendChild(newSubtask);
}

function clearInputField() {
    let { inputField, subtaskNav, plusButton } = getSubtaskElements();
    inputField.value = "";
    toggleSubtaskControlsVisibility(inputField, subtaskNav, plusButton);
}


