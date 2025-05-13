/**
 * Event listener for the `DOMContentLoaded` event.
 * 
 * Executes initial data fetching and rendering processes once the DOM is fully loaded.
 * 
 * - Loads and processes contact data.
 * - Displays a greeting message if the corresponding elements exist.
 * - Fetches task data and renders the task overview.
 */
document.addEventListener("DOMContentLoaded", async () => {
    updateResponsiveTitleImage();
    await mapContactsData();

    if (document.querySelector(".greeting") && document.querySelector("#greetingName")) {
        summaryGreetingUser();
    }

    await fetchTasksData();
    renderNumberTasks();
    renderUpcomingDate();
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


/**
 * Renders the number of tasks for different statuses in the UI.
 * Retrieves task data, calculates task counts, and updates the HTML elements.
 */
function renderNumberTasks() {
    let tasksArray = mapTasksData();
    let numberTasksData = getNumberTasks(tasksArray);
    if (window.location.pathname.endsWith("summary.html")) {
        document.getElementById('numberTasksToDo').innerHTML = numberTasksData.numberTasksToDo;
        document.getElementById('numberTasksDone').innerHTML = numberTasksData.numberTasksDone;
        document.getElementById('numberTasksUrgent').innerHTML = numberTasksData.numberTasksUrgent;
        document.getElementById('numberTasksTotal').innerHTML = numberTasksData.numberTotalTasks;
        document.getElementById('numberTasksInProgress').innerHTML = numberTasksData.numberTasksInProgress;
        document.getElementById('numberTasksAwaitingFeedback').innerHTML = numberTasksData.numberTasksAwaitingFeedback;
    }
}


/**
 * Maps the current task data into an array of task objects.
 * Filters out only the valid tasks based on their key format.
 *
 * @returns {Array<Object>} An array of task objects with their ID and properties.
 */
function mapTasksData() {
    const tasksArray = Object.entries(currentTasksData)
        .filter(([key]) => key.startsWith('taskid_'))
        .map(([id, task]) => ({ id, ...task }));
    return tasksArray;
}


/**
 * Calculates the number of tasks in different categories.
 *
 * @param {Array<Object>} tasksArray - The array of task objects.
 * @returns {Object} An object containing counts for different task statuses and priorities.
 */
function getNumberTasks(tasksArray) {
    let numberTotalTasks = tasksArray.length;
    let numberTasksDone = tasksArray.filter(task => task.status === 4).length;
    let numberTasksAwaitingFeedback = tasksArray.filter(task => task.status === 3).length;
    let numberTasksInProgress = tasksArray.filter(task => task.status === 2).length;
    let numberTasksToDo = tasksArray.filter(task => task.status === 1).length;
    let numberTasksUrgent = tasksArray.filter(task => task.priority === "Urgent").length;
    return { numberTotalTasks, numberTasksDone, numberTasksAwaitingFeedback, numberTasksInProgress, numberTasksToDo, numberTasksUrgent };
}


/**
 * Finds the task with the nearest upcoming deadline that is not yet completed.
 *
 * @returns {Object|null} An object containing the next task and its formatted due date, or null if no task is found.
 */
function getUpcomingDeadlineTask() {
    let tasksArray = mapTasksData();
    const filteredTasks = tasksArray.filter(task => task.status !== 4);
    if (!filteredTasks.length) return null;
    const nextTask = filteredTasks.reduce((earliest, task) => {
        return new Date(task.dueDate) < new Date(earliest.dueDate) ? task : earliest;
    });
    let formattedDate = formatNextTaskDueDate(nextTask);
    return { nextTask, formattedDate };
}


/**
 * Renders the upcoming task deadline date in the UI.
 * If no upcoming task is found, displays "No" as a placeholder.
 */
function renderUpcomingDate() {
    let upcomingDateTask = getUpcomingDeadlineTask();
    if (!upcomingDateTask) {
        document.getElementById('dateDeadline').innerHTML = "No";
        return;
    }
    if (window.location.pathname.endsWith("summary.html")) {
        document.getElementById('dateDeadline').innerHTML = upcomingDateTask.formattedDate;
    }
}


/**
 * Formats the due date of a task into a human-readable string.
 * 
 * Converts the task's `dueDate` property into a formatted date string 
 * following the "Month Day, Year" format (e.g., "March 31, 2025").
 * 
 * @param {Object} task - The task object containing the due date.
 * @param {string} task.dueDate - The due date of the task in a valid date format.
 * @returns {string} The formatted due date as a string.
 */
function formatNextTaskDueDate(task) {
    const formattedDate = new Date(task.dueDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
    return formattedDate;
}


/**
 * Handles the initial greeting animation and dashboard visibility on page load.
 *
 * - If the viewport width is below 1380px, a greeting animation plays:
 *    - The greeting is shown briefly.
 *    - After 2 seconds, the greeting is hidden and the dashboard is revealed.
 *    - During the animation, the body has the class `animating`, which can be used
 *      in CSS to temporarily hide other elements (e.g., mobile navbar or header).
 * 
 * - If the viewport is 1380px or wider, the dashboard is shown immediately with no animation.
 * This creates a smoother experience for smaller screens by introducing a welcome transition.
 */
window.addEventListener('load', () => {
    const width = window.innerWidth;
    const greeting = document.querySelector('.greeting-wrapper');
    const dashboard = document.querySelector('.dashboard');
    updateResponsiveTitleImage();
    const shouldAnimate = width < 1380;

    if (shouldAnimate) {
        document.body.classList.add('animating');

        setTimeout(() => {
            if (greeting) greeting.classList.add('hidden');
            if (dashboard) dashboard.classList.add('visible');

            document.body.classList.remove('animating');
        }, 2000);
    } else {
        if (dashboard) dashboard.classList.add('visible');
    }
});


/**
 * Updates the title image source if the screen width is 570px or less.
 * This enables a mobile-optimized image for smaller devices.
 */
function updateResponsiveTitleImage() {
    if (window.innerWidth <= 570) {
        const titleImg = document.querySelector('.join-logo');
        if (titleImg) {
            titleImg.src = 'assets/img/join-title-responsive.png';
        }
    }
}


document.addEventListener("DOMContentLoaded", updateResponsiveTitleImage);
window.addEventListener("load", updateResponsiveTitleImage);