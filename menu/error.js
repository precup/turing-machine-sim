/* gErrorMenu is unique amongst the menus in that it does not directly control a 
 * contiguous subset of the DOM. It does control the .errors element, but it also
 * injects elements into the modals when appropriate. It handles everything related
 * to displaying errors. */

var gErrorMenu =
  {
    DISPLAY_TIME: 2100,
    FADE_OUT_TIME: 400,
    MAX_ERRORS: 3
  };
  
/* Displays a string @message in the .errors element. If persistent
 * is set to true, never times out. Otherwise, fades out after 
 * DISPLAY_TIME ms. Classes the error with the string @className
 * in case the caller needs to interact with it. */
gErrorMenu.displayMessage = function (message, persistent, className) {
  var selection = d3.select (".errors")
    .append ("span")
    .text (message)
    .classed (className, true);
    
  if (persistent != true) {
    selection.transition ()
    .delay (gErrorMenu.DISPLAY_TIME)
    .duration (gErrorMenu.FADE_OUT_TIME)
    .ease ("cubic")
    .style ("opacity", 0)
    .remove ();
  }
    
  var errors = d3.select (".errors").selectAll ("span").size ();
  
  d3.select (".errors")
    .selectAll ("span")
    .filter (function (junk, i) {
      return i < errors - gErrorMenu.MAX_ERRORS;
    })
    .remove ();
};
  
/* Same as above, except using "error" as a default value for
 * @className. */
gErrorMenu.displayError = function (message, persistent) {
  gErrorMenu.displayMessage (message, persistent, "error");
};

/* Injects an error into the modal with classname @modal.
 * The error displays a string @message. */
gErrorMenu.displayModalError = function (modal, message) {
    d3.select ("." + modal)
      .select (".modal-content")
      .insert ("p", ":first-child")
      .classed ("modal-description", true)
      .classed ("error", true)
      .text (message);
};

/* Clears all injected modal errors from every modal. */
gErrorMenu.clearModalErrors = function () {
  d3.selectAll (".modal-description.error").remove ();
};