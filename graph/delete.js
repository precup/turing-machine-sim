gGraph.initDelete = function () {
  gBehaviors.addBehavior ("page", "keydown",
    function () {
      return d3.event.keyCode == 46;
    },
    function () {
      gNodes.removeNodes ();
      gEdges.deleteSelected ();
      gGraph.draw ();
    });
};