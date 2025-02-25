/**
 * Function to show the Add Task Overlay and animate the appearance with a delay.
 */
function showAddTaskOverlay() {
    let addTaskOverlayRef = document.getElementById('addTaskOverlay');
    addTaskOverlayRef.innerHTML = "";
    addTaskOverlayRef.innerHTML += showAddTaskOverlayHTMLTemplate();
    addTaskOverlayRef.classList.remove('d-none');
    setTimeout(() => {
        let overlayContainerRef = document.querySelector('.add-task-overlay-container');
        overlayContainerRef.classList.add('show');
    }, 10);
}


/**
 * Closes the Add Task Overlay, if clicked outside the container or the close button.
 * Clicks inside the container prevent closing.
 * The overlay will be hidden with a delay.
 * 
 * @param {Event} event - click-event.
 */
function closeAddTaskOverlay(event) {
    let overlay = document.getElementById('addTaskOverlay');
    let overlayContainer = document.querySelector('.add-task-overlay-container');

    if (event.target.closest('.add-task-overlay-container') && !event.target.closest('.close-btn')) {
        event.stopPropagation();
        return;
    }

    overlayContainer.classList.remove('show');

    setTimeout(() => {
        overlay.classList.add('d-none');
    }, 300);
}