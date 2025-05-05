/**
 * Determines whether the device is a mobile device in landscape orientation.
 * Checks if the screen is wider than tall, the width is below a mobile threshold,
 * and the device supports touch input.
 *
 * @returns {boolean} True if the device is a mobile in landscape orientation with touch support.
 */
function isMobileLandscape() {
    const isLandscape = window.innerWidth > window.innerHeight;
    const isMobile = window.innerWidth < 768;
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    return isLandscape && isMobile && hasTouch;
}


  /**
 * Handles UI adjustments when the device orientation changes.
 * If the device is a mobile in landscape mode, it hides all main content and shows a warning.
 * Otherwise, it shows the content and hides the warning.
 */
function handleOrientationChange() {
  const warning = document.getElementById('landscapeWarning');
  const mainContent = document.querySelector('main');
  const signUpContent = document.querySelector('.sign-up-content');
  const loginPage = document.querySelector('.log-in-page');

  const allContentElements = [mainContent, signUpContent, loginPage].filter(Boolean);
  if (isMobileLandscape()) {
    warning.classList.remove('d-none');
    allContentElements.forEach(el => el.style.display = 'none');
  } else {
    warning.classList.add('d-none');
    allContentElements.forEach(el => el.style.display = '');
  }
}


/**
 * Registers event listeners for handling changes in device orientation and screen size.
 * 
 * These listeners invoke `handleOrientationChange` to adjust the UI based on whether the
 * device is a mobile device in landscape mode:
 * 
 * - `resize`: Triggered when the browser window is resized.
 * - `orientationchange`: Triggered when the device's orientation changes (e.g., from portrait to landscape).
 * - `load`: Triggered when the page is fully loaded.
 */
window.addEventListener('resize', handleOrientationChange);
window.addEventListener('orientationchange', handleOrientationChange);
window.addEventListener('load', handleOrientationChange);