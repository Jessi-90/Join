/**
 * Generates an HTML template string for displaying the Add Contact overlay.
 *
 * @returns {string} The HTML template as a string.
 */
function showAddContactOverlayHTMLTemplate() {
    return `
<div class="overlay" id="overlay">
    <div class="modal" onclick="event.stopPropagation();">
    <div class="sidebar">
        <div class="logo-container">
            <img class="join-logo-add-contact" src="../assets/img/join-logo.svg">
        </div>
        <h1>Add contact</h1>
        <p>Tasks are better with a team!</p>
        <div class="horizontal-line"></div>
        <div class="divider"></div>
    </div>
    <div class="form-container">
        <button class="close-btn" onclick="closeAddContactOverlay(event)">✖</button>
        <div class="profile-picture">
            <img src="../assets/img/user-avatar-placeholder.svg" alt="Profilbild">
        </div>
        <form>
            <div class="input-group">
                <input type="text" placeholder="Name">
                <span class="icon">
                    <img src="../assets/img/person.svg" alt="User">
                </span>
            </div>
            <div class="input-group">
                <input type="email" placeholder="Email">
                <span class="icon">
                    <img src="../assets/img/mail.svg" alt="Email">
                </span>
            </div>
            <div class="input-group">
                <input type="tel" placeholder="Phone">
                <span class="icon">
                    <img src="../assets/icons/call.svg" alt="Phone">
                </span>
            </div>
            <div class="add-contact-buttons">
                <button class="add-contact-btn btn-light" id="cancel-contact" onclick="closeAddContactOverlay(event)">Cancel <img class="cancel-x"
                        src="../assets/icons/cancel.svg"></button>
                <button class="add-contact-btn btn-dark" id="create-contact" onclick="createContact(event)">Create contact <img class="create-check"
                        src="../assets/icons/check.svg"></button>
            </div>
        </form>
    </div>
</div>
</div>
    `;
}