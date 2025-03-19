function showEditContactOverlayHTMLTemplate(contact) {
return `
 <div class="overlay">
        <div class="modal">
            <div class="sidebar">
                <div class="logo-container">
                    <img class="join-logo-edit-contact" src="../assets/img/Capa 2 (2).svg">
                </div>
                <h1>Edit contact</h1>
                <div class="horizontal-line"></div>
            </div>
            <div class="form-container" data-firebase-id="${contact.firebaseId}">
                <button class="close-btn" onclick="closeOverlayEditContact()">✖</button>
                <div class="profile-picture" id="profile-photo">
                    <img src="../assets/img/circle_orange.svg" alt="Profilbild">
                </div>
                <form class="form">
                    <div class="input-group">
                        <input type="text" placeholder="Name" value="${contact.name}" required>
                        <span class="icon">
                            <img src="../assets/icons/person_icon.svg" alt="User">
                        </span>
                    </div>
                    <div class="input-group">
                        <input type="email" placeholder="Email" value="${contact.email}" required>
                        <span class="icon">
                            <img src="../assets/icons/mail_icon.svg" alt="Email">
                        </span>
                    </div>
                    <div class="input-group">
                        <input type="tel" placeholder="Phone" value="${contact.phone}">
                        <span class="icon">
                            <img src="../assets/icons/call.svg" alt="Phone">
                        </span>
                    </div>
                    <div class="buttons">
                        <button type="button" class="delete" onclick="deleteContactFromEditOverlay()">Delete</button>
                        <button type="submit" class="save">Save<img class="create-check"
                                src="../assets/icons/check.svg"></button>
                    </div>
                </form>
            </div>
        </div>
   </div>
   `}