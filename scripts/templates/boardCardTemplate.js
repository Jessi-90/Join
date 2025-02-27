function boardCardTemplate() {
    return `
    <div class="card" id="${task.taskid}" draggable="true">
    <div class="card-header">
        <span class="card-category ${task.category}">${task.category}</span>
    </div>
    <h4 class="card-title">${task.title}</h4>
    <p class="card-description">${task.description}</p>
    <div class="card-subtasks-progress">
        <div class="progress-container">
            <div class="progress-bar">
            </div>
        </div>
        <div class="task-counter">
            1/2 Subtasks
        </div>
    </div>
    <div class="card-footer">
        <div class="user">
            ${task.assignedUser}
        </div>
        ${task.priority}
    </div>
</div>
`
}
