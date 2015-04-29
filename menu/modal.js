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
    case "nodeEntry":
      gNodes.editComplete ();
      break;
    case "testing":
      gSimulator.runTests ();
      break;
    default:
      break;
  }
}

gModalMenu.cancel = function (type) {
  switch (type) {
    case "edgeEntry":
      gEdges.editCancelled ();
      break;
    default:
      gModalMenu.close (type);
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

gModalMenu.getNodeName = function () {
  return d3.select (".nodeName").node ().value;
};

gModalMenu.setNodeName = function (name) {
  d3.select (".nodeName").node ().value = name;
};

gModalMenu.getSaveName = function () {
  return d3.select (".saveText").node ().value;
};

gModalMenu.setSaveName = function (name) {
  d3.select (".saveText").node ().value = name;
};

gModalMenu.setSaveButton = function (text) {
  d3.select (".saveButton").node ().innerHTML = text;
};

gModalMenu.setLoadNames = function (names) {
  var lis = d3.select (".loadNames")
    .selectAll ("li")
    .data (names);
    
  lis.enter ().append ("li");
  lis.classed ("selected", false)
    .each (function (name) {
      this.innerHTML = name;
     })
    .on ("click", function () {
      d3.select (this).classed ("selected", true);
    })
    .style ("cursor", "pointer");
  lis.exit ().remove ();
};

gModalMenu.getLoadName = function () {  
  var node = d3.select (".loadNames").select ("li.selected").node ();
  return node == null ? null : node.innerHTML;
};