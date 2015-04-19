gEdges.SELECTED_COLOR = "blue";

gEdges.initSelection = function () {
  gEdges.buildMarker('sel-arrow', gEdges.END_ARROW_OFFSET, gEdges.SELECTED_COLOR);
  
  gBehaviors.addBehavior ("edges", "mousedown",
    function () { 
      return true; 
    },
    function (edge) {
      if (!gShiftKey && !edge.selected) {
        gNodes.deselectAll ();
        gEdges.deselectAll ();
      }
      edge.selected = true;
      gGraph.draw ();
    });
};

gEdges.deleteSelected = function () {
  var selected = [];
  gEdges.edges.forEach (function (edge) {
    if (edge.selected) {
      selected.push (edge);
    }
  });
  selected.forEach (function (edge) {
    gEdges.removeEdge (edge.source, edge.target)
  });
};

gEdges.deselectAll = function () {
  gEdges.edges.forEach (function (edge) {
    edge.selected = false;
  });
};