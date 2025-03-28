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
async function deleteTask(taskId) {
    try {
        const response = await fetch(`${BASE_URL}tasks/${taskId}.json`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) {
            throw new Error(`Fehler beim Löschen der Aufgabe: ${response.status}`);
        }

        closeBoardCardDetails({ target: document.getElementById('boardCardDetailContainer') });

        await fetchTasksData(); 
        renderBoard(); 

    } catch (error) {
        console.error("Fehler beim Löschen des Tasks:", error);
    }
}