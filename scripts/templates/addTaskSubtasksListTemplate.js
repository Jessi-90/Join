function addTaskSubtasksListTemplate() {
    return `
    <li class="subtask-item">
         <span class="subtask-text"></span>
         <div class="subtask-actions">
             <button class="subtask-edit-btn" onclick="editSubtask(this)">
                 <img src="../assets/icons/subtask-edit.svg" alt="Edit">
             </button>
             <div class="subtask-separator"></div>
              <button class="subtask-delete-btn" onclick="deleteSubtask(this)">
                 <img src="../assets/icons/subtask-delete.svg" alt="Delete">
             </button>
         </div>
     </li>
    `;
 } 
