gEdges.INITIAL_EDGE_LENGTH = 60;

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
    d3.select ("path.initial")
      .style ("opacity", 1)
      .attr ("d", function () { return gEdges.lineFunction ([
          { x: initialNode.x - gEdges.INITIAL_EDGE_LENGTH, y: initialNode.y },
          { x: initialNode.x, y: initialNode.y }
        ])});
  }
};