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
  var name = gModalMenu.getNodeName ();
  if (name.replace (/\s/g, "").length == 0) {
    gErrorMenu.displayError ("Node name cannot be blank.");
    return;
  }
  
  var index = gNodes.getNodeIndexFromName (name);
  if (index == -1 || gNodes.nodes[index].id == gNodes.editedNode.id) {
    gNodes.editedNode.name = name;
    gNodes.editedNode = null;
    gModalMenu.close ("nodeEntry");
    gGraph.draw ();
  } else {
    gErrorMenu.displayError ("Node name \"" + name + "\" is already in use.");
  }
};