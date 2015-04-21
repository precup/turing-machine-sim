var gTableMenu =
  {
  };
  
gTableMenu.draw = function () {
  d3.select (".tableEditor").selectAll ("tr").remove ();
  var table = d3.select (".tableEditor").selectAll ("tr").data (gNodes.nodes);
  table.enter ()
    .append ("tr");
    
  var rows = table.selectAll ("td").data (gNodes.nodes);
  
  rows.enter ()
    .append ("td")
    .append ("input")
    .attr ("type", "text")
    .attr ("size", "10");
    
    
  rows.select ("input")
    .attr ("value", function (node, i2, i1) {
      return gTableMenu.getConnections (gNodes.nodes[i1].id, gNodes.nodes[i2].id);
    })
    .on ("input", function (node, i2, i1) {
      console.log ("changed");
      var chars = this.value;
      chars = chars.replace (new RegExp("[^" + gGraph.charSet + "]", "g"), "");
      chars += (gModalMenu.getEpsilon () ? gEpsilon : "");
      console.log (chars);
      
      var transitions = chars.split ("");
      transitions.sort ();
      for (var i = 0; i < transitions.length - 1; i++) {
        if (transitions[i] == transitions[i + 1]){
          transitions.splice (i--, 1);
        }
      }
      
      var passedEdge = null;
      gEdges.edges.forEach (function (edge) {
        if (edge.source.id == gNodes.nodes[i1].id && edge.target.id == gNodes.nodes[i2].id) {
          passedEdge = edge;
        }
      });
      
      if (passedEdge == null) {
        gEdges.addEdge (gNodes.nodes[i1], gNodes.nodes[i2]);
        passedEdge = gEdges.edges[gEdges.edges.length - 1];
      }
      
      if (transitions.length == 0) {
        gEdges.removeEdge (gNodes.nodes[i1], gNodes.nodes[i2]);
      } else {       
        passedEdge.transitions[0] = transitions;
      }
      gGraph.draw ();
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

  var header = d3.select (".tableEditor").insert("tr", "tr").selectAll ("td").data (gNodes.nodes);
  
  header.enter ()
    .append ("td");
  
  header.each (function (node) {
      this.innerHTML = node.name;
    });
  
  header.exit ().remove ();
  
  var headerTr = d3.select (".tableEditor").select("tr");
  headerTr.insert ("td", "td").node ().innerHTML = "Accepts";
  headerTr.insert ("td", "td").node ().innerHTML = "Initial";
  headerTr.insert ("td", "td").node ().innerHTML = "";
  headerTr.append ("td").node ().innerHTML = "Delete";
};

gTableMenu.getConnections = function (source, target) {
  var passedEdge = null;
  gEdges.edges.forEach (function (edge) {
    if (edge.source.id == source && edge.target.id == target) {
      passedEdge = edge;
    }
  });
  if (passedEdge == null) {
    return "";
  }
  return passedEdge.transitions[0].join ("");
};