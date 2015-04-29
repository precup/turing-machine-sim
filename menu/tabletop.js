var gTableTopMenu =
  {
    active: false
  };
  
gTableTopMenu.swap = function () {
  if (gTableTopMenu.active) {
    d3.select ("svg") .style ("display", "inline");
    d3.select (".tableEditor, .tableEditorHeader") .style ("display", "none");
    d3.selectAll (".nontable").style ("display", "inline");
    d3.selectAll (".nontableblock").style ("display", "block");
    d3.select (".swapButton") .node ().innerHTML = "Switch to Table View";
    gTableTopMenu.active = false;
    gTableMenu.updateAll ();
  } else {
    d3.select ("svg") .style ("display", "none");
    d3.select (".tableEditor, .tableEditorHeader") .style ("display", "table");
    d3.selectAll (".nontable, .nontableblock").style ("display", "none");
    d3.select (".swapButton") .node ().innerHTML = "Switch to Editor View";
    gTableTopMenu.active = true;
  }
  gGraph.draw ();
};