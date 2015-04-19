gNodes.GRID_SPACING = 150;

gNodes.snapToGrid = function () {
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
  
  var nodes = [];
  gNodes.nodes.forEach (function (node, i) {
    nodes.push ({ x: node.x, y: node.y, i: i });
  });
  
  if (points.length < nodes.length) {
    return;
  }
  
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