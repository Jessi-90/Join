/**
 * Returns a random color from a predefined color palette.
 * This ensures that contact icons have varied colors.
 *
 * @returns {string} A random hex color code (e.g., "#FF5733").
 */
function getRandomColor() {
    const colors = ['#6E52FF', '#FC71FF', '#FFBB2B', '#1FD7C1', '#462F8A', '#20B2AA'];
    return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Returns the first characters of the first two words (if given) of the new contact in capital letters.
 * @param {string} name - The name of the contact.
 * @returns {string} The initials of the contact.
 */
function getContactInitials(name) {
    const nameParts = name.split(" ");
    let initials = nameParts[0].charAt(0).toUpperCase();
    if (nameParts.length > 1) {
        initials += nameParts[1].charAt(0).toUpperCase();
    }
    return initials;
}