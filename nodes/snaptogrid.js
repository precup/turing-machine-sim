/* This file handles everything related to snapping the
 * nodes to a grid pattern. */

gNodes.GRID_SPACING = 150;

/* Rearranges all the nodes to be at points on a lattice
 * while attempting to maintain the original position
 * as closely as it cheaply can. */
gNodes.snapToGrid = function () {
  // Computes all lattice points
  var points = [];
  for (var x = gNodes.GRID_SPACING; 
       x <= gGraph.width - gNodes.GRID_SPACING; 
       x += gNodes.GRID_SPACING) {
    for (var y = gNodes.GRID_SPACING; 
         y <= gGraph.height - gNodes.GRID_SPACING; 
         y += gNodes.GRID_SPACING) {
      points.push ({ x: x, y: y });
    }
  }
  
  // Finds all nodes
  var nodes = [];
  var initial = -1;
  gNodes.nodes.forEach (function (node, i) {
    if (gNodes.initial != null && gNodes.initial.id == node.id) {
      initial = i;
    }
    nodes.push ({ x: node.x, y: node.y, i: i });
  });
  
  // Don't bother if the screen isn't big enough
  if (points.length < nodes.length) {
    return;
  }
  
  // Greedily match the best node-lattice point pair
  // until all nodes have been matched
  while (nodes.length > 0 && points.length > 0) {
    var bestDist = -1;
    var bestPoint = -1;
    var bestNode = -1;
    for (var i = 0; i < nodes.length; i++) {
      for (var j = 0; j < points.length; j++) {
        var dist = Math.pow (nodes[i].x - points[j].x, 2) + 
                   Math.pow (nodes[i].y - points[j].y, 2);
        if (bestNode == -1 || dist < bestDist) {
          bestPoint = j;
          bestNode = i;
          bestDist = dist;
        }
      }
    }
    gNodes.nodes[nodes[bestNode].i].x = points[bestPoint].x;
    gNodes.nodes[nodes[bestNode].i].y = points[bestPoint].y;
    nodes.splice (bestNode, 1);
    points.splice (bestPoint, 1);
  }
};