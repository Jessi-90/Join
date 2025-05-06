/**
 * Updates the task data in the Firebase database.
 * 
 * This function sends a PUT request to update the `tasks.json` file in Firebase 
 * with the provided `updatedTasks` object, which contains all tasks with any modifications.
 * 
 * @async
 * @function updateTasksInDatabase
 * @param {Object} updatedTasks - An object containing the updated tasks data.
 * @returns {Promise<void>} - A promise that resolves once the tasks have been updated in the database.
 */
async function updateTasksInDatabase(updatedTasks) {
    try {
        await fetch(`${BASE_URL}tasks.json`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedTasks),
        });

    } catch (error) {
        console.error("Fehler beim Aktualisieren der Aufgaben in der Datenbank:", error);
    }
}


/**
 * Deletes a task from the Firebase database, closes the overlay, and updates the board.
 * 
 * @async
 * @function deleteTask
 * @param {string} taskId - The unique identifier of the task to delete.
 * @returns {Promise<void>} A promise that resolves when the task is deleted and the board is updated.
 */
async function deleteTask(event) {
    const cardDetailsContainer = document.getElementById("boardCardDetails");
    const taskId = cardDetailsContainer.dataset.taskId;
    try {
        const response = await fetch(`${BASE_URL}tasks/${taskId}.json`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) {
            throw new Error(`Fehler beim Löschen der Aufgabe: ${response.status}`);
        }

        closeBoardCardDetails(event);
        await fetchTasksData(); 
        filteredTasksData = currentTasksData

    } catch (error) {
        console.error("Fehler beim Löschen des Tasks:", error);
    }
}


/**
 * Fetches task data from the Firebase Realtime Database and updates the local state.
 *
 * - Sends a GET request to the `/tasks.json` endpoint.
 * - Stores the retrieved tasks in the `currentTasksData` variable.
 * - Logs the fetched data for debugging.
 *
 * @returns {Promise<void>} Resolves when the task data has been successfully fetched and stored.
 */
async function fetchTasksData() {
    try {
        const response = await fetch(`${BASE_URL}/tasks.json`);
        currentTasksData = await response.json(); 
    } catch (error) {
        console.error("Fehler beim Laden der Tasks:", error);
    }
}


/**
 * Updates a task in the database via PUT request.
 * 
 * @param {string} taskId - ID of the task to update.
 * @param {Object} updatedTask - New task data.
 * @returns {Promise<void>} Resolves on success, throws on error.
 */
async function updateTaskInDatabase(taskId, updatedTask) {
    try {
        await fetch(`${BASE_URL}/tasks/${taskId}.json`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedTask),
        });
    } catch (error) {
        throw new Error("Fehler beim Update in der Datenbank: " + error);
    }
}