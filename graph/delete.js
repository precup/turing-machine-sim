gGraph.initDelete = function () {
  gBehaviors.addBehavior ("page", "keydown",
    function () {
      return (d3.event.keyCode == 46 || d3.event.keyCode == 8) && d3.select (".overlay").style ("display") === "none";
    },
    function () {
      d3.event.preventDefault ();
      if (gNodes.removeNodes ()) {
        gEdges.deleteSelected ();
        gGraph.draw ();
      }
    });
};