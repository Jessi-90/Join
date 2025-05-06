/**
 * Initializes or removes the user dropdown menu based on the current page.
 *
 * If the current page is one that should not display the dropdown (e.g., legal notice or privacy policy),
 * the dropdown element is removed from the DOM. Otherwise, the current user's initials are rendered.
 *
 * @param {string} currentPage - The filename of the current page (e.g., "index.html").
 */
function initDropDown(currentPage) {
  const noDropdownPages = ["legal_notice.html", "privacy_policy.html"];

  if (noDropdownPages.includes(currentPage)) {
    const userDropdown = document.querySelector(".dropdown");
    if (userDropdown) {
      userDropdown.remove();
    }
    return;
  }
  renderCurrentUserInitials();
}


/**
 * Adds the `active` class to the appropriate navigation link and removes it from others.
 *
 * @param {NodeList} links - The collection of links to be checked.
 * @param {string} className - The class to be set for the active link.
 */
function updateActiveLink(links, className) {
  let currentPage = window.location.pathname.split("/").pop();
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


/**
 * Toggles the visibility of the dropdown menu.
 *
 * @param {Event} event - The click event.
 */
function toggleDropdown(event) {
  event.stopPropagation();
  dropdownContent.classList.toggle("show");
}


/**
 * Applies the "active" class to the current page's button in mobile view (below 768px).
 * This ensures the active navigation state is preserved for buttons in the mobile layout.
 * It compares the current page's filename with the href of each link in the summary menu.
 *
 * The "active" class is added to the button inside the <a> element if it matches the current page.
 * All other buttons will have the "active" class removed.
 */
function setActiveButtonForMobile() {
  if (window.innerWidth < 769) {
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".menu-summary-btn").forEach((btn) => {
      const parentLink = btn.closest("a");
      if (parentLink) {
        const href = parentLink.getAttribute("href").split("/").pop();
        if (href === currentPage) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      }
    });
  }
}


/**
 * Logs out the current user and clears all local/session data.
 * Signs out from Firebase if available, then redirects to login page.
 */
function logoutUser() {
  localStorage.clear();
  sessionStorage.clear();

  if (typeof firebase !== "undefined") {
    firebase.auth().signOut()
      .then(() => console.log("User successfully logged out."))
      .catch(error => console.error("Error while logging out:", error));
  }

  window.location.href = "../index.html";
}


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

  initDropDown(currentPage);
  updateActiveLink(menuLinks, "active");
  updateActiveLink(footerLinks, "active");
  setActiveButtonForMobile();

  if (userButton) {
    userButton.addEventListener("click", toggleDropdown);
  }
});


/**
 * Adds an event listener to resize the window and updates the active button state for mobile.
 * 
 * This function ensures the active button state is adjusted whenever the window is resized, 
 * specifically for mobile views.
 */
window.addEventListener("resize", () => {
  setActiveButtonForMobile();
});


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


/**
 * Hides the help button in the header when the current page is `help.html`.
 * This function listens for the `DOMContentLoaded` event, checks if the current page's path contains 
 * `help.html`, and if so, hides the element with the class `help-btn` by setting its `display` style to `none`.
 * 
 * @listens DOMContentLoaded - Ensures the function is executed after the DOM is fully loaded.
 */
window.addEventListener("DOMContentLoaded", () => {
  const helpBtn = document.querySelector(".help-btn");
  const currentPage = window.location.pathname;

  if (currentPage.includes("help.html") && helpBtn) {
      helpBtn.style.display = "none";
  }
});