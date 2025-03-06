function guestLogIn(event) {

    if (event) event.preventDefault();
    localStorage.setItem('userType', 'guest');
    console.log('Weiterleitung wird ausgeführt');
    window.location.href = './html/summary.html';
}

