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

    /**
     * Clears all required input fields and removes validation errors when the clear button is clicked.
     * - Selects all required input fields and the clear button.
     * - When the clear button is clicked, all input fields are emptied.
     * - Removes the "invalid" class from input fields.
     * - Hides any displayed error messages.
     */
    clearButton.addEventListener("click", function () { // Clear-Button
        inputFields.forEach(input => {
            input.value = "";
            input.classList.remove("invalid");
            const errorMessage = input.closest(".form-group").querySelector(".error-message");
            if (errorMessage) errorMessage.style.display = "none";
        });
    });
});

