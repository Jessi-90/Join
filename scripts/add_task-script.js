/**
 * Initializes all form functionalities when the page is fully loaded.
 * Calls individual setup functions for different form components.
 */
function initAddTaskPage() {
    initPriorityButtons();
    initFormValidation();
    initClearButton();
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
 * Adds a click listener to clear buttons to reset the form and clear all errors.
 */
function initClearButton() {
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("clear-button")) {
            const form = event.target.closest("form");

            if (form) {
                event.preventDefault();
                form.reset();

                form.querySelectorAll(".error-message").forEach(error => {
                    error.style.display = "none";
                });
                form.querySelectorAll(".invalid").forEach(field => {
                    field.classList.remove("invalid");
                });

                document.getElementById("subtaskList").innerHTML = "";

                console.log(`✅ Formular zurückgesetzt: ${form}`);
            } else {
                console.error("❌ Fehler: Kein zugehöriges Formular gefunden!");
            }
        }
    });
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
 * Toggles the visibility of the dropdown menu.
 * If the dropdown is currently open, it will close, and vice versa.
 */
function toggleDropdown() {
    let dropdown = document.getElementById('dropdownOptions');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

/**
 * Closes the dropdown menu when a click occurs outside of the dropdown area,
 * but only if the user is on the 'add_task.html' page or the overlay is visible.
 */
document.addEventListener('click', (event) => {
    let isAddTaskPage = window.location.pathname.includes('add_task.html');
    let overlay = document.querySelector('.add-task-overlay-container');
    let isOverlayVisible = overlay && getComputedStyle(overlay).display !== 'none';

    if (isAddTaskPage || isOverlayVisible) {
        let dropdown = document.getElementById('dropdownOptions');
        let assignedDropdown = document.getElementById('assignedDropdown');

        if (dropdown && assignedDropdown && !assignedDropdown.contains(event.target)) {
            dropdown.style.display = 'none';
        }
    }
});


/**
 * Populates the dropdown menu with a list of contacts.
 * Fetches contact data, sorts it alphabetically by last name, and displays each contact with an avatar and a checkbox.
 * Additionally, renders avatars for selected contacts.
 * 
 * @async
 * @returns {Promise<void>} - A promise that resolves once the contacts are populated in the dropdown.
 * Fetches contacts from Firebase and populates the assigned contacts select field.
 */
async function populateContacts() {
    await fetchContactsData();

    let contacts = prepareContacts(currentContactsData);

    loadAssignedUsersFromSession();
    renderDropdownOptions(contacts);
    renderAvatars(contacts);
}

/**
 * Prepares the contact data by mapping and sorting it alphabetically by last name.
 * 
 * @param {Array<Object>} data - The array of contact objects from the fetched data.
 * @returns {Array<Object>} - The sorted array of contact objects with their formatted details.
 */
function prepareContacts(data) {
    let contacts = data.map(contact => ({
        name: contact.name,
        userDetails: {
            color: contact.color,
            initials: contact.initials
        }
    }));
    return contacts.sort((a, b) => {
        let lastNameA = a.name.split(' ').slice(-1).join('');
        let lastNameB = b.name.split(' ').slice(-1).join('');
        return lastNameA.localeCompare(lastNameB);
    });
}

/**
 * Renders the dropdown options using the provided contacts.
 * Clears the current dropdown and dynamically creates list items for each contact.
 * 
 * @param {Array<Object>} contacts - The array of contacts to render as dropdown options.
 */
function renderDropdownOptions(contacts) {
    let dropdown = document.getElementById('dropdownOptions');
    dropdown.innerHTML = '';

    contacts.forEach(contact => {
        let listItem = createDropdownItem(contact, contacts);
        dropdown.appendChild(listItem);
    });
}

/**
 * Creates a single dropdown item for a contact.
 * Adds event listeners for selection and deselection of the contact.
 * 
 * @param {Object} contact - The contact object containing name and user details.
 * @param {Array<Object>} contacts - The array of all contacts for reference.
 * @returns {HTMLElement} - The DOM element for the created dropdown item.
 */
function createDropdownItem(contact, contacts) {
    let listItem = document.createElement('li');
    listItem.classList.add('dropdown-item');
    listItem.innerHTML = addTaskUserDropdownItemTemplate(contact);

    if (selectedContacts.has(contact.name)) {
        listItem.classList.add('selected');
    }
    listItem.onclick = function () {
        toggleItem(listItem, contact, contacts);
    };
    return listItem;
}

/**
 * Renders the avatars of selected contacts in the designated container.
 * Clears any previously rendered avatars before rendering new ones.
 * 
 * @param {Array<Object>} contacts - The array of all contacts to cross-reference selected contacts.
 */
function renderAvatars(contacts) {
    let avatarContainer = document.getElementById('selectedContactsContainer');
    avatarContainer.innerHTML = '';

    selectedContacts.forEach(contactName => {
        let contact = contacts.find(c => c.name === contactName);
        if (contact) {
            let avatarElement = document.createElement('div');
            avatarElement.innerHTML = UserAvatarTemplate(contact.userDetails)
            avatarElement.setAttribute('data-name', contact.name);
            avatarContainer.appendChild(avatarElement.firstElementChild);
        }
    });
}

/**
 * Toggles the selection state of a dropdown item.
 * Updates the list of selected contacts by adding or removing the contact, 
 * re-renders the avatars of the selected contacts, and saves the updated state to session storage.
 * 
 * @param {HTMLElement} listItem - The dropdown item that is being toggled.
 * @param {Object} contact - The contact object containing the contact's details.
 * @param {string} contact.name - The name of the contact.
 * @param {Object} contact.userDetails - Additional user details (e.g., avatar color, initials).
 * @param {Array<Object>} contacts - The array of all contacts to ensure the state remains synchronized.
 */
function toggleItem(listItem, contact, contacts) {
    let isSelected = listItem.classList.contains('selected');

    if (isSelected) {
        listItem.classList.remove('selected');
        selectedContacts.delete(contact.name);
    } else {
        listItem.classList.add('selected');
        selectedContacts.add(contact.name);
    }

    renderAvatars(contacts);
    saveAssignedUsersToSession();
}

/**
 * Saves the current list of selected contacts to the session storage.
 * This ensures the selected contacts persist during the current browser session.
 */
function saveAssignedUsersToSession() {
    sessionStorage.setItem('selectedContacts', JSON.stringify([...selectedContacts]));
}

/**
 * Loads the list of selected contacts from the session storage.
 * Restores the state of selected contacts from the current browser session.
 * 
 * @returns {void} - Updates the global `selectedContacts` variable with the restored data.
 */
function loadAssignedUsersFromSession() {
    let storedContacts = JSON.parse(sessionStorage.getItem('selectedContacts')) || [];
    selectedContacts = new Set(storedContacts);
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