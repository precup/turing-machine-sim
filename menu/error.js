var gErrorMenu =
  {
    DISPLAY_TIME: 2100,
    FADE_OUT_TIME: 400
  };
  
gErrorMenu.displayError = function (message) {
  var selection = d3.select (".errors")
    .append ("span")
    .html (message)
    .classed ("error", true)
    .transition ()
    .delay (gErrorMenu.DISPLAY_TIME)
    .duration (gErrorMenu.FADE_OUT_TIME)
    .ease ("cubic")
    .style ("opacity", 0)
    .remove ();
};