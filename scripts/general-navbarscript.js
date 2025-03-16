/**
 * Initializes the navigation and dropdown functionality once the DOM is fully loaded.
 * Removes the user dropdown menu on specific pages where it is not needed.
 */
document.addEventListener("DOMContentLoaded", function () {
  let currentPage = window.location.pathname.split("/").pop();
  const header = document.querySelector(".header");
  const userButton = document.getElementById("userButton");
  const dropdownContent = document.getElementById("dropdownContent");
  let menuLinks = document.querySelectorAll(".summary-menu a");
  let footerLinks = document.querySelectorAll(".summary-btn a");

  const noDropdownPages = ["legal_notice.html", "privacy_policy.html"];
    
    if (noDropdownPages.includes(currentPage)) {
        const userDropdown = document.querySelector(".dropdown");
        if (userDropdown) {
            userDropdown.remove(); 
        }
        return; 
    }
    renderCurrentUserInitials();

    
  /**
   * Adds the `active` class to the appropriate navigation link and removes it from others.
   *
   * @param {NodeList} links - The collection of links to be checked.
   * @param {string} className - The class to be set for the active link.
   */
  function updateActiveLink(links, className) {
    links.forEach((link) => {
      let linkPage = link.getAttribute("href").split("/").pop();

      if (linkPage === currentPage) {
        link.classList.add(className);
        let button = link.querySelector(".menu-summary-btn");
        if (button) button.classList.add(className);
      }

      link.addEventListener("click", function () {
        links.forEach((l) => {
          l.classList.remove(className);
          let btn = l.querySelector(".menu-summary-btn");
          if (btn) btn.classList.remove(className);
        });
        this.classList.add(className);
        let button = this.querySelector(".menu-summary-btn");
        if (button) button.classList.add(className);
      });
    });
  }


  // Applies the `active` class to menu and footer links
  updateActiveLink(menuLinks, "active");
  updateActiveLink(footerLinks, "active");

  // Checks if the user button and dropdown element exist
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


/**
 * Logs out the current user and redirects to the login page.
 *
 * - If the user is a guest, it removes the "userType" from localStorage.
 * - If the user is a registered user, it removes their session data from
 *   localStorage and sessionStorage.
 * - If Firebase authentication is available, it signs the user out.
 * - Finally, it redirects the user to the index.html (login page).
 */
function logoutUser() {
  let userType = localStorage.getItem("userType");

  if (userType === "guest") {
      localStorage.removeItem("userType");
  } else {
      localStorage.removeItem("currentUser");
      sessionStorage.removeItem("currentUser");

      if (typeof firebase !== "undefined") {
        firebase.auth().signOut()
            .then(() => console.log("User ausgeloggt"))
            .catch(error => console.error("Fehler beim Ausloggen:", error));
    }
}

  window.location.href = "../index.html";
}