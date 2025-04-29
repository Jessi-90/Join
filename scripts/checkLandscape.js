function isMobileLandscape() {
    const isLandscape = window.innerWidth > window.innerHeight;
    const isMobile = window.innerWidth < 768;
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    return isLandscape && isMobile && hasTouch;
  }


  function handleOrientationChange() {
    const warning = document.getElementById('landscapeWarning');
    const main = document.querySelector('main');

    if (isMobileLandscape()) {
      warning.classList.remove('d-none');
      main.classList.add = 'd-none';
    } else {
      warning.classList.add('d-none');
      main.classList.remove = 'd-none';
    }
  }


  window.addEventListener('resize', handleOrientationChange);
  window.addEventListener('orientationchange', handleOrientationChange);
  window.addEventListener('load', handleOrientationChange);