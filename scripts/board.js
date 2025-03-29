/**
 * An array to store the data of individual tasks after fetching.
 * @type {Array}
 */
let currentTasksData;

/**
 * The maximum length of the task description before truncating.
 * @type {number}
 */
let maxLengthTaskDescription = 50;

/**
 * Initializes the application by fetching task data.
 */
async function init() {
    await fetchTasksData();
    renderTasks(currentTasksData);
}


/**
 * Renders all tasks onto the Kanban board.
 *
 * This function first clears all task containers and then iterates through the provided task object.
 * Each task (except the "counter" key) is passed to `renderTask` for rendering.
 *
 * @param {Object} tasks - An object containing task data, where each key (except "counter") represents a task ID.
 * @param {Object} tasks[].subtasks - An array of subtasks related to the task.
 * @param {boolean} tasks[].subtasks[].completed - Indicates whether a subtask is completed.
 * @param {string} tasks[].category - The category of the task.
 * @param {string} tasks[].title - The title of the task.
 * @param {string} tasks[].description - The description of the task.
 * @param {string[]} tasks[].assignedUsers - An array of user IDs assigned to the task.
 * @param {string} tasks[].priority - The priority level of the task.
 * @param {number} tasks[].status - The status of the task (1 = to-do, 2 = in-progress, 3 = await-feedback, 4 = done).
 */
async function renderTasks(tasks) {
    clearAllContainers();
    await mapContactsData();
    
    for (let taskId in tasks) {
        if (taskId !== 'counter') {
            renderTask(taskId, tasks[taskId]);
        }
    }
    createUserFeedbackForEmptyBoardContainers();
}

/**
 * Renders a single task into the appropriate container.
 *
 * @param {string} taskId - The ID of the task.
 * @param {Object} task - The task object containing details.
 */
function renderTask(taskId, task) {
    let container = getContainerByStatus(task.status);
    let { completedSubtasks, totalSubtasks, progressPercentage } = handleSubtaskProcess(task.subtasks);
    let taskHtml = generateTaskHtml(taskId, task, progressPercentage, completedSubtasks, totalSubtasks);

    container.innerHTML += taskHtml;
    updateCategoryClass(taskId, task.category);
    generateUserAvatars(task.assignedUsers, taskId);
}

/**
 * Calculates the progress of a task based on its subtasks.
 *
 * @param {Array} subtasks - The list of subtasks.
 * @returns {Object} An object containing completedSubtasks, totalSubtasks, and progressPercentage.
 */
function handleSubtaskProcess(subtasks) {
    let { completedSubtasks, totalSubtasks } = countSubtasks(subtasks);
    let progressPercentage = calculateSubtaskProgress(completedSubtasks, totalSubtasks);
    return { completedSubtasks, totalSubtasks, progressPercentage };
}

/**
 * Clears all task containers on the board.
 */
function clearAllContainers() {
    ['to-do', 'in-progress', 'await-feedback', 'done'].forEach(id => {
        let container = document.getElementById(id);
        if (container) container.innerHTML = '';
    });
}

/**
 * Retrieves the corresponding container element based on the task status.
 *
 * @param {number} status - The status of the task (1 = to-do, 2 = in-progress, 3 = await-feedback, 4 = done).
 * @returns {HTMLElement} The corresponding container element.
 */
function getContainerByStatus(status) {
    let statusMap = {
        1: 'to-do',
        2: 'in-progress',
        3: 'await-feedback',
        4: 'done'
    };

    return document.getElementById(statusMap[status]);
}

/**
 * Counts the total number of subtasks and the number of completed subtasks.
 * 
 * @param {Object} subtasks - An object containing subtasks.
 * @returns {{ completedSubtasks: number, totalSubtasks: number }} - The count of completed and total subtasks.
 */
function countSubtasks(subtasks) {
    if (!subtasks) return { completedSubtasks: 0, totalSubtasks: 0 };

    let totalSubtasks = Object.keys(subtasks).length;
    let completedSubtasks = Object.values(subtasks).reduce(
        (count, subtask) => count + (subtask.completed ? 1 : 0),
        0
    );

    return { completedSubtasks, totalSubtasks };
}

/**
 * Calculates the completion percentage of subtasks.
 * 
 * This function takes the number of completed subtasks and the total number of subtasks 
 * and calculates the progress as a percentage. If there are no subtasks, the progress is 0%.
 * 
 * @param {number} completed - The number of completed subtasks.
 * @param {number} total - The total number of subtasks.
 * @returns {number} - The completion percentage (0 to 100).
 */
function calculateSubtaskProgress(completed, total) {
    return total > 0 ? (completed / total) * 100 : 0;
}

/**
 * Generates the HTML for a task card.
 * 
 * @param {string} taskId - The unique ID of the task.
 * @param {Object} task - The task object containing all relevant data.
 * @param {number} progressPercentage - The completion percentage of the subtasks.
 * @param {number} completedSubtasks - The number of completed subtasks.
 * @param {number} totalSubtasks - The total number of subtasks.
 * @returns {string} - The generated HTML string for the task card.
 */
function generateTaskHtml(taskId, task, progressPercentage, completedSubtasks, totalSubtasks) {
    let truncatedTaskDescription = truncateTaskDescription(task.description || 'No description');
    let priorityImage = getPriorityImage(task.priority || 'default');
    return boardCardTemplate(
        taskId,
        task.category,
        task.title,
        truncatedTaskDescription || 'No description',
        progressPercentage,
        completedSubtasks,
        totalSubtasks,
        priorityImage
    );
}

/**
 * Updates the category class of a task element based on the provided category.
 * It assigns either the 'user-story' or 'technical-task' class to the element with the ID 'category-task'
 * inside the task element with the given taskId.
 *
 * @param {string} taskId - The ID of the task element in the DOM.
 * @param {string} category - The category of the task, either 'User Story' or 'Technical Task'.
 * @throws {Error} Throws an error if the taskId element or the category-task element is not found.
 */
function updateCategoryClass(taskId, category) {
    let categoryElement = document.getElementById(taskId).querySelector('#category-task');

    if (category === 'User Story') {
        categoryElement.classList.add('user-story');
        categoryElement.classList.remove('technical-task');
    } else if (category === 'Technical Task') {
        categoryElement.classList.add('technical-task');
        categoryElement.classList.remove('user-story');
    }
}

/**
 * Truncates a string to a specified length and adds '...' if the string is longer.
 * @param {string} text - The text to truncate.
 * @param {number} maxLengthTaskDescription - The maximum length of the string before truncating.
 * @returns {string} - The truncated string with '...' if necessary.
 */
function truncateTaskDescription(text) {
    if (text.length > maxLengthTaskDescription) {
        return text.substring(0, maxLengthTaskDescription) + '...';
    }
    return text;
}

/**
 * Generates user avatar HTML based on assigned users.
 * @param {string[]} users - An array of user names.
 * @param {string} id - The ID for the container element.
 * @param {Array} currentContactsData - Local array with contact data.
 * @returns {void}
 */
function generateUserAvatars(users, id, currentContactsData) {
    let userIcons = document.getElementById(`user-icons-${id}`);
    if (!users || users.length === 0) {
        userIcons.innerHTML = "";
    } else {
        userIcons.innerHTML = "";
        users.forEach(assignedUser => {
            let userDetails = getContactDetails(assignedUser);
            if (userDetails) {
                userIcons.innerHTML += UserAvatarTemplate(userDetails);
            }
        });
    }
}

/**
 * Retrieves the color and initials of a specific user from the local contacts data.
 * 
 * @param {string} assignedUser - The name of the user to search for.
 * @returns {{color: string, initials: string} | null} - An object containing the user's color and initials, or null if not found.
 */
function getContactDetails(assignedUser) {
    let contact = currentContactsData.find(contact => contact.name === assignedUser);
    return contact ? { color: contact.color, initials: contact.initials } : null;
}

/**
 * Returns the corresponding image path based on the task priority.
 * @param {string} priority - The priority level ('low', 'medium', 'urgent').
 * @returns {string} - The file path of the corresponding priority image.
 */
function getPriorityImage(priority) {
    switch (priority.toLowerCase()) {
        case 'low':
            return "../assets/icons/priority-low.svg";
        case 'medium':
            return "../assets/icons/priority-normal.svg";
        case 'urgent':
            return "../assets/icons/priority-high.svg";
        default:
            return "../assets/icons/priority-normal.svg";
    }
}

/**
 * Updates empty board containers with a template message.
 */
function createUserFeedbackForEmptyBoardContainers() {
    let boardContainerIds = getBoardContainers();

    for (let id in boardContainerIds) {
        let boardContainer = document.getElementById(id);
        if (isEmptyContainer(boardContainer)) {
            boardContainer.innerHTML = emptyBoardContainerTemplate(boardContainerIds[id]);
        }
    }
}

/**
 * Checks if a board container is empty.
 * @param {HTMLElement} boardContainer - The board container element.
 * @returns {boolean} - Returns true if the board container is empty, false otherwise.
 */
function isEmptyContainer(boardContainer) {
    return boardContainer && boardContainer.innerHTML.trim() === '';
}

/**
 * Returns an object containing board container IDs and their corresponding messages.
 * @returns {Object} - An object where keys are container IDs and values are messages.
 */
function getBoardContainers() {
    return {
        'to-do': 'No tasks To do',
        'in-progress': 'No tasks In progress',
        'await-feedback': 'No tasks Awaiting feedback',
        'done': 'No tasks Done'
    };
}