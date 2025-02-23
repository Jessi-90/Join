function showAddTaskOverlay() {
    let addTaskOverlayRef = document.getElementById('addTaskOverlay');
    addTaskOverlayRef.innerHTML = "";
    addTaskOverlayRef.innerHTML += showAddTaskOverlayHTMLTemplate();
    addTaskOverlayRef.classList.remove('d-none');
}