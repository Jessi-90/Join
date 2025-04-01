/**
 * Initializes all form functionalities when the page is fully loaded.
 * Calls individual setup functions for different form components.
 */
function initAddTaskPage() {
    initPriorityButtons();
    initFormValidation();
    initDueDateInput();
    populateContacts();
    initSubtasksInput();
    initFormSubmitHandler();
    setDefaultMediumPriority();
    initCreateTaskButton();
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
 * Initializes the priority buttons.
 * Ensures only one button is active at a time.
 */
function initPriorityButtons() {
    const prioButtons = document.querySelectorAll(".prio-btn");
    const mediumButton = document.querySelector(".prio-btn.medium");

    if (mediumButton) {
        mediumButton.classList.add("active");
    }

    prioButtons.forEach(button => {
        button.addEventListener("click", () => {
            prioButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
        });
    });
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
    const dueDate = document.getElementById("due-date");
    const category = document.getElementById("category");

    let isValid = true;

    isValid &= validateField(title, "Title is required");
    isValid &= validateDueDate();
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
function validateDueDate() {
    const dueDateInput = document.getElementById("due-date");
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
        errorMessage.style.display = "none"; // Hide the error message
        errorMessage.textContent = ""; // Clear the error message content
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
 * Clears the form, removes users from sessionStorage, deletes subtasks, and resets all error messages.
 */
function clearFormAndData() {
    resetForm();
    clearSubtaskList();
    removeSelectedContactsFromStorage();
    resetErrorMessages();
    clearInvalidInputStyles();
    populateContacts();
}


/**
 * Formats the due date input to enforce DD/MM/YYYY format as the user types.
 */
function initDueDateInput() {
    const dueDateInput = document.getElementById("due-date");

    dueDateInput.addEventListener("input", function () {
        let value = this.value.replace(/[^0-9]/g, "");

        // Füge / nach Tag und Monat hinzu
        value = value.replace(/^(\d{2})(\d{2})?(\d{0,4})?/, (match, day, month, year) => {
            let result = day;
            if (month) result += "/" + month;
            if (year) result += "/" + year;
            return result;
        });

        this.value = value;
    });
}


/**
 * Sets the current date into the input field with the ID "due-date".
 * The date is formatted as "dd/mm/yyyy".
 */
function setTodayDate() {
    let dateInput = document.getElementById("due-date");
    let today = new Date();
    let formattedDate = formatDate(today);
    dateInput.value = formattedDate;
}


/**
 * Formats a given Date object into the format "dd/mm/yyyy".
 * @param {Date} date - The Date object to format.
 * @returns {string} The formatted date as a string in "dd/mm/yyyy" format.
 */
function formatDate(date) {
    let day = String(date.getDate()).padStart(2, "0");
    let month = String(date.getMonth() + 1).padStart(2, "0");
    let year = date.getFullYear();
    return `${day}/${month}/${year}`;
}


/**
 * Initializes the enable/disable functionality of the "Create Task" button.
 */
function initCreateTaskButton() {
    const title = document.getElementById("title");
    const dueDate = document.getElementById("due-date");
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
    const title = document.getElementById("title");
    const dueDate = document.getElementById("due-date");
    const category = document.getElementById("category");
    const createTaskButton = document.getElementById("create-task");

    const isTitleValid = title.value.trim() !== "";
    const isDueDateValid = dueDate.value.trim() !== "";
    const isCategoryValid = category.value !== "Select task category";

    if (isTitleValid && isDueDateValid && isCategoryValid) {
        createTaskButton.disabled = false; // Enable button
    } else {
        createTaskButton.disabled = true; // Keep button disabled
    }
}