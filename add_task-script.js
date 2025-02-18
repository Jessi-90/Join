document.addEventListener("DOMContentLoaded", function () {  // Prio Button Function
    const buttons = document.querySelectorAll(".prio-btn");

    buttons.forEach(button => {
        button.addEventListener("click", function () {
            buttons.forEach(btn => btn.classList.remove("active"));
            
            this.classList.add("active");
        });
    });
});


document.addEventListener("DOMContentLoaded", function () { // This field is required!
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

    
    clearButton.addEventListener("click", function () { // Clear-Button
        inputFields.forEach(input => {
            input.value = ""; 
            input.classList.remove("invalid"); 
            const errorMessage = input.closest(".form-group").querySelector(".error-message");
            if (errorMessage) errorMessage.style.display = "none"; 
        });
    });
});

