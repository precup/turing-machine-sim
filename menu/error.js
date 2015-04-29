var gErrorMenu =
  {
    DISPLAY_TIME: 3000
  };
  
gErrorMenu.displayError = function (message) {
  var node = d3.select (".errors")
    .append ("span")
    .html (message)
    .classed ("error", true)
    .node ();
  setTimeout (function () { 
    gErrorMenu.closeError (node);
  }, gErrorMenu.DISPLAY_TIME);
};

gErrorMenu.closeError = function (elem) {
  d3.select (elem).remove ();
};