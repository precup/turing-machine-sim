gEdges.initEditing = function () {
  gEdges.editedEdge = null;
  
  gBehaviors.addBehavior ("edges", "dblclick", 
    function () { 
      return true;
    }, gEdges.editEdge);
};

gEdges.editEdge = function (edge) {
  gEdges.editedEdge = edge;
  var chars = edge.transitions[0].join ("");
  var epsilon = chars.length > 0 && chars[chars.length - 1] == gEpsilon;
  if (epsilon) {
    chars = chars.substring (0, chars.length - 1);
  }
  gModalMenu.setEdgeChars (chars);
  gModalMenu.setEpsilon (epsilon);
  gModalMenu.open ("edgeEntry");
  d3.event.stopPropagation ();
};

gEdges.editComplete = function () {
  var chars = gModalMenu.getEdgeCharacters ();
  chars = intersection (gGraph.charSet, chars);
  chars += (gModalMenu.getEpsilon () ? gEpsilon : "");
  
  var transitions = chars.split ("");
  transitions.sort ();
  for (var i = 0; i < transitions.length - 1; i++) {
    if (transitions[i] == transitions[i + 1]){
      transitions.splice (i--, 1);
    }
  }
  transitions.forEach (function (transition) {
    for (var i = 0; i < gEdges.edges.length; i++) {
      var edge = gEdges.edges[i];
      if (edge != gEdges.editedEdge && edge.source == gEdges.editedEdge.source) {
        var index = edge.transitions[0].indexOf (transition);
        if (index != -1) {
          edge.transitions[0].splice (index, 1);
          if (edge.transitions[0].length == 0) {
            gEdges.removeEdge (edge.source, edge.target);
            i--;
          }
        }
      }
    }
  });
  
  gEdges.editedEdge.transitions[0] = transitions;
  if (transitions.length == 0) {
    gEdges.removeEdge (gEdges.editedEdge.source, gEdges.editedEdge.target);
  }
  gEdges.editedEdge = null;
  gModalMenu.close ("edgeEntry");
  gGraph.draw ();
};