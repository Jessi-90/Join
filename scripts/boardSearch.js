/**
 * Adds an event listener to the search input field to monitor user input.
 * When the input length meets the minimum required length (`minSearchLength`),
 * the search function (`searchTasks`) is executed. If the input is below the
 * minimum length or cleared, the original task data is restored using
 * `checkSearchInput`.
 */
function initializeSearchListener() {
    const searchInput = document.getElementById("search");

    searchInput.addEventListener("input", function () {
        if (searchInput.value.length >= minSearchLength) {
            searchTasks();
        } else {
            checkSearchInput();
        }
    });
}


/**
 * Creates a deep copy of the current task data (`currentTasksData`) and 
 * stores it in the global variable `originalTasksData`.
 * This ensures that the original task data remains unchanged and can 
 * be restored when needed, such as resetting tasks after a search.
 */
function initializeTaskBackup() {
    originalTasksData = JSON.parse(JSON.stringify(currentTasksData));
}


/**
 * Handles the task search logic based on user input in the search field. 
 * Validates the input length, filters tasks using the original task data, 
 * updates the task list accordingly, and provides user feedback if no 
 * matching tasks are found.
 * 
 * Utilizes helper functions:
 * - `getSearchInput`: Retrieves and processes the search input.
 * - `isSearchInputValid`: Validates the length of the search input.
 * - `filterTasksBySearchInput`: Filters tasks based on the search query.
 * - `toggleNoResultsMessage`: Toggles the visibility of the "No results found" message.
 * - `updateTasksAndRender`: Updates the task list and triggers rendering.
 */
function searchTasks() {
    const searchInput = getSearchInput();

    const noResultsMessage = document.getElementById("no-results-message");

    if (!isSearchInputValid(searchInput)) {
        updateTasksAndRender(Object.values(originalTasksData));
        toggleNoResultsMessage(noResultsMessage, Object.values(originalTasksData).length);
        return;
    }

    const matchingTasks = filterTasksBySearchInput(searchInput);

    toggleNoResultsMessage(noResultsMessage, matchingTasks.length);

    updateTasksAndRender(matchingTasks);
}


/**
 * Retrieves the user input from the search field and converts it to lowercase.
 * @returns {string} The processed search input value.
 */
function getSearchInput() {
    return document.getElementById("search").value.toLowerCase();
}


/**
 * Validates if the search input meets the minimum length requirement.
 * @param {string} searchInput - The search input value.
 * @returns {boolean} True if the input length is sufficient, otherwise false.
 */
function isSearchInputValid(searchInput) {
    return searchInput.length >= minSearchLength;
}


/**
 * Filters tasks based on the search input value, using the original task data as the source.
 * @param {string} searchInput - The user input from the search field.
 * @returns {array} An array of tasks that match the search criteria.
 */
function filterTasksBySearchInput(searchInput) {
    return Object.values(originalTasksData).filter(task => {
        if (typeof task !== "object" || !task.title) {
            return false; // Skip invalid or incomplete tasks
        }

        const titleMatch = task.title.toLowerCase().includes(searchInput);
        const descriptionMatch = task.description
            ? task.description.toLowerCase().includes(searchInput)
            : false;

        return titleMatch || descriptionMatch;
    });
}


/**
 * Updates `currentTasksData` with the filtered tasks and triggers the rendering.
 * @param {array} matchingTasks - The filtered array of tasks matching the search input.
 */
function updateTasksAndRender(matchingTasks) {
    currentTasksData = matchingTasks; // Update the global state
    renderTasks(currentTasksData);    // Render the updated tasks
}


/**
 * Checks whether the search input field is empty. If it is empty, 
 * restores the original task data (`originalTasksData`) to `currentTasksData` 
 * and triggers the rendering of tasks.
 */
function checkSearchInput() {
    const searchInput = document.getElementById("search").value;

    if (searchInput.trim() === "") {
        currentTasksData = JSON.parse(JSON.stringify(originalTasksData));
        renderTasks(currentTasksData);
    }
}


/**
 * Toggles the visibility of the "No results found" message based on the task search results.
 * @param {HTMLElement} messageElement - The HTML element containing the "No results found" message.
 * @param {number} matchingTasksLength - The length of the array of matching tasks.
 */
function toggleNoResultsMessage(messageElement, matchingTasksLength) {
    if (matchingTasksLength === 0) {
        messageElement.style.display = "block";
    } else {
        messageElement.style.display = "none";
    }
}