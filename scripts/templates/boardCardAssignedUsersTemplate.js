/**
 * Generates the HTML template for a user's avatar.
 * @param {{color: string, initials: string}} userDetails - Object containing user color and initials.
 * @returns {string} - HTML string for the user avatar.
 */
function boardCardAssignedUsersTemplate(userDetails) {
    return `
    <div class="user-avatar" style="background-color: ${userDetails.color};">
        ${userDetails.initials}
    </div>`;
}