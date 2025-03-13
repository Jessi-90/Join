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

    const loggedInUser = getLoggedInUser(); 
    const userName = loggedInUser ? loggedInUser.name : "Guest";

    document.querySelector(".greeting").textContent = greetingText + ",";
    document.querySelector("#greetingName").textContent = userName;
}


/**
 * Retrieves the logged-in user from `currentContactsData` based on the email stored in localStorage.
 * @returns {Object|null} - The logged-in user object or null if not found.
 */
function getLoggedInUser() {
    const loggedInEmail = localStorage.getItem("loggedInUserEmail");
    console.log("Logged in email:", loggedInEmail);
    console.log("Contacts data:", currentContactsData);

    if (!loggedInEmail || !currentContactsData) return null;

    return currentContactsData.find(contact => contact.email === loggedInEmail) || null;
}