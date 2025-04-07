/**
 * Displays the Add Task Overlay and animates its appearance with a delay.
 * 
 * @param {number} status - The status of the task being added.
 * Possible values:
 * 1 - To do
 * 2 - In progress
 * 3 - Await feedback
 * 4 - Done
 * 
 * The function updates the overlay HTML content, makes it visible, and 
 * adds an animation effect for smooth appearance. It uses the global 
 * variable `currentTaskStatus` to store the provided status value for 
 * further use during task creation.
 */
function showAddTaskOverlay(status) {
    let addTaskOverlayRef = document.getElementById('addTaskOverlay');
    currentTaskStatus = status;
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