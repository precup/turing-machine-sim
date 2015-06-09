/* This file handles edge selection. */
gEdges.SELECTED_COLOR = "blue";

/* Sets up a handler for click events on edges. */
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

/* Deletes every edge that is selected. */
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

/* Clears the edge selection. */
gEdges.deselectAll = function () {
  gEdges.edges.forEach (function (edge) {
    edge.selected = false;
  });
};

gEdges.selectionIsEmpty = function () {
  return gEdges.selectionSize () == 0;
};

gEdges.selectionSize = function () {
  return gEdges.edges.filter (function (edge) {
    return edge.selected;
  }).length;
};