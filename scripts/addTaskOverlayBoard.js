/**
 * Function to show the Add Task Overlay
 */
function showAddTaskOverlay() {
    let addTaskOverlayRef = document.getElementById('addTaskOverlay');
    addTaskOverlayRef.innerHTML = "";
    addTaskOverlayRef.innerHTML += showAddTaskOverlayHTMLTemplate();
    addTaskOverlayRef.classList.remove('d-none');
}


/**
 * Closes the Add Task Overlay, if clicked outside the container or the close button.
 * Clicks inside the container prevent closing.
 * 
 * @param {Event} event - click-event.
 */
function closeAddTaskOverlay(event) {
    let overlay = document.getElementById('addTaskOverlay');

    if (event.target.closest('.add-task-overlay-container') && !event.target.closest('.close-btn')) {
        event.stopPropagation();
        return;
    }

    overlay.classList.add('d-none');
}