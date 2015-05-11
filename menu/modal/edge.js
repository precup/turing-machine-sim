gModalMenu.getEpsilon = function () {
  return gGraph.mode == gGraph.NFA && d3.select(".epsilon").node().checked;
};

gModalMenu.setEpsilon = function (included) {
  d3.select(".epsilon").node().checked = included;
};

gModalMenu.addAllEdgeChars = function () {
  gModalMenu.setEdgeChars (gGraph.charSet);
  gModalMenu.setEpsilon (true);
};

gModalMenu.invertEdgeChars = function () {
  var chars = gGraph.charSet;
  var badChars = gModalMenu.getEdgeCharacters ();
  for (var badChar in badChars) {
    chars = chars.replace (badChars[badChar], "");
  }
  gModalMenu.setEdgeChars (chars);
  gModalMenu.setEpsilon (!gModalMenu.getEpsilon ());
};

gModalMenu.addRemainingEdgeChars = function () {
  var missing = [];
  var graph = gGraph.save ();
  var table = gSimulator.convert (graph);
  for (var character in table[gEdges.editedEdge.source.id]) {
    if (table[gEdges.editedEdge.source.id][character].length == 0) {
      missing.push (character);
    }
  }
  gModalMenu.setEdgeChars (gModalMenu.getEdgeCharacters () + missing.join (""));
};

gModalMenu.setEdgeChars = function (chars) {
  d3.select(".edgeChars").node().value = chars;
};

gModalMenu.getEdgeCharacters = function () {
  return d3.select(".edgeChars").node().value;
};

gModalMenu.deleteEdge = function () {
  gEdges.removeEdge (gEdges.editedEdge.source, gEdges.editedEdge.target);
  gGraph.draw ();
  gModalMenu.close ("edgeEntry");
};