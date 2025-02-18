function renderContactDetail() {
    return `
        <div class="single-contact-detail-header">
            <p class="circle-orange contact-short">%{contact.short}</p>
            <div class="single-contact-detail-name">
                <h3>${contact.name}</h3>
                <div class="single-contact-detail-buttons">
                    <button class="btn-no-bg"><img src="./assets/icons/edit.svg" alt="edit_button">Edit</button>
                    <button class="btn-no-bg"><img src="./assets/icons/delete.svg" alt="delete_button">Delete</button>
                </div>
            </div>
        </div>
        <p class="contact-information-header">Contact Information</p>
        <div class="contact-information">
            <h4>Email</h4>
            <a href="mailto:${contact.email}">${contact.email}</a>
            <h4>Phone</h4>
            <a href="tel:+${contact.phone}">+${contact.phone}</a>
        </div>
    `;
}