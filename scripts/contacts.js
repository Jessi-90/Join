/**
 * An array to store the data of individual contacs after fetching.
 * @type {Array}
 */
let currentContactsData = [];


/**
 * Initializes the app by fetching data, rendering the contacts, and setting up interactive features.
 * Ensures the app remains responsive by adapting UI behavior based on screen size.
 */
async function init() {
    await mapContactsData();
    renderContacts();
    renderContactList(currentContactsData);
    addContactClickEvents();
    summaryGreetingUser();
    setupResponsiveListener();
}


/**
 * Fetches contact data from the Firebase database and stores it in `currentContactsData`.
 * Filters out invalid data and excludes the "counter" field.
 * 
 * @async
 * @function mapContactsData
 * @returns {Promise<void>} - A promise that resolves when the data is fetched and processed.
 * @throws {Error} - Logs an error if the fetch request fails.
 */
async function mapContactsData() {
    try {
        const data = await getContacts();

        if (!data || typeof data !== 'object') {
            currentContactsData = [];
        } else {
            currentContactsData = Object.keys(data)
                .filter(key => key !== "counter")
                .map(key => ({
                    firebaseId: key,
                    ...data[key]
                }))
                .filter(contact => contact.name)
                currentContactsData = sortContactsByName(currentContactsData);
        }

    } catch (error) {
        console.error("❌ Fehler beim Laden der Kontakte:", error);
        currentContactsData = [];
    }
}


/**
 * Retrieves and validates contact form data.
 *
 * @returns {Object|null} The contact object if valid, otherwise null.
 */
function getContactFormData() {
    const name = document.querySelector('input[placeholder="Name"]').value.trim();
    const email = document.querySelector('input[placeholder="Email"]').value.trim();
    const phone = document.querySelector('input[placeholder="Phone"]').value.trim();

    if (!name || !email || !phone) {
        return null;
    }

    return {
        name,
        email,
        phone,
        initials: getContactInitials(name),
        color: getRandomColor()
    };
}


/**
 * Handles the form submission to create a new contact.
 *
 * Retrieves contact data from the form, fetches contacts from the database,
 * adds the new contact, updates the UI, and provides feedback.
 *
 * @async
 * @function createContact
 * @param {Event} event - The form submission event.
 * @returns {Promise<void>} A promise that resolves after the contact is added and UI is updated.
 */
async function createContact(event) {
    event.preventDefault();
    const contact = getContactFormData();
    
    if (!validateContactForm()) {
        return; 
    }
    if (contact) {
        try {
            let contacts = await getContacts(event); 
            if (!contacts) {
                console.error("Fehler: Kontakte konnten nicht geladen werden.");
                return;
            }
            await addNewContact(event, contacts, contact); 
            await mapContactsData(); 
            renderContactList(currentContactsData);
            setNewContactActive(contact); 
            showFeedbackImage();
            closeAddContactOverlay();
        } catch (error) {
            console.error("Fehler beim Speichern des Kontakts:", error);
        }
    }
}


/**
 * Sets the newly added contact as active.
 * @param {Object} contact - The newly created contact.
 */
function setNewContactActive(contact) {
    setTimeout(() => {
        const allContacts = document.querySelectorAll('.contact-placeholder-item');

        const newContactElement = Array.from(allContacts).find(el => 
            el.textContent.includes(contact.name)
        );

        if (newContactElement) {
            setActiveContact(newContactElement);
        }
    }, 100); 
}


/**
 * Deletes a contact from the Firebase database and updates the UI.
 * 
 * This function sends a DELETE request to remove the contact from the database.
 * After deletion, it fetches the updated contact list and re-renders it.
 * If the deleted contact's details are currently displayed, they will be removed from the UI.
 * 
 * @async
 * @function deleteContact
 * @param {string} firebaseId - The unique Firebase ID of the contact to be deleted.
 * @returns {Promise<void>} - A promise that resolves once the contact is deleted and the UI is updated.
 * @throws {Error} - Logs an error if the deletion request fails.
 */
async function deleteContact(firebaseId) {
    try {
        const updatedTasks = await removeContactFromTasks(firebaseId);
        if (Object.keys(updatedTasks).length > 0) {
            await updateTasksInDatabase(updatedTasks);}

        const response = await fetch(`${BASE_URL}contacts/${firebaseId}.json`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) {
            throw new Error(`Fehler beim Löschen des Kontakts: ${response.status}`);
        }
        
        await mapContactsData();
        renderContactList(currentContactsData);
        
        const contactDetailContainer = document.getElementById("contact-detail");
        if (contactDetailContainer && contactDetailContainer.dataset.firebaseId === firebaseId) {
            contactDetailContainer.innerHTML = "";
        }
    } catch (error) {
        console.error("Fehler beim Löschen des Kontakts:", error);
    }
}


/**
 * Removes a contact from all tasks where it is assigned.
 * 
 * This function fetches all tasks from the database, iterates through them, 
 * and removes the given contact ID from the `assignedContacts` array in each task.
 * It returns an updated list of tasks without modifying the database directly.
 * 
 * @async
 * @function removeContactFromTasks
 * @param {string} firebaseId - The unique Firebase ID of the contact to be removed from tasks.
 * @returns {Promise<Object>} - A promise that resolves to an updated tasks object with the contact removed.
 */
async function removeContactFromTasks(firebaseId) {
    try {
        let tasksResponse = await fetchTasksData();
        if (!tasksResponse.ok) throw new Error("Fehler beim Abrufen der Aufgaben");

        let tasks = await tasksResponse.json();
        if (!tasks) return {};

        let updatedTasks = {};

        for (let taskId in tasks) {
            let task = tasks[taskId];

            if (task.assignedContacts && Array.isArray(task.assignedContacts)) {
                task.assignedContacts = task.assignedContacts.filter(id => id !== firebaseId);
            }

            updatedTasks[taskId] = task;
        }

        return updatedTasks;

    } catch (error) {
        console.error("Fehler beim Entfernen des Kontakts aus Aufgaben:", error);
        return {};
    }
}


/**
 * Removes the "active" class from elements with the class "contact-placeholder-item"
 * if the viewport width is less than or equal to 768px.
 */
function removeActiveClassOnResize() {
    if (window.innerWidth <= 768) {
        const activeItems = document.querySelectorAll('.contact-placeholder-item');
        activeItems.forEach(item => {
            item.classList.remove('active');
        });
    }
}


/**
 * Sets up a responsive listener that removes the "active" class from elements
 * based on the viewport width whenever the browser window is resized.
 * Also calls the removal function once during initialization.
 */
function setupResponsiveListener() {
    window.addEventListener('resize', removeActiveClassOnResize);
    removeActiveClassOnResize();
}