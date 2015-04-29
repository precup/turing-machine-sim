gNodes.editInit = function () {
  gNodes.editedNode = null;
  
  gBehaviors.addBehavior ("nodes", "dblclick", 
    function () { 
      return true;
    }, gNodes.editNode);
  
  d3.select (".nodeName")
    .on ("keypress", function () {
      if (d3.event.keyCode == 13) {
        gModalMenu.submit ("nodeEntry");
      }
    });
};

gNodes.editNode = function (node) {
  gNodes.editedNode = node;
  gModalMenu.setNodeName (node.name);
  gModalMenu.open ("nodeEntry");
  d3.event.stopPropagation ();
};

gNodes.editComplete = function () {
  gNodes.editedNode.name = gModalMenu.getNodeName ();
  gNodes.editedNode = null;
  gModalMenu.close ("nodeEntry");
  gGraph.draw ();
};