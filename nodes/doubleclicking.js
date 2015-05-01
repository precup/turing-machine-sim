gNodes.doubleClickInit = function () {
  gBehaviors.addBehavior ("background", "dblclick", 
    function () { 
      return !gTableTopMenu.active;
    },
    function () {
      var mouse = d3.mouse(d3.select("svg").node());
      gNodes.addNode(mouse[0], mouse[1]); 
      gNodes.draw ();
    });
};