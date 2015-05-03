var gErrorMenu =
  {
    DISPLAY_TIME: 2100,
    FADE_OUT_TIME: 400,
    MAX_ERRORS: 3
  };
  
gErrorMenu.displayError = function (message) {
  var selection = d3.select (".errors")
    .append ("span")
    .text (message)
    .classed ("error", true)
    .transition ()
    .delay (gErrorMenu.DISPLAY_TIME)
    .duration (gErrorMenu.FADE_OUT_TIME)
    .ease ("cubic")
    .style ("opacity", 0)
    .remove ();
    
  var errors = d3.select (".errors").selectAll ("span").size ();
  
  d3.select (".errors")
    .selectAll ("span")
    .filter (function (junk, i) {
      return i < errors - gErrorMenu.MAX_ERRORS;
    })
    .remove ();
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