/**
 * Generates the desktop version of the header and sidebar (navbar) 
 * for users who are not logged in.
 * Includes links to login, help, privacy policy, and legal notice pages.
 *
 * @returns {string} HTML string representing the guest desktop layout.
 */
function beforeSigningUpNavbar() {
    return `
      <header>
        <div class="header">
          <p class="headline-kanban">Kanban Project Management Tool</p>
          <div class="dropdown" id="dropdown">
            <a href="help.html"> 
                <img class="help-btn" src="../assets/img/help.png">
            </a>
            <div class="dropdown-content" id="dropdownContent">
                <a href="help.html">Help</a>
                <a href="legal_notice.html">Legal Notice</a>
                <a href="privacy_policy.html">Privacy Policy</a>
            </div>
          </div>
        </div>
      </header>
      <aside>
        <div class="navbar">
          <img class="join-logo" src="../assets/img/join-logo.svg">
          <div class="summary-menu">
              <a href="../index.html"> 
                <button class="menu-summary-btn login-navbar">
                  <img src="../assets/icons/login.svg">
                  <span class="navbar-size">Login</span>
                </button>
              </a>
          </div>
          <div class="summary-btn">
              <a href="privacy_policy.html">Privacy Policy</a>
              <a href="legal_notice.html">Legal Notice</a>
          </div>
        </div>
      </aside>
    `;
  }


/**
 * Generates the footer layout for mobile view when the user is not logged in.
 * Contains buttons for login, privacy policy, and legal notice.
 *
 * @returns {string} HTML string representing the guest mobile footer.
 */
function beforeSigningUpMobileFooter() {
    return `
      <footer>
        <div class="mobile-navbar">
          <a class="mobile-login-link" href="../index.html"> 
            <button class="menu-summary-btn login-navbar">
              <img class="mobile-login-img" src="../assets/icons/login.svg">
              <span class="navbar-size">Login</span>
            </button>
          </a>
          <span class="empty-container"></span>
          <a href="privacy_policy.html"> 
            <button class="menu-summary-btn">
              <span class="navbar-size">Privacy Policy</span>
            </button>
          </a>
          <a href="legal_notice.html">
            <button class="menu-summary-btn">
              <span class="navbar-size">Legal Notice</span>
            </button>
          </a>
        </div>
      </footer>
    `;
}


/**
 * Generates the header layout for mobile view when the user is not logged in.
 * Includes the Join logo, title, and a help button.
 *
 * @returns {string} HTML string representing the guest mobile header.
 */
function beforeSigningUpMobileHeader() {
    return `
      <header>
        <div class="header">
          <img class="mobile-join-logo" src="../assets/img/join-logo-dark.svg" alt="join-logo">
          <p class="headline-kanban">Kanban Project Management Tool</p>
          <div class="dropdown" id="dropdown">
            <a href="help.html">
              <img class="help-btn" src="../assets/img/help.png">
            </a>
          </div>
        </div>
      </header>
    `;
}