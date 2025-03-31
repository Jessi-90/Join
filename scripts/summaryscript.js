/**
 * Initializes the application after the DOM has fully loaded.
 * 
 * This event listener ensures that:
 * - Contact data is fetched asynchronously via `mapContactsData()`.
 * - The greeting message is updated based on the logged-in user and current time using `summaryGreetingUser()`, 
 *   but only if the relevant HTML elements (`.greeting` and `#greetingName`) exist in the DOM.
 * 
 * @listens DOMContentLoaded
 * @async
 */
document.addEventListener("DOMContentLoaded", async () => {
    await mapContactsData();

    if (document.querySelector(".greeting") && document.querySelector("#greetingName")) {
        summaryGreetingUser();
    }
});


/**
 * Updates the greeting message based on the current time of day and the logged-in user's name.
 * The greeting is displayed in an element with the class `.greeting` and the user's name is shown 
 * in an element with the ID `#greetingName`. 
 * 
 * The function checks the current hour and displays one of the following greetings:
 * - "Good morning" for 5 AM - 12 PM
 * - "Good afternoon" for 12 PM - 6 PM
 * - "Good evening" for 6 PM - 5 AM
 * 
 * If the elements are not found in the DOM, no changes are made.
 * 
 * @function
 * @returns {void}
 */
function summaryGreetingUser() {
    const hour = new Date().getHours();
    let greetingText = "Hello";

    if (hour >= 5 && hour < 12) {
        greetingText = "Good morning";
    } else if (hour >= 12 && hour < 18) {
        greetingText = "Good afternoon";
    } else {
        greetingText = "Good evening";
    }

    const greetingElement = document.querySelector(".greeting");
    const nameElement = document.querySelector("#greetingName");

    if (greetingElement && nameElement) {
        greetingElement.textContent = greetingText + ",";
        nameElement.textContent = getUserName();
    }
}


/**
 * Retrieves the name of the currently logged-in user or returns "Guest" if no user is found.
 * 
 * @returns {string} The name of the logged-in user or "Guest" if no user is found.
 */
function getUserName() {
  
    if (localStorage.getItem("userType") === "guest") {
        return "Guest";
    }

    const loggedInUser = getLoggedInUser();
    return loggedInUser ? loggedInUser.name : "Guest";
}


/**
 * Retrieves the logged-in user from sessionStorage.
 * 
 * @returns {Object|null} The logged-in user object if found, otherwise `null`.
 */
function getLoggedInUser() {
    
    let loggedInUser = sessionStorage.getItem("currentUser");

    if (!loggedInUser) {
        return null;
    }

    loggedInUser = JSON.parse(loggedInUser);

    return loggedInUser;
}