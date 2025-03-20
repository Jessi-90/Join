/**
 * Function to show the Edit Contact Overlay and animate the appearance with a delay.
 */
function showEditContactOverlay(firebaseId) {
    let contact = currentContactsData.find(c => c.firebaseId === firebaseId);
    let editContactOverlayRef = document.getElementById('editContactOverlay');

    editContactOverlayRef.innerHTML = showEditContactOverlayHTMLTemplate(contact);
    editContactOverlayRef.classList.remove('d-none');
    editContactOverlayRef.classList.add('show');

    setTimeout(() => {
        let overlayContainerRef = document.querySelector('.overlay');
        if (overlayContainerRef) {
            overlayContainerRef.classList.add('show');
        }
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
function closeEditContactOverlay(event = null) {
    let overlay = document.getElementById('editContactOverlay');
    let overlayContainer = document.querySelector('.overlay');

    if (event && event.target.closest('.overlay') && !event.target.closest('.close-btn')) {
        event.stopPropagation();
        return;
    }

    overlayContainer.classList.remove('show');

    setTimeout(() => {
        overlay.classList.add('d-none');
    }, 300);
}