/**
 * Initializes all form functionalities when the page is fully loaded.
 * Calls individual setup functions for different form components.
 */
function initAddTaskPage() {
    initPriorityButtons();
    initFormValidation();
    // initClearButton();
    initDueDateInput();
    populateContacts();
    initSubtasksInput();
    initFormSubmitHandler();
    setDefaultMediumPriority();
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
 * Initializes the subtask input, allowing new subtasks to be added to the list.
 */
function initSubtasks() {
    const addSubtaskButton = document.getElementById("addSubtask");
    const subtasksInput = document.getElementById("subtasks");
    const subtaskList = document.getElementById("subtaskList");

    addSubtaskButton.addEventListener("click", function () {
        const subtask = subtasksInput.value.trim();
        if (subtask) {
            const li = document.createElement("li");
            li.textContent = subtask;
            subtaskList.appendChild(li);
            subtasksInput.value = "";
        }
    });
}


// /**
//  * Adds a click listener to clear buttons to reset the form, clear all errors, and remove users and subtasks.
//  */
// function initClearButton() {
//     document.addEventListener("click", function (event) {
//         if (event.target.classList.contains("clear-button")) {
//             const form = event.target.closest("form");

//             if (form) {
//                 event.preventDefault();
//                 form.reset();

//                 // Clear error messages and invalid fields
//                 form.querySelectorAll(".error-message").forEach(error => {
//                     error.style.display = "none";
//                 });
//                 form.querySelectorAll(".invalid").forEach(field => {
//                     field.classList.remove("invalid");
//                 });

//                 // Clear subtask list
//                 const subtaskList = document.getElementById("subtaskList");
//                 if (subtaskList) {
//                     subtaskList.innerHTML = "";
//                     console.log("✅ Subtasks entfernt.");
//                 } else {
//                     console.warn("⚠️ Keine Subtask-Liste gefunden.");
//                 }

//                 // Remove users from sessionStorage
//                 if (sessionStorage.getItem("selectedContacts")) {
//                     sessionStorage.removeItem("selectedContacts");
//                     console.log("✅ Benutzer aus sessionStorage entfernt.");
//                 } else {
//                     console.warn("⚠️ Keine Benutzer im sessionStorage gefunden.");
//                 }

//                 console.log(`✅ Formular zurückgesetzt: ${form}`);
//             } else {
//                 console.error("❌ Fehler: Kein zugehöriges Formular gefunden!");
//             }
//         }
//     });
// }

/**
 * Clears the form, removes users from sessionStorage, and deletes subtasks.
 */
function clearFormAndData() {
    // Zugriff auf das Formular
    const form = document.querySelector("form");
    if (form) {
        // Alle Eingabefelder zurücksetzen
        form.reset();

        // Subtasks entfernen
        const subtaskList = document.getElementById("subtaskList");
        if (subtaskList) {
            subtaskList.innerHTML = "";
            console.log("✅ Subtasks entfernt.");
        } else {
            console.warn("⚠️ Keine Subtask-Liste gefunden.");
        }

        // Benutzer aus dem sessionStorage entfernen
        if (sessionStorage.getItem("selectedContacts")) {
            sessionStorage.removeItem("selectedContacts");
            console.log("✅ Benutzer aus sessionStorage entfernt.");
        } else {
            console.warn("⚠️ Keine Benutzer im sessionStorage gefunden.");
        }

        console.log("✅ Formular und Daten erfolgreich geleert.");
    } else {
        console.error("❌ Fehler: Kein Formular gefunden.");
    }
}



/**
 * Formats the due date input to enforce DD/MM/YYYY format as the user types.
 */
function initDueDateInput() {
    const dueDateInput = document.getElementById("due-date");

    dueDateInput.addEventListener("input", function () {
        let value = this.value.replace(/[^0-9/]/g, "");

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
 * Initializes the form logic.
 * This function adds the submit event listener to the form when called.
 */
function sendTaskFormToDb() {
    const form = document.querySelector("form");
    form.addEventListener("submit", function(event) {
        handleFormSubmission(event);
    });
}

/**
 * Pushes all the task data to the database using PUT to replace the entire structure.
 * @param {Event} event - The form submit event.
 */
async function handleFormSubmission(event) {
    event.preventDefault();
    const newTask = getFormData();
    const tasks = await fetchTasksData();

    let counter = increaseTasksCounter(tasks);
    let newTaskKey = `taskid_${counter}`;

    tasks[newTaskKey] = createNewTask(newTask, newTaskKey);
    tasks.counter = counter;

    await saveTasksToDatabase(tasks);
}


/**
 * Collects the form data and returns it as an object.
 * @returns {Object} The collected form data.
 */
function getFormData() {
    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const dueDate = document.getElementById("due-date").value.trim();
    let priority = "low";
    document.querySelectorAll(".prio-btn").forEach(button => {
        if (button.classList.contains("active")) {
            priority = button.classList.contains("urgent")
                ? "urgent"
                : button.classList.contains("medium")
                    ? "medium"
                    : "low";
        }
    });

    let assignedUsers = [];
    const storedUsers = sessionStorage.getItem("selectedContacts");
    if (storedUsers) {
        try {
            assignedUsers = JSON.parse(storedUsers);
        } catch (error) {
            console.error("Error parsing assignedUsers from sessionStorage:", error);
        }
    }

    const category = document.getElementById("category").value.trim();
    const subtasks = Array.from(document.querySelectorAll("#subtask-list li"))
        .map(subtask => ({
            title: subtask.textContent.trim(),
            completed: false
        }));

    return { title, description, dueDate, priority, assignedUsers, category, subtasks };
}