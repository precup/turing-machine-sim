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
    d3.select (".swapButton") .text ("Switch to Table View");
    gTableTopMenu.active = false;
    gTableMenu.updateAll ();
  } else {
    d3.select ("svg") .style ("display", "none");
    d3.select (".tableEditor, .tableEditorHeader") .style ("display", "table");
    d3.selectAll (".nontable, .nontableblock").style ("display", "none");
    d3.select (".swapButton") .text ("Switch to Editor View");
    gNodes.deselectAll ();
    gEdges.deselectAll ();
    gTableTopMenu.active = true;
  }
  
  if (gGraph.mode == gGraph.DFA) {
    d3.selectAll (".dfa-hide")
      .style ("display", "none");
  } else if (gGraph.mode == gGraph.NFA) {
    d3.selectAll (".nfa-hide")
      .style ("display", "none");
  } else {
    d3.selectAll (".tm-hide")
      .style ("display", "none");
  }
  gGraph.draw ();
};