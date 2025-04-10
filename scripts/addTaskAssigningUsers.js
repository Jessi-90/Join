/**
 * Defines the maximum number of users that can be assigned simultaneously.
 * This constant is used to enforce the user limit in rendering and assignment functionalities.
 *
 * @constant {number}
 */
const assignedUsersLimit = 5;


/**
 * Toggles the visibility of the dropdown menu and sets up or removes event listeners accordingly.
 */
function toggleDropdown() {
    const dropdownOptions = document.getElementById('dropdownOptions');
    const container = getParentContainer();

    toggleDropdownVisibility(dropdownOptions);

    if (!isDropdownHidden(dropdownOptions)) {
        addCloseListener(container);
    } else {
        removeCloseListener(container);
    }
}


/**
 * Toggles the 'd-none' class to show or hide the dropdown.
 * 
 * @param {HTMLElement} dropdownElement - The dropdown element to toggle.
 */
function toggleDropdownVisibility(dropdownElement) {
    dropdownElement.classList.toggle('d-none');
}


/**
 * Checks if the dropdown is currently hidden.
 * 
 * @param {HTMLElement} dropdownElement - The dropdown element to check.
 * @returns {boolean} - True if dropdown is hidden, false otherwise.
 */
function isDropdownHidden(dropdownElement) {
    return dropdownElement.classList.contains('d-none');
}


/**
 * Adds a click event listener to close the dropdown when clicking outside of it.
 * 
 * @param {HTMLElement|Document} container - The parent container to attach the listener to.
 */
function addCloseListener(container) {
    setTimeout(() => {
        if (container !== document) {
            container.addEventListener('click', closeDropdownOnClickOutside);
        } else {
            document.addEventListener('click', closeDropdownOnClickOutside);
        }
    }, 0);
}


/**
 * Removes the click event listener that closes the dropdown.
 * 
 * @param {HTMLElement|Document} container - The container from which to remove the listener.
 */
function removeCloseListener(container) {
    if (container !== document) {
        container.removeEventListener('click', closeDropdownOnClickOutside);
    } else {
        document.removeEventListener('click', closeDropdownOnClickOutside);
    }
}

/**
 * Determines the parent container for event listeners.
 * Could be an overlay container or the document.
 * 
 * @returns {Element|Document} The parent container element or document
 */
function getParentContainer() {
    const addTaskOverlay = document.querySelector('.add-task-overlay-container');

    if (addTaskOverlay) {
        return addTaskOverlay;
    }
    
    const editTaskOverlay = document.querySelector('.board-card-edit-container');

    if (editTaskOverlay) {
        return editTaskOverlay;
    }
    return document;
}


/**
 * Removes the click event listener from the appropriate container.
 * 
 * @param {Element|Document} container - The container element or document
 */
function removeCloseListener(container) {
    if (container && container !== document) {
        container.removeEventListener('click', closeDropdownOnClickOutside);
    } else {
        document.removeEventListener('click', closeDropdownOnClickOutside);
    }
}


/**
 * Closes the dropdown when clicking outside of it.
 * Works on both overlays and standalone pages.
 * @param {Event} event - The click event
 */
function closeDropdownOnClickOutside(event) {
    const dropdownOptions = document.getElementById('dropdownOptions');
    const assignedDropdown = document.getElementById('assignedDropdown');
    
    if (!assignedDropdown.contains(event.target)) {
        dropdownOptions.classList.add('d-none');
    
        const container = getParentContainer();

        removeCloseListener(container);
    }
}


/**
 * Initialize dropdown functionality.
 * This function can be called separately when needed.
 */
function initializeDropdown() {
    const selectedOption = document.querySelector('.selected-option');
    const dropdownOptions = document.getElementById('dropdownOptions');

    setupSelectedOptionListener(selectedOption);
    setupDropdownOptionsListener(dropdownOptions);
}


/**
 * Sets up the click event listener for the selected option.
 * 
 * @param {HTMLElement|null} selectedOption - The element that displays the selected option.
 */
function setupSelectedOptionListener(selectedOption) {
    if (!selectedOption) return;

    selectedOption.removeEventListener('click', handleSelectedOptionClick);
    selectedOption.addEventListener('click', handleSelectedOptionClick);
}


/**
 * Sets up the click event listener for the dropdown options container.
 * 
 * @param {HTMLElement|null} dropdownOptions - The container holding all dropdown options.
 */
function setupDropdownOptionsListener(dropdownOptions) {
    if (!dropdownOptions) return;

    dropdownOptions.removeEventListener('click', handleDropdownOptionsClick);
    dropdownOptions.addEventListener('click', handleDropdownOptionsClick);
}


/**
 * Handler for the selected option click event
 * @param {Event} event - The click event
 */
function handleSelectedOptionClick(event) {
    event.stopPropagation();
    toggleDropdown();
}


/**
 * Handler for clicks within the dropdown options
 * @param {Event} event - The click event
 */
function handleDropdownOptionsClick(event) {
    event.stopPropagation();
}


/**
 * Populates the dropdown menu with a list of contacts.
 * Fetches contact data, sorts it alphabetically by last name, and displays each contact with an avatar and a checkbox.
 * Prioritizes the logged-in user by moving them to the top of the list and marking them as "(You)".
 * Additionally, renders avatars for selected contacts.
 * 
 * @async
 * @returns {Promise<void>} - A promise that resolves once the contacts are populated in the dropdown.
 */
async function populateContacts() {
    await mapContactsData();

    let contacts = prepareContacts(currentContactsData);
    contacts = prioritizeLoggedInUser(contacts);

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
    return sortContactsByName(contacts);
};


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
    let renderedCount = 0;
    let avatarContainer = document.getElementById('selectedContactsContainer');
    avatarContainer.innerHTML = '';
    selectedContacts.forEach(contactName => {
        if (renderedCount < assignedUsersLimit) {
            renderedCount = handleAvatarRendering(contactName, contacts, avatarContainer, renderedCount);
        }
    });

    if (selectedContacts.size > assignedUsersLimit) {
        handleExtraUsersRendering(avatarContainer);
    }
}


/**
 * Handles the rendering of a single avatar for a contact.
 * 
 * @param {string} contactName - The name of the contact.
 * @param {Array<Object>} contacts - The array of all contacts to cross-reference the selected contact.
 * @param {HTMLElement} avatarContainer - The container to append the avatar element.
 * @param {number} renderedCount - The current count of rendered avatars.
 * @returns {number} - The updated count of rendered avatars.
 */
function handleAvatarRendering(contactName, contacts, avatarContainer, renderedCount) {
    let contact = contacts.find(c => c.name === contactName);
    if (contact) {
        let avatarElement = document.createElement('div');
        avatarElement.innerHTML = UserAvatarTemplate(contact.userDetails);
        avatarElement.setAttribute('data-name', contact.name);
        avatarContainer.appendChild(avatarElement.firstElementChild);
        renderedCount++;
    }
    return renderedCount;
}


/**
 * Handles the rendering of the additional user indicator.
 * 
 * @param {HTMLElement} avatarContainer - The container to append the extra user element.
 */
function handleExtraUsersRendering(avatarContainer) {
    let extraCount = selectedContacts.size - assignedUsersLimit;

    let extraElement = document.createElement('div');
    extraElement.className = 'extra-users';
    extraElement.innerHTML = `+${extraCount}`;
    avatarContainer.appendChild(extraElement);
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
 * Generates HTML content to display the assigned users of a task.
 * - If no users are assigned, a placeholder message is shown.
 * - If users are assigned, it renders each user using a template function.
 *
 * @param {Object} task - The task object containing assignment data.
 * @param {Object} [task.assignedUsers={}] - A key-value object where keys are user IDs and values are user names.
 * @returns {string} - HTML string representing the assigned users or a placeholder message.
 */
function generateAssigneeHTML(task) {
    const assignedUsers = task.assignedUsers || {};

    if (Object.keys(assignedUsers).length === 0) {
        return `<div class="card-detail-assignee-user"><p>No assigned user</p></div>`;
    }

    return Object.entries(assignedUsers).map(([id, name]) =>
        cardDetailAssigneeContentTemplate(task, id, task.id)
    ).join('');

/**
 * Moves the logged-in user to the top of the contacts list and adds "(You)" to the name.
 * Ensures the logged-in user only appears once.
 * 
 * @param {Array<Object>} contacts - Array of contact objects.
 * @returns {Array<Object>} - Updated contacts array with the logged-in user at the top.
 */
function prioritizeLoggedInUser(contacts) {
    const loggedInUser = getLoggedInUser();
    if (!loggedInUser) return contacts;

    const index = contacts.findIndex(contact => contact.name === loggedInUser.name);
    if (index === -1) return contacts;

    const loggedInContact = { ...contacts[index] };
    if (!loggedInContact.name.includes('(You)')) {
        loggedInContact.name += ' (You)';
    }

    const filteredContacts = contacts.filter((_, i) => i !== index);
    return [loggedInContact, ...filteredContacts];
  }
}