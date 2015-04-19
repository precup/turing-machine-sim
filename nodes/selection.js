gNodes.select = function (id) {
  gNodes.nodes[gNodes.getNodeIndex (id)].selected = true;
};

gNodes.deselect = function (id) {
  gNodes.nodes[gNodes.getNodeIndex (id)].selected = false;
};

gNodes.toggleSelection = function (id) {
  gNodes.nodes[gNodes.getNodeIndex (id)].selected ^= true;
};

gNodes.deselectAll = function () {
  gNodes.nodes.forEach (function (node) {
    node.selected = false;
  });
};

gNodes.selectionInit = function () {
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