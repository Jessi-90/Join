document.addEventListener("DOMContentLoaded", function () {
    const header = document.querySelector(".header");

    
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

   
    function toggleDropdown(event) {
        event.stopPropagation(); 
        dropdownContent.classList.toggle("show");
    }

   
    userButton.addEventListener("click", toggleDropdown);


    window.addEventListener("click", function (event) {
        if (!event.target.closest(".dropdown")) {
            dropdownContent.classList.remove("show");
        }
    });
});