/**
 * Function to show the Edit Contact Overlay and animate the appearance with a delay.
 */
function showEditContactOverlay() {
        let editContactOverlayRef = document.getElementById('editContactOverlay');
        editContactOverlayRef.innerHTML = "";
        editContactOverlayRef.innerHTML += showEditContactOverlayHTMLTemplate();
        editContactOverlayRef.classList.remove('d-none');
        editContactOverlayRef.classList.add('show');
        setTimeout(() => {
            let overlayContainerRef = document.querySelector('.overlay');
            overlayContainerRef.classList.add('show');
        }, 10);

        document.getElementById('editContactOverlay').addEventListener('click', closeEditContactOverlay);
    }


/**
 * Closes the Edit Contact Overlay, if clicked outside the container or the close button.
 * Clicks inside the container prevent closing.
 * The overlay will be hidden with a delay.
 * 
 * @param {Event} event - click-event.
 */
function closeEditContactOverlay(event) {
    let overlay = document.getElementById('editContactOverlay');
    let overlayContainer = document.querySelector('.overlay');

    if (event.target.closest('.overlay') && !event.target.closest('.close-btn')) {
        event.stopPropagation();
        return;
    }

    overlayContainer.classList.remove('show');

    setTimeout(() => {
        overlay.classList.add('d-none');
    }, 300);
}