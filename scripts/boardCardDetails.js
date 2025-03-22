/**
 * Function to show the Card Details Overlay and animate the appearance with a delay.
 */
function showBoardCardDetails(taskId) {
    const task = currentTasksData[taskId];
    let addTaskOverlayRef = document.getElementById('boardCardDetails');
    addTaskOverlayRef.innerHTML = "";
    addTaskOverlayRef.innerHTML += cardDetailsOverlayHTMLTemplate(taskId);
    renderCardDetailsAssignedUsers(currentTasksData[taskId], taskId);
    // generateUserAvatars(task.assignedUsers, `${taskId}-detail`);
    addTaskOverlayRef.classList.remove('d-none');
    setTimeout(() => {
        let overlayContainerRef = document.querySelector('.board-card-detail-container');
        overlayContainerRef.classList.add('show');
    }, 10);
}


/**
 * Closes the Card Details Overlay, if clicked outside the container or the close button.
 * Clicks inside the container prevent closing.
 * The overlay will be hidden with a delay.
 * @param {Event} event - click-event.
 */
function closeBoardCardDetails(event) {
    let overlay = document.getElementById('boardCardDetails');
    let overlayContainer = document.getElementById('boardCardDetailContainer');

    if (event.target.closest('.board-card-detail-container') && !event.target.closest('.close-btn')) {
        event.stopPropagation();
        return;
    }

    overlayContainer.classList.remove('show');

    setTimeout(() => {
        overlay.classList.add('d-none');
    }, 300);
}

function renderCardDetailsAssignedUsers(task, taskId) {
    const assignedUsersContent = document.getElementById('cardDetailAssigneeContent');
    assignedUsersContent.innerHTML = "";
    for (let assigneeIndex = 0; assigneeIndex < task.assignedUsers.length; assigneeIndex++) {
        assignedUsersContent.innerHTML += cardDetailAssigneeContent(task, assigneeIndex, taskId);
        const user = [task.assignedUsers[assigneeIndex]];
        generateUserAvatars(user, `${taskId}-detail-${assigneeIndex}`);
    }
}