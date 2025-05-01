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

  if (loginCheck.isNotLoggedIn && loginCheck.isNotOnLoginPage ) {
    window.location.href = "../index.html";
  }
}


document.addEventListener("DOMContentLoaded", () => {
  redirectToLoginPage();
});