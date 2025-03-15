/**
 * Initializes the application after the DOM has fully loaded.
 * 
 * This event listener ensures that:
 * - Contact data is fetched asynchronously via `fetchContactsData()`.
 * - The greeting message is updated based on the logged-in user and current time using `summaryGreetingUser()`.
 * 
 * @listens DOMContentLoaded
 * @async
 */
document.addEventListener("DOMContentLoaded", async () => {
    await fetchContactsData();
    summaryGreetingUser(); 
});


/**
 * Updates the greeting message based on the logged-in user's name and current time.
 * Assumes that `loggedInUserEmail` contains the email of the logged-in user.
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

    document.querySelector(".greeting").textContent = greetingText + ",";
    document.querySelector("#greetingName").textContent = getUserName();
}


/**
 * Retrieves the name of the currently logged-in user or returns "Guest" if no user is found.
 * 
 * This function:
 * - Logs the `userType` stored in localStorage.
 * - Checks if the user is in guest mode.
 * - If in guest mode, logs a message and returns "Guest".
 * - Calls `getLoggedInUser()` to retrieve the logged-in user's data.
 * - Logs the detected user information.
 * - Returns the user's name if found; otherwise, defaults to "Guest".
 * 
 * @returns {string} The name of the logged-in user or "Guest" if no user is found.
 */
function getUserName() {
    console.log("UserType in localStorage:", localStorage.getItem("userType"));

    if (localStorage.getItem("userType") === "guest") {
        console.log("Gast-Modus erkannt.");
        return "Guest";
    }

    const loggedInUser = getLoggedInUser();
    console.log("Erkannter Benutzer:", loggedInUser);

    return loggedInUser ? loggedInUser.name : "Guest";
}


/**
 * Retrieves the logged-in user from sessionStorage.
 * 
 * This function:
 * - Logs an attempt to retrieve the user.
 * - Checks if a user exists in sessionStorage.
 * - If no user is found, logs a warning and returns `null`.
 * - If a user is found, parses the JSON string into an object.
 * - Logs the retrieved user object for debugging.
 * - Returns the logged-in user object.
 * 
 * @returns {Object|null} The logged-in user object if found, otherwise `null`.
 */
function getLoggedInUser() {
    console.log("Suche nach Benutzer in sessionStorage...");
    
    let loggedInUser = sessionStorage.getItem("currentUser");

    if (!loggedInUser) {
        console.warn("Kein Benutzer in sessionStorage gefunden.");
        return null;
    }

    loggedInUser = JSON.parse(loggedInUser);
    console.log("Benutzer gefunden:", loggedInUser);

    return loggedInUser;
}