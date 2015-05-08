var gTableMenu =
  {
  };

gTableMenu.updateAll = function () {
  var charSet = gGraph.charSet;
  if (gGraph.epsilonEnabled) {
    charSet += gEpsilon;
  }
  charSet = charSet.split("");

  gEdges.edges = [];

  var map = [];
  gNodes.nodes.forEach (function (node) {
    gEdges.edgeMap[node.id] = [];
    var arr = [];
    gNodes.nodes.forEach (function () {
      arr.push ("");
    });
    map.push (arr);
  });

  var extraNames = false;
  var badNames = false;
  d3.selectAll ("input.gridInput")
    .each (function () {
      var nodes = this.value.split(/[ \t\n\r,]/);
      var character = this.character;
      var i1 = this.i1;
      var foundOne = false;
      nodes.forEach (function (nodeName) {
        var nodeIndex = gNodes.getNodeIndexFromName (nodeName);
        if (nodeIndex != -1) {
          if (!foundOne || gGraph.mode == gGraph.NFA) {
            map[i1][nodeIndex] += character;
          } else {
            extraNames = true;
          }
          foundOne = true;
        } else if (nodeName != "") {
          badNames = true;
        }
      });
    });
    
  if (extraNames) {
    gErrorMenu.displayError ("Multiple transitions defined for one character, ignoring extras");
  }
  if (badNames) {
    gErrorMenu.displayError ("Some states entered in the table could not be found, ignoring them");
  }

  map.forEach (function (row, i1) {
    row.forEach (function (transitions, i2) {
      if (transitions == "") {
        return;
      }
      var edge = gEdges.getEdge (gNodes.nodes[i1], gNodes.nodes[i2]);
      if (edge == null) {
        gEdges.addEdge (gNodes.nodes[i1], gNodes.nodes[i2]);
        edge = gEdges.edges[gEdges.edges.length - 1];
      }
      edge.transitions[0] = transitions.split ("").sort ();
    });
  });
};

gTableMenu.init = function () {
  var charSet = gGraph.charSet;
  if (gGraph.epsilonEnabled) {
    charSet += gEpsilon;
  }
  charSet = charSet.split("");
  var header = d3.select (".tableEditor").insert("tr").selectAll ("td").data (charSet);

  header.enter ()
    .append ("td");

  header.text (function (inputChar) {
      return inputChar;
    });

  header.exit ().remove ();

  var headerTr = d3.select (".tableEditor").select("tr");
  headerTr.insert ("td", "td").text ("Accepts");
  headerTr.insert ("td", "td").text ("Initial");
  headerTr.insert ("td", "td").text ("");
  headerTr.append ("td").text ("Delete");
};

gTableMenu.draw = function () {
  var charSet = gGraph.charSet;
  if (gGraph.epsilonEnabled) {
    charSet += gEpsilon;
  }
  charSet = charSet.split("");

  var table = d3.select (".tableEditor")
    .selectAll ("tr")
    .filter (function (junk, i) { return i != 0; })
    .data (gNodes.nodes);
  var newRows = table.enter ().append ("tr");

  newRows.append ("td")
    .text (function (node) {
      return node.name;
    });

  newRows.append ("td")
    .append ("input")
    .attr ("type", "radio")
    .classed ("initialBox", true)
    .each (function (node) {
      this.checked = gNodes.initial != null && gNodes.initial.id == node.id;
    })
    .on ("change", function (node, i) {
      if (this.checked) {
        gNodes.setInitialByIndex (i);
      } else {
        gNodes.clearInitial ();
      }
      gGraph.draw ();
    });

  newRows.append ("td")
    .append ("input")
    .attr ("type", "checkbox")
    .classed ("acceptBox", true)
    .each (function (node) {
      this.checked = node.accept;
    })
    .on ("change", function (node, i) {
      gNodes.setAcceptByIndex (i, this.checked);
      gGraph.draw ();
    });
  
  var rows = table.selectAll ("td")
    .filter (function () {
      return d3.select (this)
        .select ("input")
        .filter (function () { return this.type == "text"; })
        .node () != null;
    })
    .data (charSet);

  rows.enter ()
    .append ("td")
    .append ("input")
    .attr ("type", "text")
    .attr ("size", "10")
    .attr ("placeholder", "go to")
    .classed ("gridInput", true)
    .each (function (character, i2, i1) {
      this.character = character;
      this.i1 = i1;
    });


  rows.select ("input")
    .attr ("value", function (character, i2, i1) {
      return gTableMenu.getConnections (gNodes.nodes[i1].id, character);
    })
    .on ("blur", function () {
      gTableMenu.updateAll ();
      gTableMenu.draw ();
    });

  rows.exit ().remove ();

  newRows.append ("td")
    .append ("button")
    .on ("click", function (node, i) {
      gNodes.removeByIndex (i);
      gGraph.draw ();
    })
    .text ("X");

  table.exit ()
    .remove ();
};

gTableMenu.getConnections = function (source, character) {
  var nodes = [];
  gEdges.edges.forEach (function (edge) {
    if (edge.source.id == source && edge.transitions[0].indexOf (character) != -1) {
      nodes.push (edge.target.name);
    }
  });
  return nodes.join (", ");
};
