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
 * 1. Prevents the default behavior of the button (in case it's part of a form).
 * 2. Stores the user type as 'guest' in localStorage, so the guest status can be checked on other pages.
 * 3. Logs a message to the console for debugging purposes.
 * 4. Redirects the user to the `summary.html` page, completing the guest login process.
 * 
 * @param {Event} event - The click event object passed by the event listener.
 */
function guestLogIn(event) {
    event.preventDefault();
    localStorage.setItem('userType', 'guest');
    window.location.href = './html/summary.html';
}
