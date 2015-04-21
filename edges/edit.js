gEdges.initEditing = function () {
  gEdges.editedEdge = null;
  
  gBehaviors.addBehavior ("edges", "dblclick", 
    function () { 
      return true;
    },
    function (edge) {
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
    });
};

gEdges.editComplete = function () {
  var chars = gModalMenu.getEdgeCharacters ();
  chars = chars.replace (new RegExp("[^" + gGraph.charSet + "]", "g"), "");
  chars += (gModalMenu.getEpsilon () ? gEpsilon : "");
  
  var transitions = chars.split ("");
  transitions.sort ();
  for (var i = 0; i < transitions.length - 1; i++) {
    if (transitions[i] == transitions[i + 1]){
      transitions.splice (i--, 1);
    }
  }
  
  gEdges.editedEdge.transitions[0] = transitions;
  gEdges.editedEdge = null;
  gModalMenu.close ("edgeEntry");
  gGraph.draw ();
};