/**
 * Stores the previous state of the viewport, indicating whether it was in mobile view.
 * Used to detect transitions between mobile and desktop views.
 *
 * @type {boolean}
 */
let previousIsMobileView = isMobileView();


/**
 * Checks if the current viewport width is 768px or smaller.
 * 
 * @returns {boolean} True if the viewport width is 768px or smaller, otherwise false.
 */
function isMobileView() {
    return window.innerWidth <= 768;
}


/**
 * Displays the contact detail view for mobile screens.
 * Ensures the detail wrapper is visible.
 */
function showContactDetailViewForMobile() {
    const detailWrapper = document.querySelector('.contact-details-view');
    if (detailWrapper) {
        detailWrapper.style.display = 'block';
        showMobileEditContactButton();
    }
}


/**
 * Hides the mobile edit contact button by adding the d-none class.
 */
function hideMobileEditContactButton() {
    const mobileEditContactBtn = document.getElementById('mobile-edit-contact-btn');
    if (mobileEditContactBtn) {
        mobileEditContactBtn.classList.add('d-none');
    }
}


/**
 * Hides the contact list view for mobile screens.
 * Ensures the contact list wrapper is not visible.
 */
function hideContactListViewForMobile() {
    const contactListWrapper = document.querySelector('.contact-list-view');
    if (contactListWrapper) {
        contactListWrapper.style.display = 'none';
    }
}


/**
 * Hides the mobile add contact button by adding the d-none class.
 */
function hideMobileAddContactButton() {
    const mobileAddContactBtn = document.getElementById('mobile-add-contact-btn');
    if (mobileAddContactBtn) {
        mobileAddContactBtn.classList.add('d-none');
    }
}


/**
 * Adds a mobile-friendly back button to the contact detail view.
 * The button is generated using an HTML template and inserted into the page dynamically.
 * 
 * The function ensures that the button is only added if it does not already exist.
 */
function addBackButtonToMobileDetail() {
    const detailHeader = document.querySelector('#header-container');
    const headerTitle = detailHeader.querySelector('h2');

    if (!document.getElementById('mobile-back-button') && detailHeader && headerTitle) {
        const wrapper = document.createElement('div');

        wrapper.innerHTML = contactsDetailViewMobileBackButtonTemplate();

        const backButton = wrapper.firstElementChild;

        backButton.addEventListener('click', closeMobileContactDetail);
        detailHeader.insertBefore(backButton, headerTitle.nextSibling);
    }
}


/**
 * Closes the detail view and returns to the contact list in mobile view.
 * Delegates tasks to helper functions for better readability and maintainability.
 */
function closeMobileContactDetail() {
    hideContactDetailViewForMobile();
    showContactListViewForMobile();
    showMobileAddContactButton();
    removeMobileBackButton();
    hideMobileEditContactButton();
}


/**
 * Hides the contact detail view for mobile screens.
 * Ensures the detail wrapper is not visible.
 */
function hideContactDetailViewForMobile() {
    const detailWrapper = document.querySelector('.contact-details-view');
    if (detailWrapper) {
        detailWrapper.style.display = 'none';
    }
}


/**
 * Shows the contact list view for mobile screens.
 * Ensures the contact list wrapper is visible.
 */
function showContactListViewForMobile() {
    const contactListWrapper = document.querySelector('.contact-list-view');
    if (contactListWrapper) {
        contactListWrapper.style.display = 'flex';
    }
}


/**
 * Shows the mobile add contact button by removing the d-none class.
 */
function showMobileAddContactButton() {
    const mobileAddContactBtn = document.getElementById('mobile-add-contact-btn');
    if (mobileAddContactBtn) {
        mobileAddContactBtn.classList.remove('d-none');
    }
}


/**
 * Removes the back button from the mobile detail view if it exists.
 */
function removeMobileBackButton() {
    const backButton = document.getElementById('mobile-back-button');
    if (backButton) {
        backButton.remove();
    }
}


/**
 * Handles contact detail toggling for screens 768px or smaller
 *
 * @param {Object} contact - The contact object to be displayed.
 */
function handleSmallScreenToggle(contact) {
    const container = document.getElementById('contact-detail');
    const currentOpenContact = container?.getAttribute('data-firebase-id') || null;

    if (currentOpenContact !== String(contact.firebaseId)) {
        openNewContact(contact);
    }
}


/**
 * Updates the mobile edit button container with the generated template.
 * 
 * @param {Object} contact - The contact object to be displayed.
 */
function updateMobileEditButtonContainer(contact) {
    const mobileEditButtonContainer = document.getElementById('mobile-edit-contact-btn-container');
    if (mobileEditButtonContainer) {
        mobileEditButtonContainer.innerHTML = editContactMobileButton(contact);
    }

    const contactDetailsView = document.querySelector('.contact-details-view');

    if (contactDetailsView && isDisplayBlock(contactDetailsView)) {
        showMobileEditContactButton();
    }
}


/**
 * Shows the mobile edit contact button by removing the d-none class 
 * only if the screen width is 768px or smaller.
 */
function showMobileEditContactButton() {
    if (window.innerWidth <= 768) {
        const mobileEditContactBtn = document.getElementById('mobile-edit-contact-btn');
        if (mobileEditContactBtn) {
            mobileEditContactBtn.classList.remove('d-none');
        }
    }
}


/**
 * Closes the mobile action button overlay when clicking outside of it.
 * 
 * This function checks if the user clicked outside the overlay and the 
 * edit contact overlay. If the click occurred outside both elements, 
 * it hides the mobile overlay and removes the event listener.
 * 
 * @param {Event} event - The click event
 */
function closeOverlayOnClickOutside(event) {
    const mobileOverlay = document.getElementById('mobile-edit-contact-action-btn-overlay');
    const editContactOverlay = document.querySelector(".overlay");

    if (mobileOverlay.contains(event.target)) {
        return;
    }

    if (editContactOverlay && editContactOverlay.style.display !== "none" && editContactOverlay.contains(event.target)) {
        return;
    }

    hideMobileOverlay();
    document.removeEventListener("click", closeOverlayOnClickOutside);
}


/**
 * Displays the overlay for mobile action buttons.
 * 
 * Removes the `d-none` class to make the overlay visible and ensures that 
 * an event listener is added to detect clicks outside of the overlay for closing it.
 */
function showMobileActionButtonsOverlay() {
    const overlay = document.getElementById('mobile-edit-contact-action-btn-overlay');

    overlay.classList.add('show');
    document.removeEventListener("click", closeOverlayOnClickOutside);

    setTimeout(() => {
        document.addEventListener("click", closeOverlayOnClickOutside);
    }, 10);
}


/**
 * Hides the mobile action button overlay.
 * 
 * This function removes the 'show' class from the mobile overlay
 * to hide it from view.
 */
function hideMobileOverlay() {
    const mobileOverlay = document.getElementById('mobile-edit-contact-action-btn-overlay');
    if (mobileOverlay) {
        mobileOverlay.classList.remove('show');
    }
}


/**
 * Handles viewport changes and updates the UI accordingly.
 */
function handleViewportChange() {
    const currentIsMobileView = isMobileView();

    if (!currentIsMobileView) {
        handleDesktopView();
    } else {
        closeMobileContactDetail();
    }

    previousIsMobileView = currentIsMobileView;
}


/**
 * Handles UI adjustments when switching to desktop view.
 */
function handleDesktopView() {
    removeMobileUIElements();
    showDesktopViews();
    
    if (previousIsMobileView) {
        closeContactDetail();
    }
}


/**
 * Removes UI elements that are specific to the mobile view.
 */
function removeMobileUIElements() {
    removeMobileBackButton();
    hideMobileOverlay();
    hideMobileEditContactButton();
}


/**
 * Displays the appropriate views for the desktop layout.
 */
function showDesktopViews() {
    showContactListViewForMobile();
    showContactDetailViewForMobile();
}


/**
 * Initializes the event listener to monitor viewport resizing.
 * 
 * This function adds an event listener that triggers `handleViewportChange`
 * whenever the window is resized, ensuring the UI adapts dynamically.
 */
function initViewportResizeListener() {
    window.addEventListener('resize', handleViewportChange);
}