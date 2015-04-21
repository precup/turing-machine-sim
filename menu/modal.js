var gModalMenu =
  {
  };

gModalMenu.open = function (type) {
  d3.select ("." + type).style ('display', 'inline');
  d3.select ('.overlay').style ('display', 'inline');
}

gModalMenu.close = function (type) {
  d3.select ("." + type).style ('display', 'none');
  d3.select ('.overlay').style ('display', 'none');
};

gModalMenu.submit = function (type) {
  switch (type) {
    case "edgeEntry":
      gEdges.editComplete ();
      break;
    case "testing":
      gSimulator.runTests ();
    default:
      break;
  }
}

gModalMenu.getEpsilon = function () {
  return d3.select(".epsilon").node().checked;
}

gModalMenu.setEpsilon = function (included) {
  d3.select(".epsilon").node().checked = included;
}

gModalMenu.addAllEdgeChars = function () {
  gModalMenu.setEdgeChars (gGraph.charSet);
  gModalMenu.setEpsilon (true);
}

gModalMenu.invertEdgeChars = function () {
  var chars = gGraph.charSet;
  var badChars = gModalMenu.getEdgeCharacters ();
  for (var badChar in badChars) {
    chars = chars.replace (badChars[badChar], "");
  }
  gModalMenu.setEdgeChars (chars);
  gModalMenu.setEpsilon (!gModalMenu.getEpsilon ());
}

gModalMenu.setEdgeChars = function (chars) {
  d3.select(".edgeChars").node().value = chars;
}

gModalMenu.getEdgeCharacters = function () {
  return d3.select(".edgeChars").node().value;
}