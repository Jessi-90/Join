/**
 * Initializes all form functionalities when the page is fully loaded.
 * Calls individual setup functions for different form components.
 */
function initAddTaskPage() {
    initPriorityButtons();
    initFormValidation();
    populateContacts();
    initSubtasksInput();
    initFormSubmitHandler();
    setDefaultMediumPriority();
    initCreateTaskButton();
    initializeDatepicker("#datepicker");
    setDefaultDate("#datepicker");
}


/**
 * Sets the default priority to medium if the corresponding button is found.
 * Logs a warning if the medium priority button is not present in the DOM.
 */
function setDefaultMediumPriority() {
    let mediumButton = document.querySelector(".prio-btn.medium");
    if (mediumButton) {
        mediumButton.classList.add("active");
    } else {
        console.warn('Medium priority button not found');
    }
}


/**
 * Initializes the priority buttons by setting up event listeners and a default state.
 */
function initPriorityButtons() {
    setDefaultPriority();
    addPriorityButtonListeners();
}


/**
 * Sets the default priority button to medium if available.
 */
function setDefaultPriority() {
    const mediumButton = document.querySelector(".prio-btn.medium");
    if (mediumButton) {
        mediumButton.classList.add("active");
    } else {
        console.warn("Medium priority button not found");
    }
}


/**
 * Adds click event listeners to all priority buttons to ensure only one is active at a time.
 */
function addPriorityButtonListeners() {
    const prioButtons = document.querySelectorAll(".prio-btn");

    prioButtons.forEach(button => {
        button.addEventListener("click", () => {
            deactivateAllPriorityButtons(prioButtons);
            activatePriorityButton(button);
        });
    });
}


/**
 * Deactivates all priority buttons by removing the 'active' class.
 * @param {NodeList} buttons - A list of all priority buttons.
 */
function deactivateAllPriorityButtons(buttons) {
    buttons.forEach(btn => btn.classList.remove("active"));
}

/**
 * Activates a single priority button by adding the 'active' class.
 * @param {HTMLElement} button - The priority button to activate.
 */
function activatePriorityButton(button) {
    button.classList.add("active");
}


/**
 * Sets up the form submit handler to validate the form.
 * Prevents form submission if validation fails.
 */
function initFormSubmitHandler() {
    const form = document.getElementById("taskForm");

    form.addEventListener("submit", function (event) {
        if (!validateTaskForm()) {
            event.preventDefault();
        } else {
            console.log("Task created successfully!");
        }
    });
}


/**
 * Adds blur validation for required fields.
 */
function initFormValidation() {
    document.querySelectorAll("input[required]").forEach(input => {
        input.addEventListener("blur", () => checkValidity(input));
    });
}


/**
 * Checks individual field validity and displays an error if needed.
 * @param {HTMLInputElement} field - The input field to validate.
 */
function checkValidity(field) {
    const errorMessage = field.closest(".form-group").querySelector(".error-message");
    if (!field.value.trim()) {
        errorMessage.style.display = "block";
        field.classList.add("invalid");
    } else {
        errorMessage.style.display = "none";
        field.classList.remove("invalid");
    }
}


/* Validates the entire task form.
* @returns {boolean} Whether the form is valid.
*/
function validateTaskForm() {
    const title = document.getElementById("title");
    const dueDate = document.getElementById("datepicker");
    const category = document.getElementById("category");

    let isValid = true;

    isValid &= validateField(title, "Title is required");
    isValid &= validateDueDate(dueDate);
    isValid &= validateCategory(category);

    return !!isValid;
}


/**
 * Validates a single field.
 * @param {HTMLElement} field - The field to validate.
 * @param {string} message - Error message to display.
 * @returns {boolean} Whether the field is valid.
 */
function validateField(field, message) {
    if (!field.value.trim()) {
        showError(field, message);
        return false;
    } else {
        hideError(field);
        return true;
    }
}


/**
 * Validates the due date input.
 * @returns {boolean} Whether the due date is valid.
 */
function validateDueDate(dueDateInput) {
    const datePattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;

    if (!dueDateInput.value.trim()) {
        showError(dueDateInput, "Due date is required");
        return false;
    } else if (!datePattern.test(dueDateInput.value)) {
        showError(dueDateInput, "Invalid date format (DD/MM/YYYY)");
        return false;
    } else {
        hideError(dueDateInput);
        return true;
    }
}


/**
 * Validates the category selection.
 * @param {HTMLElement} categoryField - The category select element.
 * @returns {boolean} Whether the category is valid.
 */
function validateCategory(categoryField) {
    if (categoryField.value === "Select task category") {
        showError(categoryField, "Category is required");
        return false;
    } else {
        hideError(categoryField);
        return true;
    }
}


/**
 * Displays an error message for a field.
 * @param {HTMLElement} field - The field element.
 * @param {string} message - The error message.
 */
function showError(field, message) {
    const error = field.closest(".form-group").querySelector(".error-message");
    if (error) {
        error.textContent = message;
        error.style.display = "block";
        field.classList.add("invalid");
    }
}


/**
 * Hides the error message for a field.
 * @param {HTMLElement} field - The field element.
 */
function hideError(field) {
    const error = field.closest(".form-group").querySelector(".error-message");
    if (error) {
        error.style.display = "none";
        field.classList.remove("invalid");
    }
}


/**
 * Clears the form, resets all input fields to their default state.
 */
function resetForm() {
    const form = document.querySelector("form");
    if (form) {
        form.reset();
    }
}


/**
 * Deletes all subtasks from the subtask list.
 */
function clearSubtaskList() {
    const subtaskList = document.getElementById("subtask-list");
    if (subtaskList) {
        subtaskList.innerHTML = "";
    }
}


/**
 * Removes selected contacts from sessionStorage.
 */
function removeSelectedContactsFromStorage() {
    if (sessionStorage.getItem("selectedContacts")) {
        sessionStorage.removeItem("selectedContacts");
    }
}


/**
 * Resets all error messages in the form.
 */
function resetErrorMessages() {
    document.querySelectorAll(".error-message").forEach((errorMessage) => {
        errorMessage.style.display = "none";
        errorMessage.textContent = "";
    });
}


/**
 * Removes the "invalid" class from all invalid input fields.
 */
function clearInvalidInputStyles() {
    document.querySelectorAll("input.invalid").forEach((input) => {
        input.classList.remove("invalid");
    });
}


/**
 * Resets the state of all priority buttons.
 * 
 * This function performs two main actions:
 * 1. Deactivates all buttons with the class `.prio-btn`.
 * 2. Sets the default priority to "medium".
 * 
 */
function resetPrioButtons() {
    const prioButtons = document.querySelectorAll(".prio-btn");
    deactivateAllPriorityButtons(prioButtons);
    setDefaultMediumPriority();
}


/**
 * Clears the form, removes users from sessionStorage, deletes subtasks, and resets all error messages.
 */
function clearFormAndData() {
    resetForm();
    clearSubtaskList();
    removeSelectedContactsFromStorage();
    resetErrorMessages();
    clearInvalidInputStyles();
    populateContacts();
    resetPrioButtons();
}


/**
 * Initializes the enable/disable functionality of the "Create Task" button.
 */
function initCreateTaskButton() {
    const title = document.getElementById("title");
    const dueDate = document.getElementById("datepicker");
    const category = document.getElementById("category");

    title.addEventListener("input", checkFormValidity);
    dueDate.addEventListener("input", checkFormValidity);
    category.addEventListener("change", checkFormValidity);

    checkFormValidity();
}


/**
 * Checks if all required fields are filled and enables/disables the "Create Task" button accordingly.
 */
function checkFormValidity() {
    const title = getTitleField();
    const dueDate = getDueDateField();
    const category = getCategoryField();
    const createTaskButton = getCreateTaskButton();

    const isTitleValid = validateTitleField(title);
    const isDueDateValid = validateDueDateField(dueDate);
    const isCategoryValid = validateCategoryField(category);

    toggleCreateTaskButton(createTaskButton, isTitleValid, isDueDateValid, isCategoryValid);
}


/**
 * Gets the title input field.
 * @returns {HTMLElement} The title input field element.
 */
function getTitleField() {
    return document.getElementById("title");
}


/**
 * Gets the due date input field.
 * @returns {HTMLElement} The due date input field element.
 */
function getDueDateField() {
    return document.getElementById("datepicker");
}


/**
 * Gets the category select field.
 * @returns {HTMLElement} The category select element.
 */
function getCategoryField() {
    return document.getElementById("category");
}


/**
 * Gets the "Create Task" button.
 * @returns {HTMLElement} The "Create Task" button element.
 */
function getCreateTaskButton() {
    return document.getElementById("create-task");
}


/**
 * Validates the title field by checking if it is not empty.
 * @param {HTMLElement} titleField - The title input field element.
 * @returns {boolean} True if valid, otherwise false.
 */
function validateTitleField(titleField) {
    return titleField.value.trim() !== "";
}


/**
 * Validates the due date field by checking if it is not empty.
 * @param {HTMLElement} dueDateField - The due date input field element.
 * @returns {boolean} True if valid, otherwise false.
 */
function validateDueDateField(dueDateField) {
    return dueDateField.value.trim() !== "";
}


/**
 * Validates the category field by checking if a valid category is selected.
 * @param {HTMLElement} categoryField - The category select element.
 * @returns {boolean} True if valid, otherwise false.
 */
function validateCategoryField(categoryField) {
    return categoryField.value !== "Select task category";
}


/**
 * Toggles the "Create Task" button's disabled state based on field validations.
 * @param {HTMLElement} button - The "Create Task" button element.
 * @param {boolean} isTitleValid - Whether the title field is valid.
 * @param {boolean} isDueDateValid - Whether the due date field is valid.
 * @param {boolean} isCategoryValid - Whether the category field is valid.
 */
function toggleCreateTaskButton(button, isTitleValid, isDueDateValid, isCategoryValid) {
    button.disabled = !(isTitleValid && isDueDateValid && isCategoryValid);
}