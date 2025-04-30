/**
 * Opens the overlay for editing a contact.
 */
function openOverlayEditContact() {
    document.getElementById("overlay-edit-contact").style.display = "flex";
}


/**
 * Closes the overlay for editing a contact.
 * Mobile overlay is only closed on screens with width <= 768px.
 */
function closeOverlayEditContact() {
    const editContactOverlay = document.querySelector(".overlay");
    editContactOverlay.style.display = "none";
    
    if (window.innerWidth <= 768) {
        const mobileOverlay = document.getElementById('mobile-edit-contact-action-btn-overlay');

        mobileOverlay.classList.add('d-none');
        document.removeEventListener("click", closeOverlayOnClickOutside);
    }
}