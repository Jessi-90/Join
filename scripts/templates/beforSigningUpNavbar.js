function beforeSigningUpNavbar () {
 return `
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
<div class="navbar">
<img class="join-logo" src="../assets/img/join-logo.svg">
<div class="summary-menu">
    <a href="index.html"> <button class="menu-summary-btn login-navbar"><img src="../assets/icons/login.svg"><span
                class="navbar-size">Login</span></button></a>
 
</div>
<div class="summary-btn">
    <a href="privacy_policy.html">Privacy Police</a>
    <a href="legal_notice.html">Legal notice</a>
</div>
</div>
  `;
}