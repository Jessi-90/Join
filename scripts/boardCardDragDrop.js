/**
 * The ID of the currently dragged card.
 * @type {string|number}
 */
let currentDraggedCardId;


/**
 * Handles the dragover event by preventing the default behavior
 * and highlighting the target column if necessary.
 *
 * @param {DragEvent} ev - The dragover event object.
 */
function dragoverHandler(ev) {
    ev.preventDefault();
    const columnCategory = ev.currentTarget.id;
    const existingPlaceholder = document.getElementById('placeholder');
    if (!existingPlaceholder || existingPlaceholder.parentElement.id !== columnCategory) {
        highlightCardContainer(columnCategory);
    }
}


/**
 * Sets the ID of the task that is currently being dragged.
 *
 * @param {string|number} taskId - The ID of the task being dragged.
 */
function startCardDragging(taskId) {
    currentDraggedCardId = taskId;
}


/**
 * Moves the dragged card to a new category, updates the task data,
 * removes the highlight, and re-renders the tasks.
 *
 * @param {string} category - The new category to which the task should be moved.
 * @param {string} columnCategory - The ID of the column where the task is being dropped.
 */
function moveCardTo(category, columnCategory) {
    currentTasksData[currentDraggedCardId]['status'] = category;
    removeHighlightCardContainer(columnCategory);
    updateTasksInDatabase(currentTasksData)
    renderTasks(currentTasksData);
}


/**
 * Highlights the target column by adding a placeholder element
 * to indicate where the dragged card can be dropped.
 *
 * @param {string} columnCategory - The ID of the column to highlight.
 */
function highlightCardContainer(columnCategory) {
    const column = document.getElementById(columnCategory);
    const existingPlaceholder = document.getElementById('placeholder');
    if (!existingPlaceholder || existingPlaceholder.parentElement !== column) {
        if (existingPlaceholder) {
            existingPlaceholder.remove();
        }
        const placeholder = document.createElement('div');
        placeholder.classList.add('highlight-card-container');
        placeholder.id = 'placeholder';
        column.appendChild(placeholder);
    }
}


/**
 * Removes the highlight placeholder from the specified column.
 *
 * @param {string} columnCategory - The ID of the column from which to remove the placeholder.
 */
function removeHighlightCardContainer(columnCategory) {
    const column = document.getElementById(columnCategory);
    const placeholder = document.getElementById('placeholder');
    if (placeholder && placeholder.parentElement === column) {
        column.removeChild(placeholder);
    }
}