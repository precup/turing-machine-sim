/* Marks the node with id @id as selected */
gNodes.select = function (id) {
  gNodes.nodes[gNodes.getNodeIndex (id)].selected = true;
};

/* Marks the node with id @id as not selected */
gNodes.deselect = function (id) {
  gNodes.nodes[gNodes.getNodeIndex (id)].selected = false;
};

/* Marks the node with id @id as selected if it wasn't selected,
 * and not selected if it was selected */
gNodes.toggleSelection = function (id) {
  gNodes.nodes[gNodes.getNodeIndex (id)].selected ^= true;
};

/* Marks all nodes as deselected */
gNodes.deselectAll = function () {
  gNodes.nodes.forEach (function (node) {
    node.selected = false;
  });
};

/* Returns a boolean which is true iff there is
 * at least one node marked as selected. */
gNodes.selectionIsEmpty = function () {
  return gNodes.selectionSize () == 0;
};

/* Returns the number of nodes that are currently marked
 * as selected. */
gNodes.selectionSize = function () {
  return gNodes.nodes.filter (function (node) {
    return node.selected;
  }).length;
};

/* Sets up everything related to selection. */
gNodes.selectionInit = function () {
  // Selection via clicking
  gBehaviors.addBehavior ("nodes", "mousedown", 
    function () { 
      return true; 
    },
    function (node) {
      if (!gShiftKey && !node.selected) {
        gNodes.deselectAll ();
        gEdges.deselectAll ();
      }
      node.selected = true;
      gGraph.draw ();
    });
    
  // Selection via dragging
  gBehaviors.addBehavior ("brush", "brushstart", 
    function () { 
      return true; 
    },
    function() {
      gNodes.nodes.forEach (function (node) {
        node.previouslySelected = gShiftKey && node.selected;
      });
      gEdges.deselectAll ();
    });
    
  gBehaviors.addBehavior ("brush", "brush", 
    function () { 
      return true; 
    },
    function() {
      var extent = d3.event.target.extent();
      gNodes.nodes.forEach (function (node) {
        node.selected = node.previouslySelected ^
            (extent[0][0] <= node.x && node.x < extent[1][0]
            && extent[0][1] <= node.y && node.y < extent[1][1]);
      });
      gGraph.draw ();
    });
};