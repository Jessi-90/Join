/**
 * Checks if a user or guest is logged in.
 * If not, redirects the user to the login page.
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


function redirectToLoginPage() {
  const loginCheck = checkIfUserIsLoggedIn();

  if (loginCheck.isNotLoggedIn && loginCheck.isNotOnLoginPage &&
      !isPolicyOrLegalNoticePage()) {
    window.location.href = "../index.html";
  }
}


function isPolicyOrLegalNoticePage() {
  const path = window.location.pathname;
  return path.includes("privacy_policy.html") || path.includes("legal_notice.html");
}


function replaceNavbarForGuests() {
  const loginCheck = checkIfUserIsLoggedIn();
  if (!loginCheck.isLoggedIn && isPolicyOrLegalNoticePage()) {
    const header = document.querySelector("header");
    const aside = document.querySelector("aside");
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = beforeSigningUpNavbar();

    const newHeader = tempDiv.querySelector("header");
    const newAside = tempDiv.querySelector("aside");

    if (header && newHeader) header.replaceWith(newHeader);
    if (aside && newAside) aside.replaceWith(newAside);
  }
}


document.addEventListener("DOMContentLoaded", () => {
  redirectToLoginPage();
  replaceNavbarForGuests();
});