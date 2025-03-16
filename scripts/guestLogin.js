 /**
 * 1. `DOMContentLoaded` fires when the document is fully loaded.
 * 2. The button with the ID `guest-login` is selected.
 * 3. If the button exists, a click event listener is attached.
 * 4. When clicked, the `guestLogIn` function is executed.
 */
document.addEventListener('DOMContentLoaded', () => {
    const guestLoginButton = document.getElementById('guest-login');
    if (guestLoginButton) {
        guestLoginButton.addEventListener('click', guestLogIn);
    }
});


/**
 * Handles the guest login process.
 * 
 * This function:
 * - Prevents the default button behavior (in case it's part of a form).
 * - Clears any existing user session by removing `currentUser` from sessionStorage.
 * - Removes the `loggedInUserEmail` from localStorage to ensure no user is logged in.
 * - Sets the `userType` in localStorage to "guest" to indicate guest mode.
 * - Redirects the user to the `summary.html` page to complete the guest login process.
 * 
 * @param {Event} event - The click event triggering the guest login.
 */
function guestLogIn(event) {
    event.preventDefault();
    
    sessionStorage.removeItem('currentUser'); 
    localStorage.removeItem('loggedInUserEmail'); 

    localStorage.setItem('userType', 'guest'); 

    window.location.href = './html/summary.html';
}
