// /**
//  * Initializes the due date input to enforce DD/MM/YYYY format as the user types.
//  */
// function initDueDateInput() {
//     const dueDateInput = document.getElementById("due-date");

//     dueDateInput.addEventListener("input", function () {
//         let value = cleanInput(this.value);
//         value = formatDueDate(value);
//         updateInputValue(dueDateInput, value);
//     });
// }


// /**
//  * Cleans the input value by removing all non-numeric characters.
//  * @param {string} input - The raw input value.
//  * @returns {string} The cleaned input value containing only numbers.
//  */
// function cleanInput(input) {
//     return input.replace(/[^0-9]/g, "");
// }


// /**
//  * Formats the input value to the DD/MM/YYYY format.
//  * Adds slashes after the day and month as necessary.
//  * @param {string} value - The cleaned input value.
//  * @returns {string} The formatted value in DD/MM/YYYY format.
//  */
// function formatDueDate(value) {
//     return value.replace(/^(\d{2})(\d{2})?(\d{0,4})?/, (match, day, month, year) => {
//         let result = day;
//         if (month) result += "/" + month;
//         if (year) result += "/" + year;
//         return result;
//     });
// }


// /**
//  * Updates the input field with the formatted value.
//  * @param {HTMLElement} inputField - The input field to update.
//  * @param {string} value - The formatted value to set.
//  */
// function updateInputValue(inputField, value) {
//     inputField.value = value;
// }


// /**
//  * Sets the current date into the input field with the ID "due-date".
//  * The date is formatted as "dd/mm/yyyy".
//  */
// function setTodayDate() {
//     let dateInput = document.getElementById("due-date");
//     let today = new Date();
//     let formattedDate = formatDate(today);
//     dateInput.value = formattedDate;
// }


// /**
//  * Formats a given Date object into the format "dd/mm/yyyy".
//  * @param {Date} date - The Date object to format.
//  * @returns {string} The formatted date as a string in "dd/mm/yyyy" format.
//  */
// function formatDate(date) {
//     let day = String(date.getDate()).padStart(2, "0");
//     let month = String(date.getMonth() + 1).padStart(2, "0");
//     let year = date.getFullYear();
//     return `${day}/${month}/${year}`;
// }

  function initializeDatepicker(selector) {
    $(selector).datepicker({
      dateFormat: "dd/mm/yy",
      minDate: new Date()
    });
  
    var today = new Date();
    var day = String(today.getDate()).padStart(2, '0');
    var month = String(today.getMonth() + 1).padStart(2, '0'); // Monate sind nullbasiert
    var year = today.getFullYear();
    var formattedDate = day + '/' + month + '/' + year;
  
    $(selector).val(formattedDate);
  }
  
  $(function() {
    initializeDatepicker("#datepicker");
  });
  