let currentDraggedCardId;


function dragoverHandler(ev) {
    ev.preventDefault();
  }

function startCardDragging(taskId) {
    currentDraggedCardId = taskId;
}