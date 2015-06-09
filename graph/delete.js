/* This file handles deletion via the delete or backspace keys. */

/* Set up the behaviors for deletion. */
gGraph.initDelete = function () {
  gBehaviors.addBehavior ("page", "keydown",
    function () { 
      return (d3.event.keyCode == 46 || d3.event.keyCode == 8) && // Backspace and delete
        d3.select (".overlay").style ("display") === "none" && // Not in a popup
        d3.select (".tape-char-input").node () !== document.activeElement && // Not in the tape
        !gTableTopMenu.active; // Not in the table
    },
    function () {
      // Prevent backspace from going back a page
      d3.event.preventDefault ();
      if (gNodes.removeNodes (true)) {
        gEdges.deleteSelected ();
        gGraph.draw ();
      }
    });
};