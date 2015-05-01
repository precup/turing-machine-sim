gNodes.FORCE_LAYOUT_ITERATIONS = 100000;

gNodes.forcedDirectedLayout = function () {
  var bottomBound = gGraph.height - gGraph.BUFFER;
  var rightBound = gGraph.width - gGraph.BUFFER;
  var leftBound = gGraph.BUFFER;
  var topBound = gGraph.BUFFER;
  
  var nodes = [];
  gNodes.nodes.forEach (function (node) {
    nodes.push ({
      x: node.x,
      y: node.y,
      vx: 0,
      vy: 0
    });
  });
  var edges = [];
  gEdges.edges.forEach (function (edge) {
    edges.push ({
      source: gNodes.getNodeIndex (edge.source.id),
      target: gNodes.getNodeIndex (edge.target.id)
    });
  });
  
  var force = d3.layout.force ()
    .nodes (nodes)
    .links (edges)
    .linkDistance (200)
    .charge (-300)
    .gravity (0.01)
    .size ([gGraph.width - 2 * gGraph.BUFFER, gGraph.height - 2 * gGraph.BUFFER]);
  
  force.start();
  for (var i = 0; i < gNodes.FORCE_LAYOUT_ITERATIONS; i++) {
      force.tick();
  }
  force.stop();
  
  var xMin = nodes[0].x;
  var xMax = nodes[0].x;
  var yMin = nodes[0].y;
  var yMax = nodes[0].y;
  for (var i = 1; i < nodes.length; i++) {
    xMin = Math.min (xMin, nodes[i].x);
    xMax = Math.max (xMax, nodes[i].x);
    yMin = Math.min (yMin, nodes[i].y);
    yMax = Math.max (yMax, nodes[i].y);
  }
  
  leftBound = Math.max (leftBound, xMin);
  rightBound = Math.min (rightBound, xMax);
  topBound = Math.max (topBound, yMin);
  bottomBound = Math.min (bottomBound, yMax);
  
  for (var i = 0; i < nodes.length; i++) {
    var xPercent = (nodes[i].x - xMin) / (xMax - xMin);
    var yPercent = (nodes[i].y - yMin) / (yMax - yMin);
    gNodes.nodes[i].x = leftBound * (1 - xPercent) + rightBound * xPercent;
    gNodes.nodes[i].y = topBound * (1 - yPercent) + bottomBound * yPercent;
  }
};