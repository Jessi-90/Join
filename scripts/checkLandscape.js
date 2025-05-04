function isMobileLandscape() {
    const isLandscape = window.innerWidth > window.innerHeight;
    const isMobile = window.innerWidth < 768;
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    return isLandscape && isMobile && hasTouch;
  }


  function isMobileLandscape() {
    const isLandscape = window.innerWidth > window.innerHeight;
    const isMobile = window.innerWidth < 768;
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    return isLandscape && isMobile && hasTouch;
  }
  
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

  window.addEventListener('resize', handleOrientationChange);
  window.addEventListener('orientationchange', handleOrientationChange);
  window.addEventListener('load', handleOrientationChange);