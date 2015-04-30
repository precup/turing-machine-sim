var gNodes = 
  {
    SELECTABLE_RADIUS: 50,
    RADIUS: 30,
    INNER_RADIUS: 24,
    MIN_NEW_X: 100,
    MIN_NEW_Y: 100,
    MAX_NEW_X: 700,
    MAX_NEW_Y: 300,
    NEW_INCREMENT: 100
  };

gNodes.init = function () {
  gNodes.lowerG = d3.select ("g.nodesLower");
  gNodes.upperG = d3.select ("g.nodes");
  
  gNodes.newNodeX = gNodes.MIN_NEW_X;
  gNodes.newNodeY = gNodes.MIN_NEW_Y;
  
  gNodes.nextId = 0;
  gNodes.nodes = [];
  gNodes.initial = null;
  
  gNodes.selectionInit ();
  gNodes.movementInit ();
  gNodes.doubleClickInit ();
  gNodes.editInit ();
};

gNodes.setInitial = function () {
  var selected = gNodes.nodes.filter (function (node) {
    return node.selected;
  });
  if (selected.length > 0) {
    gNodes.initial = selected[0];
  }
};

gNodes.setAccepting = function (accepting) {
  gNodes.nodes.filter (function (node) {
    return node.selected;
  }).forEach (function (node) {
    node.accept = accepting;
  });
};

gNodes.setRejecting = function (rejecting) {
  gNodes.nodes.filter (function (node) {
    return node.selected;
  }).forEach (function (node) {
    node.reject = rejecting;
  });
};

gNodes.addNode = function (x, y) {
  var node = {};
  
  if (typeof x === "undefined") {
    node.x = gNodes.newNodeX;
    node.y = gNodes.newNodeY;
    gNodes.newNodeX += gNodes.NEW_INCREMENT;
    if (gNodes.newNodeX > gNodes.MAX_NEW_X) {
      gNodes.newNodeX = gNodes.MIN_NEW_X;
      gNodes.newNodeY += gNodes.NEW_INCREMENT;
      if (gNodes.newNodeY > gNodes.MAX_NEW_Y) {
        gNodes.newNodeY = gNodes.MIN_NEW_Y;
      }
    }
  } else {
    node.x = x;
    node.y = y;
  }
  
  node.id = gNodes.nextId++;
  node.name = "n" + node.id;
  node.accept = false;
  node.reject = false;
  node.selected = false;
  
  gNodes.nodes.push (node); 
  
  gEdges.addNode (node);
};

gNodes.setInitialByIndex = function (index) {
  gNodes.initial = gNodes.nodes[index];
};

gNodes.clearInitial = function () {
  gNodes.initial = null;
};

gNodes.setAcceptByIndex = function (index, accept) {
  gNodes.nodes[index].accept = accept;
};

gNodes.removeByIndex = function (index) {
  gEdges.removeNode (gNodes.nodes[index]);
  gNodes.nodes.splice (index, 1);
};

gNodes.removeNodes = function () {
  for (var i = 0; i < gNodes.nodes.length; i++) {
    if (gNodes.nodes[i].selected) {
      if (gNodes.initial.id == gNodes.nodes[i].id) {
        gNodes.initial = null;
      }
      gEdges.removeNode (gNodes.nodes[i]);
      gNodes.nodes.splice (i--, 1);
    }
  }
};

gNodes.createDOMNodes = function (lowerSelection, upperSelection) {
  gBehaviors.apply ("lowerNodes", 
    lowerSelection.append ("circle")
      .classed ("transparent", true)
      .attr ("r", gNodes.SELECTABLE_RADIUS)
  );

  upperSelection = upperSelection.append ("g");
  
  gBehaviors.apply ("nodes", 
    upperSelection.append ("circle")
      .classed ("outer", true)
      .attr ("r", gNodes.RADIUS)
  );
    
  gBehaviors.apply ("nodes", 
    upperSelection.append ("circle")
      .classed ("inner", true)
      .attr ("r", gNodes.INNER_RADIUS)
  );
  
  upperSelection.append ("text");
};

gNodes.getSelected = function () {
  var selected = [];
  gNodes.nodes.forEach (function (node) {
    if (node.selected) {
      selected.push (node.name);
    }
  });
  return selected;
};

gNodes.save = function () {
  return {
    nodes: gNodes.nodes,
    initial: gNodes.initial == null ? null : gNodes.initial.id
  };
};

gNodes.load = function (saveData) {
  gNodes.nodes = saveData.nodes;
  gNodes.initial = saveData.initial;
  if (gNodes.initial != null) {
    gNodes.initial = gNodes.nodes[gNodes.getNodeIndex (gNodes.initial)];
  }
};

gNodes.selectionIsAccepting = function () {
  var accepting = true;
  var selectionExists = false;
  gNodes.nodes.forEach (function (node) {
    if (node.selected) {
      selectionExists = true;
      if (node.selected && !node.accept) {
        accepting = false;
      }
    }
  });
  return accepting && selectionExists;
};

gNodes.selectionIsRejecting = function () {
  var rejecting = true;
  var selectionExists = false;
  gNodes.nodes.forEach (function (node) {
    if (node.selected) {
      selectionExists = true;
      if (node.selected && !node.reject) {
        rejecting = false;
      }
    }
  });
  return rejecting && selectionExists;
};

gNodes.selectionIsNeither = function () {
  var neither = true;
  var selectionExists = false;
  gNodes.nodes.forEach (function (node) {
    if (node.selected) {
      selectionExists = true;
      if (node.accept || node.reject) {
        neither = false;
      }
    }
  });
  return neither && selectionExists;
};

gNodes.drawDOMNodes = function (lowerSelection, upperSelection) {
  lowerSelection.attr ("cx", function(d) { return d.x; })
    .attr ("cy", function(d) { return d.y; });
    
  upperSelection.classed ("selected", function (d) { return d.selected; })
    .classed ("accept", function (d) { return d.accept; })
    .classed ("reject", function (d) { return d.reject; });
  
  upperSelection.select ("circle.inner")
    .attr ("cx", function(d) { return d.x; })
    .attr ("cy", function(d) { return d.y; });
    
  upperSelection.select ("circle.outer")
    .attr ("cx", function (d) { return d.x; })
    .attr ("cy", function (d) { return d.y; });
    
  upperSelection.select ("text")
    .html (function (d) { return d.name; })
    .attr ("x", function (d) { return d.x; })
    .attr ("y", function (d) { return d.y; });
};

gNodes.destroyDOMNodes = function (lowerSelection, upperSelection) {
  lowerSelection.remove ();
  upperSelection.remove ();
};

gNodes.draw = function () {
  var lowerNodes = gNodes.lowerG.selectAll ("circle").data (gNodes.nodes, function (d) { return d.id; });
  var upperNodes = gNodes.upperG.selectAll ("g").data (gNodes.nodes, function (d) { return d.id; });
  
  gNodes.createDOMNodes (lowerNodes.enter (), upperNodes.enter ());
  gNodes.drawDOMNodes (lowerNodes, upperNodes);
  gNodes.destroyDOMNodes (lowerNodes.exit (), upperNodes.exit ());
};

gNodes.getNodeIndex = function (id) {
  var index = -1;
  gNodes.nodes.forEach (function (node, i) {
    if (node.id === id) {
      index = i;
    }
  });
  return index;
}

gNodes.getNodeIndexFromName = function (name) {
  var index = -1;
  gNodes.nodes.forEach (function (node, i) {
    if (node.name === name) {
      index = i;
    }
  });
  return index;
}