let currentDraggedCardId;


function dragoverHandler(ev) {
    ev.preventDefault();
    const columnCategory = ev.currentTarget.id;
    const existingPlaceholder = document.getElementById('placeholder');
    if (!existingPlaceholder || existingPlaceholder.parentElement.id !== columnCategory) {
        highlightCardContainer(columnCategory);
    }
}

function startCardDragging(taskId) {
    currentDraggedCardId = taskId;
}

function moveCardTo(category, columnCategory) {
    currentTasksData[currentDraggedCardId]['status'] = category;
    removeHighlightCardContainer(columnCategory);
    updateTasksInDatabase(currentTasksData)
    renderTasks(currentTasksData);
}

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

function removeHighlightCardContainer(columnCategory) {
    const column = document.getElementById(columnCategory);
    const placeholder = document.getElementById('placeholder');
    if (placeholder && placeholder.parentElement === column) {
        column.removeChild(placeholder);
    }
}