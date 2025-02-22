/**
 * Waits for the DOM to be fully loaded, selects necessary elements, 
 * and logs an error if the user button or dropdown content is not found.
 */
  document.addEventListener("DOMContentLoaded", function () {

    const header = document.querySelector(".header");
    const userButton = document.getElementById("userButton");
    const dropdownContent = document.getElementById("dropdownContent");

    if (!userButton || !dropdownContent) {
        console.error("User button or dropdown content not found!");
        return;
    }


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