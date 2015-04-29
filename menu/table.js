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
  
  d3.selectAll ("input.gridInput")
    .each (function () {
      var nodes = this.value.split(/[ \t\n\r,]/);
      var character = this.character;
      var i1 = this.i1;
      nodes.forEach (function (nodeName) {
        var nodeIndex = gNodes.getNodeIndexFromName (nodeName);
        if (nodeIndex != -1) {
          map[i1][nodeIndex] += character;
        }
      });
    });
    
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
  
gTableMenu.draw = function () {
  var charSet = gGraph.charSet;
  if (gGraph.epsilonEnabled) {
    charSet += gEpsilon;
  }
  charSet = charSet.split("");
  
  d3.select (".tableEditor").selectAll ("tr").remove ();
  var table = d3.select (".tableEditor").selectAll ("tr").data (gNodes.nodes);
  table.enter ().append ("tr");
    
  var rows = table.selectAll ("td").data (charSet);
  
  rows.enter ()
    .append ("td")
    .append ("input")
    .attr ("type", "text")
    .attr ("size", "10")
    .classed ("gridInput", true)
    .each (function (character, i2, i1) {
      this.character = character;
      this.i1 = i1;
    });
    
    
  rows.select ("input")
    .attr ("value", function (character, i2, i1) {
      return gTableMenu.getConnections (gNodes.nodes[i1].id, character);
    });
    
  rows.exit ().remove ();
  
  table.insert ("td", "td")
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
    
  table.insert ("td", "td")
    .append ("input")
    .attr ("type", "checkbox")
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
    
  table.insert ("td", "td")
    .each (function (node) {
      this.innerHTML = node.name;
    });
    
  table.append ("td", "td")
    .append ("button")
    .on ("click", function (node, i) {
      gNodes.removeByIndex (i);
      gGraph.draw ();
    })
    .each (function () {
      this.innerHTML = "X";
    });
    
  table.exit ()
    .remove ();

  var header = d3.select (".tableEditor").insert("tr", "tr").selectAll ("td").data (charSet);
  
  header.enter ()
    .append ("td");
  
  header.each (function (inputChar) {
      this.innerHTML = inputChar;
    });
  
  header.exit ().remove ();
  
  var headerTr = d3.select (".tableEditor").select("tr");
  headerTr.insert ("td", "td").node ().innerHTML = "Accepts";
  headerTr.insert ("td", "td").node ().innerHTML = "Initial";
  headerTr.insert ("td", "td").node ().innerHTML = "";
  headerTr.append ("td").node ().innerHTML = "Delete";
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