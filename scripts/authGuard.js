/**
 * Checks if a user or guest is logged in.
 * If not, redirects the user to the login page.
 */
function checkIfUserIsLoggedIn() {
    const userType = localStorage.getItem("userType");
    const isOnLoginPage = window.location.pathname === "/index.html" || window.location.pathname === "/";
  
    if (userType !== "loggedIn" && userType !== "guest" && !isOnLoginPage) {
      window.location.href = "/index.html";
    }
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    checkIfUserIsLoggedIn();
  });