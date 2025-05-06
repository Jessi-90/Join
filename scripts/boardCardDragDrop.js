/**
 * The ID of the currently dragged card.
 * @type {string|number}
 */
let currentDraggedCardId = null;


/**
 * Tracks the current column we are hovering over
 * @type {string|null}
 */
let currentHoveredColumn = null;


/**
 * Handles the dragover event by preventing the default behavior.
 * Also maintains the currentHoveredColumn state for tracking.
 *
 * @param {DragEvent} ev - The dragover event object.
 */
function dragoverHandler(ev) {
    ev.preventDefault();
    
    const columnCategory = ev.currentTarget.id;

    if (currentHoveredColumn !== columnCategory) {
        currentHoveredColumn = columnCategory;
    }
}


/**
 * Handles when a dragged element leaves a column.
 * We need to make sure we're really leaving the column, not just moving between elements.
 *
 * @param {string} columnId - The ID of the column being left.
 */
function removeHighlightCardContainer(columnId) {
    const relatedTarget = event.relatedTarget;
    const currentTarget = document.getElementById(columnId);
    
    if (currentTarget && relatedTarget && 
        (currentTarget.contains(relatedTarget) || currentTarget === relatedTarget)) {
        return;
    }
    
    const placeholder = document.getElementById('placeholder');
    if (placeholder && placeholder.parentElement.id === columnId) {
        placeholder.remove();
    }
    
    if (currentHoveredColumn === columnId) {
        currentHoveredColumn = null;
    }
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
    
    if (existingPlaceholder && existingPlaceholder.parentElement === column) {
        return;
    }

    if (existingPlaceholder) {
        existingPlaceholder.remove();
    }

    const placeholder = document.createElement('div');
    placeholder.classList.add('highlight-card-container');
    placeholder.id = 'placeholder';
    column.appendChild(placeholder);
}


/**
 * Sets the ID of the task that is currently being dragged.
 *
 * @param {string|number} taskId - The ID of the task being dragged.
 */
function startCardDragging(taskId) {
    currentDraggedCardId = taskId;
    const card = document.getElementById(taskId);
    card.classList.add('tilt-animation');
}


/**
 * Moves the dragged card to a new category, updates the task data,
 * removes the highlight, and re-renders the tasks.
 *
 * @param {string} category - The new category to which the task should be moved.
 * @param {string} columnCategory - The ID of the column where the task is being dropped.
 */
function moveCardTo(category, columnCategory) {
    const card = document.getElementById(currentDraggedCardId);
    card.classList.remove('tilt-animation');
    currentTasksData[currentDraggedCardId]['status'] = category;
    
    const placeholder = document.getElementById('placeholder');
    if (placeholder) {
        placeholder.remove();
    }
    
    currentHoveredColumn = null;
    updateTasksInDatabase(currentTasksData);
    renderTasks(filteredTasksData);
}