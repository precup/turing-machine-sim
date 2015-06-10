/*
FILE: menu/modal/edge.js

Code to handle the Edge Editing modal for DFAs and NFAs.
Edge editing for turing machines is handled in tmedge.js.

-- Elements:
A textbox to enter with the characters of the current transition
Add all characters in the machine's alphabet button
Add all remaining characters in the machine's alphabet button
Make the current edge's character set the difference between the 
  machine's alphabet and the current edge's character set.
Delete button, which removes the edge
Cancel button (cancels editing)
Update button
-- Events:
Add all
Add remaining
Invert the current character set
Delete edge
Update edge with edits (handled in modal.js)
Cancel editing (handled implicitly)
*/

/* Add all of the edge characters to the current transition.
No return value.
*/
gModalMenu.addAllEdgeChars = function () {
  gModalMenu.setEdgeChars (gGraph.charSet);
  gModalMenu.setEpsilon (true);
};

/* Finds the difference of the current set of entered characters and
the machine's alphabet.
No return value.
*/
gModalMenu.invertEdgeChars = function () {
  var chars = gGraph.charSet;
  var badChars = gModalMenu.getEdgeCharacters ();
  for (var badChar in badChars) {
    chars = chars.replace (badChars[badChar], "");
  }
  gModalMenu.setEdgeChars (chars);
  gModalMenu.setEpsilon (!gModalMenu.getEpsilon ());
};

/* Adds the characters in the machine's alphabet but
not currently used by any of the edges from the
starting node.
No return value.
*/
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

/* Deletes the current edge.
No return value.
*/
gModalMenu.deleteEdge = function () {
  gEdges.removeEdge (gEdges.editedEdge.source, gEdges.editedEdge.target);
  gGraph.draw ();
  gModalMenu.close ("edgeEntry");
};

/*--- Helper functions ---*/

/* Returns a boolean value indicating if the edge is an epsilon transition. */
gModalMenu.getEpsilon = function () {
  return gGraph.mode == gGraph.NFA && d3.select(".epsilon").node().checked;
};

/* If included is true, sets the current edge to an epsilon transition.
Otherwise, set the current edge to not have an epsilon transition.
@param (included : boolean) The
No return value. */
gModalMenu.setEpsilon = function (included) {
  d3.select(".epsilon").node().checked = included;
};

/* Sets the edge characters in the modal to "chars".
@param (chars : string) the value to set the textbox to.
No return value.
*/
gModalMenu.setEdgeChars = function (chars) {
  d3.select(".edgeChars").node().value = chars;
};

/* Returns the edge characters for the current edge.
*/
gModalMenu.getEdgeCharacters = function () {
  return d3.select(".edgeChars").node().value;
};