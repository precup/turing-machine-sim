gNodes.moveSelected = function (dx, dy) {
  var nodeIsSelected = function (node) {
    return node.selected;
  };
  
  var edgeIsSelected = function (edge) {
    return edge.source.selected || edge.target.selected;
  }

  gNodes.nodes.filter (nodeIsSelected)
    .forEach (function (node) {
      node.x += dx;
      node.y += dy;
    });
  var upperG = d3.select ("g.nodes").selectAll ("g").filter (nodeIsSelected);
  var lowerG = d3.select ("g.nodesLower").selectAll ("circle").filter (nodeIsSelected);
  gNodes.drawDOMNodes (lowerG, upperG);
  
  upperG = d3.select ("g.edges").selectAll ("g").filter (edgeIsSelected);
  lowerG = d3.select ("g.edgesLower").selectAll ("path").filter (edgeIsSelected);
  gEdges.drawDOMEdges (lowerG, upperG);
  
  gEdges.drawInitial ();
  gTape.draw ();
};

gNodes.movementInit = function () {
  gBehaviors.addBehavior ("nodes", "drag", 
    function (node) { 
      return node.selected; 
    },
    function (node) {
      gNodes.moveSelected(d3.event.dx, d3.event.dy); 
    });
};