gNodes.FORCE_LAYOUT_ITERATIONS = 100000;

gNodes.forcedDirectedLayout = function () {
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
  
  for (var i = 0; i < nodes.length; i++) {
    gNodes.nodes[i].x = nodes[i].x;
    gNodes.nodes[i].y = nodes[i].y;
  }
  
  gNodes.scale ();
};