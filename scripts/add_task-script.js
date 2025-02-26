/**
 * Initializes the priority button functionality when the DOM is fully loaded.
 * - Selects all elements with the class "prio-btn".
 * - Adds a click event listener to each button.
 * - When a button is clicked:
 *   - Removes the "active" class from all buttons to ensure only one is active.
 *   - Adds the "active" class to the clicked button.
 */
document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll(".prio-btn");

    buttons.forEach(button => {
        button.addEventListener("click", function () {
            buttons.forEach(btn => btn.classList.remove("active"));

            this.classList.add("active");
        });
    });
});

/**
 * Validates required input fields and displays an error message when necessary.
 * - Selects all input fields with the "required" attribute.
 * - Adds event listeners to check input validity on focus and blur.
 * - If a required field is empty when focused or blurred, an error message is shown.
 * - If the field has content, the error message is hidden.
 */
document.addEventListener("DOMContentLoaded", function () {
    const inputFields = document.querySelectorAll("input[required]");
    const clearButton = document.querySelector(".clear");

    inputFields.forEach(input => {
        let clicked = false;

        input.addEventListener("focus", function () {
            clicked = true;
            checkValidity(this);
        });

        input.addEventListener("blur", function () {
            checkValidity(this);
        });
        /**
        * Checks if the required input field is empty and displays an error message if necessary.
        * - If the field is empty and has been clicked before, an error message appears.
        * - If the field contains text, the error message is hidden.
        * 
        * @param {HTMLInputElement} field - The input field to validate.
        */
        function checkValidity(field) {
            const errorMessage = field.closest(".form-group").querySelector(".error-message");
            if (clicked && !field.value.trim()) {
                errorMessage.style.display = "block";
                field.classList.add("invalid");
            } else {
                errorMessage.style.display = "none";
                field.classList.remove("invalid");
            }
        }
    });
});

    /**
 * Handles click events on the document and resets the form if the clicked element has the "clear-button" class.
 *
 * - Finds the closest form relative to the clicked button.
 * - Prevents the default reset action.
 * - Clears all validation error messages and removes the "invalid" class from input fields.
 * - Logs a success message when the form is reset.
 * - Logs an error if no form is found.
 *
 * @param {Event} event - The click event object.
 */
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("clear-button")) { 
            const form = event.target.closest("form"); 
    
            if (form) {
                event.preventDefault();
                form.reset();
    
                form.querySelectorAll(".error-message").forEach(error => {
                    error.style.display = "none";
                });
    
                form.querySelectorAll(".invalid").forEach(field => {
                    field.classList.remove("invalid");
                });
    
                console.log(`✅ Formular zurückgesetzt: ${form}`);
            } else {
                console.error("❌ Fehler: Kein zugehöriges Formular gefunden!");
            }
        }
    });
