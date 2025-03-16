/**
 * Retrieves the initials of the currently logged-in user from sessionStorage or localStorage.
 * If no user is found, returns the default initials "G".
 * 
 * @returns {string} The initials of the currently logged-in user or "G" if no user is found.
 */
function getCurrentUserInitials() {
    let currentUser = sessionStorage.getItem("currentUser");

    if (!currentUser) {
        currentUser = localStorage.getItem("currentUser");
    }

    currentUser = currentUser ? JSON.parse(currentUser) : { initials: "G" };

    let initials = currentUser.initials;

    return initials;
}

/**
 * Renders the initials of the currently logged-in user on the user button.
 * Retrieves the initials using the getCurrentUserInitials function and updates the user button's text and class.
 */
function renderCurrentUserInitials() {
    let initials = getCurrentUserInitials();
    let userButton = document.getElementById('userButton');
    userButton.innerText = initials;
    userButton.classList.add('userCredentials');
}