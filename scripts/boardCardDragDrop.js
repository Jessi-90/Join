/**
 * The ID of the currently dragged card.
 * @type {string|number}
 */
let currentDraggedCardId = null;


/**
 * Tracks the current column we are hovering over
 * @type {string|null}
 */
let currentHoveredColumn = null;


/**
 * Interval for automatic scrolling when dragging the card near the edge of the screen.
 * @type {NodeJS.Timeout | null} 
 */
let autoScrollInterval = null;


/**
 * The threshold (in pixels) from the top or bottom of the screen at which auto-scrolling starts.
 * @type {number} 
 */
const scrollThreshold = 80;


/**
 * The speed (in pixels) at which the screen scrolls when auto-scrolling is triggered.
 * @type {number} 
 */
const scrollSpeed = 10;


/**
 * The initial vertical position of the touch event when the user starts interacting with the card.
 * @type {number} 
 */
let initialTouchY = 0;


/**
 * A flag that indicates whether the user is in a "long tap" state, meaning the card is being dragged.
 * @type {boolean} 
 */
let longTapActive = false;


/**
 * A timer that tracks the duration of the touch event to detect long taps.
 * @type {NodeJS.Timeout | null} 
 */
let longPressTimer = null;


/**
 * Adds global event listeners to manage automatic scrolling while dragging cards:
 *
 * - `dragover`: Triggers `handleMouseDragScroll` to start scrolling the board when a dragged card is near the top or bottom edge.
 * - `dragleave`: Triggers `clearAutoScrollOnMouseLeave` to stop auto-scrolling when the dragged item leaves the scrollable area.
 * - `drop`: Triggers `clearAutoScrollOnDrop` to stop auto-scrolling once the card is dropped.
 */
document.addEventListener('dragover', handleMouseDragScroll);
document.addEventListener('dragleave', clearAutoScrollOnMouseLeave);
document.addEventListener('drop', clearAutoScrollOnDrop);



/**
 * Enables mobile drag functionality for all elements with the class 'card'.
 *
 * This function selects all card elements on the page and applies mobile-specific
 * drag behavior to each one by calling `enableMobileCardDragging` with the card element
 * and its ID.
 *
 * @function enableMobileDragForAllCards
 * @returns {void}
 */
function enableMobileDragForAllCards() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
    const cardId = card.id;
    enableMobileCardDragging(card, cardId);
    });

    }



/**
 * Updates the 'draggable' attribute of all card elements based on the current screen width.
 *
 * If the screen width is less than 1024 pixels (mobile view), the 'draggable' attribute
 * is removed from each card. Otherwise, it is set to 'true' to enable desktop drag-and-drop.
 *
 * @function updateDraggableAttributes
 * @returns {void}
 */   
function updateDraggableAttributes() {
    const isMobile = window.innerWidth < 1024;
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        if (isMobile) {
            card.removeAttribute('draggable');
        } else {
        card.setAttribute('draggable', 'true');
        }
    });
}
        


updateDraggableAttributes();


/**
 * Handles window resize events to update draggable attributes and enable mobile drag functionality.
 *
 * - Calls `updateDraggableAttributes` to adjust the 'draggable' attribute of card elements
 *   based on the current screen width.
 * - If the screen width is less than 1024 pixels (mobile view), it ensures that mobile drag
 *   functionality is enabled for each card that hasn't already been initialized for mobile dragging.
 *
 * This ensures responsive behavior and appropriate drag-and-drop support across devices.
 *
 * @event window#resize
 */
window.addEventListener('resize', () => {
    updateDraggableAttributes();
    
    if (window.innerWidth < 1024) {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            if (!card.dataset.mobileDragEnabled) {
                enableMobileCardDragging(card, card.id);
                card.dataset.mobileDragEnabled = "true";
            }
        });
    }
});
    
            

/**
 * Handles the dragover event by preventing the default behavior.
 * Also maintains the currentHoveredColumn state for tracking.
 *
 * @param {DragEvent} ev - The dragover event object.
 */
function dragoverHandler(ev) {
    ev.preventDefault();

    const columnCategory = ev.currentTarget.id;

    if (currentHoveredColumn !== columnCategory) {
        currentHoveredColumn = columnCategory;
    }
}


/**
 * Handles when a dragged element leaves a column.
 * We need to make sure we're really leaving the column, not just moving between elements.
 *
 * @param {string} columnId - The ID of the column being left.
 */
function removeHighlightCardContainer(event, columnId) {
    const relatedTarget = event.relatedTarget;
    const currentTarget = document.getElementById(columnId);

    if (currentTarget && relatedTarget &&
        (currentTarget.contains(relatedTarget) || currentTarget === relatedTarget)) {
        return;
    }

    const placeholder = document.getElementById('placeholder');
    if (placeholder && placeholder.parentElement.id === columnId) {
        placeholder.remove();
    }

    if (currentHoveredColumn === columnId) {
        currentHoveredColumn = null;
    }
}


/**
 * Highlights the target column by adding a placeholder element
 * to indicate where the dragged card can be dropped.
 *
 * @param {string} columnCategory - The ID of the column to highlight.
 */
function highlightCardContainer(columnCategory) {
    const column = document.getElementById(columnCategory);
    const existingPlaceholder = document.getElementById('placeholder');

    if (existingPlaceholder && existingPlaceholder.parentElement === column) {
        return;
    }

    if (existingPlaceholder) {
        existingPlaceholder.remove();
    }

    const placeholder = document.createElement('div');
    placeholder.classList.add('highlight-card-container');
    placeholder.id = 'placeholder';
    column.appendChild(placeholder);
}


/**
 * Sets the ID of the task that is currently being dragged.
 *
 * @param {string|number} taskId - The ID of the task being dragged.
 */
function startCardDragging(taskId) {
    currentDraggedCardId = taskId;
    const card = document.getElementById(taskId);
    card.classList.add('tilt-animation');
}


/**
 * Moves the dragged card to a new category, updates the task data,
 * removes the highlight, and re-renders the tasks.
 *
 * @param {string} category - The new category to which the task should be moved.
 * @param {string} columnCategory - The ID of the column where the task is being dropped.
 */

function moveCardTo(columnId) {
    const newStatus = getStatusFromColumnId(columnId);
    if (newStatus === null) {
        console.warn(`unknown column-ID: ${columnId}`);
        return;
    }
    
    const card = document.getElementById(currentDraggedCardId);
    card.classList.remove('tilt-animation');
    currentTasksData[currentDraggedCardId]['status'] = newStatus;
    
    const placeholder = document.getElementById('placeholder');
    if (placeholder) {
        placeholder.remove();
    }
    
    currentHoveredColumn = null;
    updateTasksInDatabase(currentTasksData);
    renderTasks(currentTasksData);
    }
    

/**
 * Enables mobile card dragging functionality by attaching touch event listeners to the card element.
 * When the user interacts with the card on a mobile device, the function handles touch events
 * such as starting the drag, moving the card, and ending the drag action.
 *
 * @param {HTMLElement} cardElement - The HTML element representing the card that will be dragged.
 * @param {string|number} cardId - The unique identifier of the card being dragged.
 */
function enableMobileCardDragging(cardElement, cardId) {
    cardElement.addEventListener('touchstart', (e) =>
        handleTouchStart(e, cardElement, cardId)
    );
    cardElement.addEventListener('touchmove', (e) =>
        handleTouchMove(e, cardElement), { passive: false } 
    );
    cardElement.addEventListener('touchend', () =>
        handleTouchEnd(cardElement)
    );
}



/**
 * Handles the touchmove event when the user moves their finger while interacting with the card.
 * It updates the card's position, determines if a new column is being hovered over, and handles
 * automatic scrolling if the user moves their finger near the edges of the screen.
 *
 * @param {TouchEvent} e - The touchmove event object containing information about the touch movement.
 * @param {HTMLElement} cardElement - The HTML element representing the card being dragged.
 */
function handleTouchMove(e, cardElement) {
    if (!longTapActive) return;
    
    e.preventDefault();
    
    const touchY = e.touches[0].clientY;
    
    updateCardPosition(cardElement, touchY);
    updateHoveredColumn(e);
    handleAutoScroll(touchY);
    }


/**
 * Handles the touchstart event when a user begins interacting with a card on a mobile device.
 * It captures the initial touch position and sets a timer to detect if the user is performing
 * a long press (which will activate the drag functionality).
 *
 * @param {TouchEvent} e - The touchstart event object containing information about the touch event.
 * @param {HTMLElement} cardElement - The HTML element representing the card that is being interacted with.
 * @param {string|number} cardId - The unique identifier for the card being interacted with.
 */
function handleTouchStart(e, cardElement, cardId) {
    e.preventDefault();
    initialTouchY = e.touches[0].clientY;

    longPressTimer = setTimeout(() => {
        longTapActive = true;
        currentDraggedCardId = cardId;
        cardElement.classList.add('tilt-animation');
        cardElement.style.pointerEvents = 'none'; 
    }, 500);
}

/**
 * Handles the touchmove event when the user moves their finger while interacting with the card.
 * It updates the card's position, determines if a new column is being hovered over, and handles
 * automatic scrolling if the user moves their finger near the edges of the screen.
 *
 * @param {TouchEvent} e - The touchmove event object containing information about the touch movement.
 * @param {HTMLElement} cardElement - The HTML element representing the card being dragged.
 */
function handleTouchEnd(cardElement) {
    clearTimeout(longPressTimer);
    clearInterval(autoScrollInterval);

    if (longTapActive && currentHoveredColumn) {
        moveCardTo(currentHoveredColumn);
    }

    cardElement.style.transform = '';
    cardElement.style.position = '';
    cardElement.style.zIndex = '';
    cardElement.style.pointerEvents = ''; 
    longTapActive = false;
    currentHoveredColumn = null;
}


/**
 * Updates the position of the card while it is being dragged by the user.
 * The card's position is adjusted based on the difference between the initial touch position
 * and the current touch position along the vertical axis (Y-axis).
 *
 * @param {HTMLElement} cardElement - The HTML element representing the card being dragged.
 * @param {number} touchY - The current vertical position of the touch in the viewport (Y-coordinate).
 */
function updateCardPosition(cardElement, touchY) {
    const deltaY = touchY - initialTouchY;
    cardElement.style.position = 'absolute';
    cardElement.style.top = `${cardElement.offsetTop + deltaY}px`;
    initialTouchY = touchY;
}


/**
 * Checks if the user is hovering over a different column while dragging the card.
 * If a new column is hovered over, it highlights that column to indicate where the card can be dropped.
 *
 * @param {TouchEvent} e - The touchmove event object containing information about the touch position.
 */
function updateHoveredColumn(e) {
    const elementAtTouch = document.elementFromPoint(
        e.touches[0].clientX,
        e.touches[0].clientY
    );
    const column = elementAtTouch?.closest('.column');

    if (column && column.id !== currentHoveredColumn) {
        highlightCardContainer(column.id);
        currentHoveredColumn = column.id;
    }
}


/**
 * Handles the automatic scrolling of the container while dragging a card.
 * If the user drags the card close to the top or bottom of the screen, the container will automatically scroll.
 *
 * @param {number} touchY - The current vertical touch position (Y-coordinate) from the touch event.
 */
function handleAutoScroll(touchY) {
    clearInterval(autoScrollInterval);
    const scrollContainer = document.scrollingElement || document.documentElement;

    if (!scrollContainer) return;

    if (touchY > window.innerHeight - scrollThreshold) {
        autoScrollInterval = setInterval(() =>
            scrollContainer.scrollBy(0, scrollSpeed), 16);
    } else if (touchY < scrollThreshold) {
        autoScrollInterval = setInterval(() =>
            scrollContainer.scrollBy(0, -scrollSpeed), 16);
    }
}


/**
 * Handles automatic scrolling while dragging a card with the mouse on smaller screens.
 * If the mouse cursor moves near the top or bottom edge of the viewport during a drag,
 * the board scrolls in that direction.
 *
 * This function only runs on devices with a screen width less than 1024px.
 *
 * @param {MouseEvent} e - The dragover event containing the mouse position.
 */
function handleMouseDragScroll(e) {
    if (window.innerWidth >= 1024) return;
    const mouseY = e.clientY;
    handleAutoScroll(mouseY);
}


/**
 * Stops automatic scrolling when the mouse leaves the drag area.
 * This prevents unintended scrolling when the user is no longer interacting with the board.
 */
function clearAutoScrollOnMouseLeave() {
    clearInterval(autoScrollInterval);
}


/**
 * Stops automatic scrolling when a drag-and-drop operation ends with a drop.
 * Ensures the board does not continue scrolling after the card is released.
 */
function clearAutoScrollOnDrop() {
    clearInterval(autoScrollInterval);
}


/**
 * Returns a numeric status code based on the provided column ID.
 *
 * This function maps specific column ID strings (used in a task board or Kanban-style UI)
 * to corresponding numeric status codes. It supports both short and extended column ID formats.
 *
 * Mapping:
 * - 'to-do' or 'to-do-column' → 1
 * - 'in-progress' or 'in-progress-column' → 2
 * - 'await-feedback' or 'await-feedback-column' → 3
 * - 'done' or 'done-column' → 4
 *
 * @function getStatusFromColumnId
 * @param {string} columnId - The ID of the column to map.
 * @returns {number|null} The corresponding status code, or `null` if the ID is unrecognized.
 */

function getStatusFromColumnId(columnId) {
    const map = {
        'to-do': 1,
        'in-progress': 2,
        'await-feedback': 3,
        'done': 4,
        'to-do-column': 1,
        'in-progress-column': 2,
        'await-feedback-column': 3,
        'done-column': 4
    };
    return map[columnId] || null;
}
    
    