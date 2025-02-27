/**
 * Initializes the contacts page.
 * 
 * This function selects the `<main>` element in the document and injects the 
 * HTML returned by `renderContacts()` into the `main` element. 
 * 
 * This is the main entry point for rendering the contact page layout after the page loads.
 */
function initContacts() {
    const mainElement = document.querySelector('main');
    mainElement.innerHTML = renderContacts();
}

/**
 * Sets up the page initialization process.
 * 
 * This event listener waits for the entire HTML document to be fully loaded 
 * (including all HTML tags). Once the DOM is ready, it calls `initContacts` 
 * to render the contact page.
 */
document.addEventListener('DOMContentLoaded', initContacts);

/**
 * Returns a random color from a predefined color palette.
 * This ensures that contact icons have varied colors.
 *
 * @returns {string} A random hex color code (e.g., "#FF5733").
 */
function getRandomColor() {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FFD700', '#20B2AA'];
    return colors[Math.floor(Math.random() * colors.length)];
}