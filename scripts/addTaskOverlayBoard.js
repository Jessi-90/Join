/**
 * Displays the Add Task Overlay and animates its appearance with a delay.
 * 
 * The function dynamically generates the overlay content using the 
 * provided HTML template, makes the overlay visible, and applies
 * animation effects. Additionally, it sets up a click event listener
 * to handle interactions within the overlay container.
 * 
 * The listener ensures that clicks outside certain elements, such as
 * the dropdown options or toggle button, close the dropdown menu.
 */
function showAddTaskOverlay() {
    let addTaskOverlayRef = document.getElementById('addTaskOverlay');
    addTaskOverlayRef.innerHTML = ""; 
    addTaskOverlayRef.innerHTML += showAddTaskOverlayHTMLTemplate();
    addTaskOverlayRef.classList.remove('d-none');
    
    setTimeout(() => {
        let overlayContainerRef = document.querySelector('.add-task-overlay-container');
        overlayContainerRef.classList.add('show');
        setupOverlayClickListenerForAssignedToDropdown();
    }, 10);
}


/**
 * Sets up a click event listener for the overlay container to handle interactions with the dropdown menu.
 * 
 * Ensures that clicks outside specific elements, such as the dropdown options 
 * (`dropdownOptions`) and the toggle button (`selected-option`), close the dropdown menu if it is visible.
 */
function setupOverlayClickListenerForAssignedToDropdown() {
    const overlayContainer = document.querySelector('.add-task-overlay-container');
    const dropdown = document.getElementById('dropdownOptions');
    const toggleButton = document.querySelector('.selected-option');

    // Toggle-Button: Umschalten der Dropdown-Sichtbarkeit
    toggleButton.addEventListener('click', function(event) {
        event.stopPropagation(); // Verhindert Konflikte mit dem Overlay-Listener
        dropdown.classList.toggle('d-none'); // Dropdown ein-/ausschalten
    });

    // Listener für Klicks auf das Overlay
    overlayContainer.addEventListener('click', function(event) {
        // Ausnahme: Klick auf Dropdown oder Toggle-Button
        if (dropdown.contains(event.target) || toggleButton.contains(event.target)) {
            return; // Keine Aktion
        }

        // Dropdown schließen, falls sichtbar
        dropdown.classList.add('d-none');
    });
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