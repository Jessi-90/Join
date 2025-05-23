function showEditContactOverlayHTMLTemplate(contact) {
return `
 <div class="overlay">
        <div class="modal">
            <div class="sidebar">
                <div class="logo-container">
                    <img class="join-logo-edit-contact" src="../assets/img/join-logo.svg">
                </div>
                <h1>Edit contact</h1>
                <div class="horizontal-line"></div>
                <button class="close-btn">✖</button>
            </div>
            <div class="form-container" data-firebase-id="${contact.firebaseId}">
                <div class="contact-icon-placeholder-large" style="background-color: ${contact.color}">
                ${contact.initials}
                </div>
                <form class="form">
                    <div class="input-group">
                        <input id="editContactName" type="text" placeholder="Name" value="${contact.name}" required>
                        <span class="icon">
                            <img src="../assets/icons/person_icon.svg" alt="User">
                        </span>
                    </div>
                    <div class="input-group">
                        <input id="editContactEmail" type="email" placeholder="Email" value="${contact.email}" required>
                        <span class="icon">
                            <img src="../assets/icons/mail_icon.svg" alt="Email">
                        </span>
                    </div>
                    <div class="input-group">
                        <input id="editContactPhone" type="tel" placeholder="Phone" value="${contact.phone}">
                        <span class="icon">
                            <img src="../assets/icons/call.svg" alt="Phone">
                        </span>
                    </div>
                    <div class="buttons">
                        <button type="button" class="delete btn-light" onclick="deleteContactFromEditOverlay()">Delete</button>
                        <button id="saveContactButton" type="submit" class="save btn-dark" onclick="saveContactFromEditOverlay()">Save<img class="create-check"
                                src="../assets/icons/check.svg"></button>
                    </div>
                </form>
            </div>
        </div>
   </div>
   `}