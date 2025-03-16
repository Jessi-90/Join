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
            <img class="join-logo-add-contact" src="../img/icon/Capa 2 (2).svg">
        </div>
        <h1>Add contact</h1>
        <p>Tasks are better with a team!</p>
        <div class="divider"></div>
    </div>
    <div class="form-container">
        <button class="close-btn" onclick="closeAddContactOverlay(event)">✖</button>
        <div class="profile-picture">
            <img src="../img/icon/Group 13.svg" alt="Profilbild">
        </div>
        <form>
            <div class="input-group">
                <input type="text" placeholder="Name">
                <span class="icon">
                    <img src="../img/icon/person.svg" alt="User">
                </span>
            </div>
            <div class="input-group">
                <input type="email" placeholder="Email">
                <span class="icon">
                    <img src="../img/icon/mail.svg" alt="Email">
                </span>
            </div>
            <div class="input-group">
                <input type="tel" placeholder="Phone">
                <span class="icon">
                    <img src="../img/icon/call.svg" alt="Phone">
                </span>
            </div>
            <div class="add-contact-buttons">
                <button class="add-contact-cancel" id="cancel-contact" onclick="closeAddContactOverlay(event)">Cancel <img class="cancel-x"
                        src="../img/icon/iconoir_cancel.svg"></button>
                <button class="add-contact-create" id="create-contact">Create contact <img class="create-check"
                        src="../img/icon/check.svg"></button>
            </div>
        </form>
    </div>
</div>
</div>
    `;
}