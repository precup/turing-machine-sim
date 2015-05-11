var gErrorMenu =
  {
    DISPLAY_TIME: 2100,
    FADE_OUT_TIME: 400,
    MAX_ERRORS: 3
  };
  
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
  
gErrorMenu.displayError = function (message, persistent) {
  gErrorMenu.displayMessage (message, persistent, "error");
};

gErrorMenu.displayModalError = function (modal, message) {
    d3.select ("." + modal)
      .select (".modal-content")
      .insert ("p", ":first-child")
      .classed ("modal-description", true)
      .classed ("error", true)
      .text (message);
};

gErrorMenu.clearModalErrors = function () {
  d3.selectAll (".modal-description.error").remove ();
};