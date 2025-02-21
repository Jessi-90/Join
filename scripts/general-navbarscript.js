/**
 * Waits until the DOM is fully loaded before executing the script.
 */
document.addEventListener("DOMContentLoaded", function () {
    const header = document.querySelector(".header");

    
    /**
   * HTML template for the dropdown menu.
   */
    const dropdownHTML = `
        <div class="dropdown">
        <a href="help.html"> <img class="help-btn" src="../img/icon/help.png"></a>
            <button class="user-btn" id="userButton">☰</button>
            <div class="dropdown-content" id="dropdownContent">
                <a href="help.html">Help</a>
                <a href="legal_notice.html">Legal Notice</a>
                <a href="privacy_policy.html">Privacy Policy</a>
                <a href="log_out.html">Log out</a>
            </div>
        </div>
    `;

    header.insertAdjacentHTML("beforeend", dropdownHTML);

    const userButton = document.getElementById("userButton");
    const dropdownContent = document.getElementById("dropdownContent");


 /**
     * Toggles the visibility of the dropdown menu.
     * 
     * @param {Event} event - The click event.
     */
    function toggleDropdown(event) {
        event.stopPropagation();
        dropdownContent.classList.toggle("show");
    }

    userButton.addEventListener("click", toggleDropdown);


  /**
     * Closes the dropdown menu when clicking outside of it.
     * 
     * @param {Event} event - The click event.
     */
    window.addEventListener("click", function (event) {
        if (!event.target.closest(".dropdown")) {
            dropdownContent.classList.remove("show");
        }
    });
});