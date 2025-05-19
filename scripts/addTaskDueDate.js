/**
 * Initializes a jQuery UI datepicker on the given selector.
 * 
 * @param {string} selector - The jQuery selector for the input element where the datepicker will be applied.
 * 
 * The datepicker uses the format `dd/mm/yy` and disables all past dates.
 */
function initializeDatepicker(selector) {
  const today = new Date();

  if ($(selector).hasClass("hasDatepicker")) {
      $(selector).datepicker("destroy");
  }

  $(selector).datepicker({
      dateFormat: "dd/mm/yy",
      minDate: today
  });
}


/**
 * Sets the current date as the default value of the input field specified by the selector.
 * 
 * @param {string} selector - The jQuery selector for the input element whose value should be set.
 * 
 * The format used is `dd/mm/yyyy`.
 */
function setDefaultDate(selector) {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const formattedDate = day + '/' + month + '/' + year;
  
    $(selector).val(formattedDate);
}