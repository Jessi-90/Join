/**
 * Checks if the user is logged in or accessing as a guest.
 * Also checks whether the current page is the login page.
 *
 * @returns {{ isLoggedIn: boolean, isNotLoggedIn: boolean, isNotOnLoginPage: boolean }}
 */
function checkIfUserIsLoggedIn() {
  const userType = localStorage.getItem("userType");
  const isOnLoginPage = window.location.pathname === "/index.html" || window.location.pathname === "/";
  const isLoggedIn = userType === "loggedIn" || userType === "guest";

  return {
    isLoggedIn,
    isNotLoggedIn: !isLoggedIn,
    isNotOnLoginPage: !isOnLoginPage
  };
}


/**
 * Redirects the user to the login page if they are not logged in
 * and not currently on a public page like privacy policy or legal notice.
 */
function redirectToLoginPage() {
  const loginCheck = checkIfUserIsLoggedIn();

  if (loginCheck.isNotLoggedIn && loginCheck.isNotOnLoginPage &&
      !isPolicyOrLegalNoticePage()) {
    window.location.href = "../index.html";
  }
}


/**
 * Checks if the current page is either the privacy policy or legal notice page.
 *
 * @returns {boolean} True if on privacy policy or legal notice page.
 */
function isPolicyOrLegalNoticePage() {
  const path = window.location.pathname;
  return path.includes("privacyPolicy.html") || path.includes("legalNotice.html");
}


/**
 * Replaces the full navigation layout (header, aside, footer) with a simplified guest layout,
 * if the user is not logged in and currently on a guest-accessible page.
 */
function replaceNavbarForGuests() {
  const loginCheck = checkIfUserIsLoggedIn();
  const onGuestPage = isPolicyOrLegalNoticePage();
  const isMobile = window.innerWidth <= 768;

  if (!loginCheck.isLoggedIn && onGuestPage) {
    removeExistingLayout();

    if (isMobile) {
      insertMobileLayoutForGuest();
    } else {
      insertDesktopLayoutForGuest();
    }
  }
}


/**
 * Removes existing navigation layout elements: header, aside, and footer.
 */
function removeExistingLayout() {
  const selectors = ["header", "aside", "footer"];
  selectors.forEach(selector => {
    const element = document.querySelector(selector);
    if (element) element.remove();
  });
}


/**
 * Inserts the mobile-specific guest layout into the DOM.
 */
function insertMobileLayoutForGuest() {
  insertHTML(beforeSigningUpMobileHeader(), "prepend");
  insertHTML(beforeSigningUpMobileFooter(), "append");
}


/**
 * Inserts the desktop-specific guest layout into the DOM.
 */
function insertDesktopLayoutForGuest() {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = beforeSigningUpNavbar();

  const newHeader = tempDiv.querySelector("header");
  const newAside = tempDiv.querySelector("aside");

  if (newAside) document.body.prepend(newAside);
  if (newHeader) document.body.prepend(newHeader);
}


/**
 * Inserts a given HTML string into the DOM at the specified position.
 *
 * @param {string} htmlString - The HTML content to insert.
 * @param {"prepend"|"append"} [position="append"] - Whether to prepend or append the content.
 */
function insertHTML(htmlString, position = "append") {
  const temp = document.createElement("div");
  temp.innerHTML = htmlString;
  const element = temp.firstElementChild;

  if (position === "prepend") {
    document.body.prepend(element);
  } else {
    document.body.appendChild(element);
  }
}


/**
 * Initializes functionality when the DOM content is fully loaded.
 * - Redirects the user to the login page if necessary.
 * - Replaces the navigation bar with a guest version for public pages.
 * - Sets the active button in the mobile navigation.
 */
document.addEventListener("DOMContentLoaded", () => {
  redirectToLoginPage();
  replaceNavbarForGuests();
  setActiveButtonForMobile();
});


/**
 * Reapplies the guest navigation layout and sets the active mobile button
 * when the window is resized, but only on public pages like privacy policy or legal notice.
 */
window.addEventListener("resize", () => {
  if (isPolicyOrLegalNoticePage()) {
    replaceNavbarForGuests();
    setActiveButtonForMobile();
  }
});