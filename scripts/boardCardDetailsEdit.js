/**
 * Function to show the Edit Card Details Overlay and animate the appearance with a delay.
 */
function showBoardCardDetailsEdit() {
    let boardCardOverlayRef = document.getElementById('boardCardDetails');
    boardCardOverlayRef.innerHTML = "";
    boardCardOverlayRef.innerHTML += cardDetailsEditOverlayHTMLTemplate();
    boardCardOverlayRef.classList.remove('d-none');
    setTimeout(() => {
        let overlayContainerRef = document.querySelector('.board-card-edit-container');
        overlayContainerRef.classList.add('show');
    }, 10);
}


/**
 * Closes the Edit Card Details Overlay, if clicked outside the container or the close button.
 * Clicks inside the container prevent closing.
 * The overlay will be hidden with a delay.
 * 
 * @param {Event} event - click-event.
 */
function closeBoardCardDetails(event) {
    let overlay = document.getElementById('boardCardDetails');
    let overlayContainer = document.querySelector('.board-card-edit-container');

    if (event.target.closest('.board-card-edit-container') && !event.target.closest('.close-btn')) {
        event.stopPropagation();
        return;
    }

    overlayContainer.classList.remove('show');

    setTimeout(() => {
        overlay.classList.add('d-none');
    }, 300);
}