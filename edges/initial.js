gEdges.INITIAL_EDGE_LENGTH = 60;
gEdges.INITIAL_OVERLAP_RANGE = 7;
gEdges.INITIAL_OVERLAP_ANGLE = 20;

gEdges.initInitial = function () {
  d3.select (".miscEdges")
    .append ("path")
    .classed ("initial", true)
    .style ('marker-end', 'url(#end-arrow)')
    .attr ("fill", "none");
};

gEdges.drawInitial = function () {
  var initialNode = gNodes.initial;
  if (initialNode == null) {
    d3.select ("path.initial").style ("opacity", 0);
  } else {
    var yOffset = 0;
    var xOffset = gEdges.INITIAL_EDGE_LENGTH;
    gEdges.edges.forEach (function (edge) {
      var lx = Math.min (edge.source.x, edge.target.x);
      var rx = Math.max (edge.source.x, edge.target.x);
      if (initialNode.x <= rx && initialNode.x - gEdges.INITIAL_EDGE_LENGTH >= lx &&
          edge.target.x - edge.source.x != 0) {
        var m = (edge.target.y - edge.source.y) / (edge.target.x - edge.source.x);
        var b = edge.source.y - m * edge.source.x;
        var ly = m * (initialNode.x - gEdges.INITIAL_EDGE_LENGTH) + b;
        var ry = m * (initialNode.x) + b;
        if (Math.abs (ly - initialNode.y) <= gEdges.INITIAL_OVERLAP_RANGE &&
            Math.abs (ry - initialNode.y) <= gEdges.INITIAL_OVERLAP_RANGE) {
          xOffset = Math.cos (Math.PI / 180 * gEdges.INITIAL_OVERLAP_ANGLE) * gEdges.INITIAL_EDGE_LENGTH;
          yOffset = Math.sin (Math.PI / 180 * gEdges.INITIAL_OVERLAP_ANGLE) * gEdges.INITIAL_EDGE_LENGTH;
          if (ly < ry) {
            yOffset *= -1;
          }
        }
      }
    });
    d3.select ("path.initial")
      .style ("opacity", 1)
      .attr ("d", function () { return gEdges.lineFunction ([
          { x: initialNode.x - xOffset, y: initialNode.y - yOffset },
          { x: initialNode.x, y: initialNode.y }
        ])});
  }
};

if (isIE) {
  gEdges.initInitial = function () {};

  gEdges.drawInitial = function () {
    d3.select ("path.initial").remove ();
    var initialNode = gNodes.initial;
    if (initialNode != null) {      
      d3.select (".miscEdges")
        .append ("path")
        .classed ("initial", true)
        .style ('marker-end', 'url(#end-arrow)')
        .attr ("fill", "none")
        .attr ("d", function () { return gEdges.lineFunction ([
            { x: initialNode.x - gEdges.INITIAL_EDGE_LENGTH, y: initialNode.y },
            { x: initialNode.x, y: initialNode.y }
          ])});
    }
  };
}