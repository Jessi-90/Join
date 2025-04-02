const assignedUsersLimit = 5;

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
function prepareContacts(data) { let contacts = data.map(contact => ({
    name: contact.name,
    userDetails: {
        color: contact.color,
        initials: contact.initials
    }
}));
return contacts.sort((a, b) => a.name.localeCompare(b.name));
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