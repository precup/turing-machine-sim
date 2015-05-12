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
  gModalMenu.setInitial (gNodes.initial != null && node.id == gNodes.initial.id);
  gModalMenu.setState (node.accept, node.reject);
  gModalMenu.open ("nodeEntry");
  d3.event.stopPropagation ();
};

gNodes.editComplete = function () {
  var name = gModalMenu.getNodeName ();
  if (name.replace (/\s/g, "").length == 0) {
    gErrorMenu.displayModalError ("nodeEntry", "State name cannot be blank.");
    return;
  }

  var index = gNodes.getNodeIndexFromName (name);
  if (index == -1 || gNodes.nodes[index].id == gNodes.editedNode.id) {
    gNodes.editedNode.accept = gModalMenu.getAccepting ();
    gNodes.editedNode.reject = gModalMenu.getRejecting ();
    if (gModalMenu.getInitial ()) {
      gNodes.initial = gNodes.editedNode;
    } else if (gNodes.initial != null && gNodes.editedNode.id == gNodes.initial.id) {
      gNodes.initial = null;
    }
    gNodes.editedNode.name = name;
    gNodes.editedNode = null;
    gModalMenu.close ("nodeEntry");
    gGraph.draw ();
  } else {
    gErrorMenu.displayModalError ("nodeEntry", "State name \"" + name + "\" is already in use.");
  }
};

gNodes.deleteEdited = function () {
  if (gTape.follow != null && gTape.follow.id == gNodes.editedNode.id) {
    if (gTape.done) {
      gTestMenu.end ();
    } else {
      gErrorMenu.displayModalError ("nodeEntry", "The current state in a running test cannot be deleted");
      return;
    }
  }
  gNodes.removeByIndex (gNodes.getNodeIndex (gNodes.editedNode.id));
  gModalMenu.close ("nodeEntry");
  gGraph.draw ();
};
