let currentDraggedCardId;


function dragoverHandler(ev) {
    ev.preventDefault();
  }

function startCardDragging(taskId) {
    currentDraggedCardId = taskId;
    console.log(currentTasksData);
    console.log(currentDraggedCardId);
}

function moveCardTo(category) {
    currentTasksData[currentDraggedCardId]['status'] = category;
    renderTasks(currentTasksData);
}