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

function removeExistingLayout() {
  const selectors = ["header", "aside", "footer"];
  selectors.forEach(selector => {
    const element = document.querySelector(selector);
    if (element) element.remove();
  });
}

function insertMobileLayoutForGuest() {
  insertHTML(beforeSigningUpMobileHeader(), "prepend");
  insertHTML(beforeSigningUpMobileFooter(), "append");
}

function insertDesktopLayoutForGuest() {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = beforeSigningUpNavbar();

  const newHeader = tempDiv.querySelector("header");
  const newAside = tempDiv.querySelector("aside");

  if (newAside) document.body.prepend(newAside);
  if (newHeader) document.body.prepend(newHeader);
}

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


document.addEventListener("DOMContentLoaded", () => {
  redirectToLoginPage();
  replaceNavbarForGuests();
  setActiveButtonForMobile();
});


window.addEventListener("resize", () => {
  if (isPolicyOrLegalNoticePage()) {
    replaceNavbarForGuests();
    setActiveButtonForMobile();
  }
});