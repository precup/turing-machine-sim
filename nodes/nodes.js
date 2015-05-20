var gNodes =
  {
    SELECTABLE_RADIUS: 50,
    RADIUS: 30,
    INNER_RADIUS: 24,
    STROKE_WIDTH: 2,
    NEW_BUFFER: 100,
    NEW_INCREMENT: 100,
    IE_TEXT_OFFSET: 5
  };

gNodes.init = function () {
  gNodes.lowerG = d3.select ("g.nodesLower");
  gNodes.upperG = d3.select ("g.nodes");

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

gNodes.wouldOverlap = function (x, y) {
  var overlaps = false;
  gNodes.nodes.forEach (function (node) {
    overlaps |= dist (x, y, node.x, node.y) <= gNodes.RADIUS * 2;
  });
  return overlaps;
}

gNodes.addNode = function (x, y) {
  var node = {};

  if (typeof x === "undefined") {
    var foundPosition = false;
    for (node.y = gNodes.NEW_BUFFER;
         node.y <= gGraph.height - gNodes.NEW_BUFFER && !foundPosition;
         node.y += gNodes.NEW_INCREMENT) {
      for (node.x = gNodes.NEW_BUFFER;
           node.x <= gGraph.width - gNodes.NEW_BUFFER && !foundPosition;
           node.x += gNodes.NEW_INCREMENT) {
        foundPosition = !gNodes.wouldOverlap (node.x, node.y);
      }
    }
    node.x -= gNodes.NEW_INCREMENT;
    node.y -= gNodes.NEW_INCREMENT;
  } else {
    node.x = x;
    node.y = y;
  }

  var nextNameId = 0;
  while (gNodes.getNodeIndexFromName ("n" + nextNameId) != -1) {
    nextNameId++;
  }
  var nextId = 0;
  while (gNodes.getNodeIndex (nextId) != -1) {
    nextId++;
  }
  node.id = nextId;
  node.name = "n" + nextNameId;
  node.accept = false;
  node.reject = false;
  node.selected = true;
  gNodes.deselectAll ();

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

gNodes.setRejectByIndex = function (index, reject) {
  gNodes.nodes[index].reject = reject;
};

gNodes.removeByIndex = function (index) {
  if (gTape.follow != null && gTape.follow.id == gNodes.nodes[index].id) {
    gTestMenu.end ();
  }
  if (gNodes.initial != null && gNodes.initial.id == gNodes.nodes[index].id) {
    gNodes.initial = null;
  }
  gEdges.removeNode (gNodes.nodes[index]);
  gNodes.nodes.splice (index, 1);
};

gNodes.removeNodes = function () {
  if (gTape.follow != null && gTape.follow.selected) {
    if (gTape.done) {
      gTestMenu.end ();
    } else {
      gErrorMenu.displayError ("The current state in a running test cannot be deleted");
      return false;
    }
  }
  for (var i = 0; i < gNodes.nodes.length; i++) {
    if (gNodes.nodes[i].selected) {
      if (gNodes.initial != null && gNodes.initial.id == gNodes.nodes[i].id) {
        gNodes.initial = null;
      }
      gEdges.removeNode (gNodes.nodes[i]);
      gNodes.nodes.splice (i--, 1);
    }
  }
  return true;
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
  gNodes.nextId = 0;

  gNodes.nodes.forEach (function (node) {
    gNodes.nextId = Math.max (node.id + 1, gNodes.nextId);
  });

  gNodes.scale ();
};

gNodes.scale = function () {
  if (gNodes.nodes.length > 0) {
    var xMin = gNodes.nodes[0].x;
    var xMax = gNodes.nodes[0].x;
    var yMin = gNodes.nodes[0].y;
    var yMax = gNodes.nodes[0].y;
    for (var i = 1; i < gNodes.nodes.length; i++) {
      xMin = Math.min (xMin, gNodes.nodes[i].x);
      xMax = Math.max (xMax, gNodes.nodes[i].x);
      yMin = Math.min (yMin, gNodes.nodes[i].y);
      yMax = Math.max (yMax, gNodes.nodes[i].y);
    }
    var leftBound = xMin;
    var rightBound = xMax;
    if (gGraph.BUFFER > xMin || gGraph.width - gGraph.BUFFER < xMax) {
      leftBound = gGraph.BUFFER;
      rightBound = gGraph.width - gGraph.BUFFER;
    }
    var topBound = yMin;
    var bottomBound = yMax;
    if (gGraph.BUFFER > yMin || gGraph.height - gGraph.BUFFER < yMax) {
      topBound = gGraph.BUFFER;
      bottomBound = gGraph.height - gGraph.BUFFER;
    }

    for (var i = 0; i < gNodes.nodes.length; i++) {
      var xDenom = xMax - xMin;
      var xPercent = xDenom == 0 ? 1 : (gNodes.nodes[i].x - xMin) / xDenom;
      var yDenom = yMax - yMin;
      var yPercent = yDenom == 0 ? 1 : (gNodes.nodes[i].y - yMin) / yDenom;
      gNodes.nodes[i].x = leftBound * (1 - xPercent) + rightBound * xPercent;
      gNodes.nodes[i].y = topBound * (1 - yPercent) + bottomBound * yPercent;
    }
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
    .text (function (d) { return d.name; })
    .attr ("x", function (d) { return d.x; })
    .attr ("y", function (d) { return d.y + (isIE ? gNodes.IE_TEXT_OFFSET : 0); });
};

gNodes.destroyDOMNodes = function (lowerSelection, upperSelection) {
  lowerSelection.remove ();
  upperSelection.remove ();
};

gNodes.draw = function () {
  if (isIE) {
    gNodes.lowerG.selectAll ("circle").remove ();
    gNodes.upperG.selectAll ("g").remove ();
  }
  
  gNodes.upperG.select (".empty-text").remove ();
  if (gNodes.nodes.length == 0) {
    var emptyText = isSafari ? "Click Add New State to create your first node." :
                               "Double-click to create your first node.";
    var text = gNodes.upperG.append ("text")
      .classed ("empty-text", true)
      .style ("font-size", 20)
      .style ("font-family", '"San Francisco", "Helvetica Neue", "Helvetica", "Arial", sans-serif')
      .style ("fill", "rgba(0, 0, 0, 0.4)")
      .style ("stroke", "none")
      .attr ("x", gGraph.width / 2)
      .attr ("y", gGraph.height / 2)
      .text (emptyText);
  }
  
  var lowerNodes = gNodes.lowerG.selectAll ("circle").data (gNodes.nodes, function (d) { return d.id; });
  var upperNodes = gNodes.upperG.selectAll ("g").data (gNodes.nodes, function (d) { return d.id; });

  gNodes.createDOMNodes (lowerNodes.enter (), upperNodes.enter ());
  gNodes.drawDOMNodes (lowerNodes, upperNodes);
  gNodes.destroyDOMNodes (lowerNodes.exit (), upperNodes.exit ());
};

gNodes.validMoveX = function (dx) {
  var valid = true;
  gNodes.nodes.filter (function (node) {
    return node.selected;
  }).forEach (function (node) {
    valid &= (node.x + dx >= gNodes.RADIUS + gNodes.STROKE_WIDTH || dx >= 0);
    valid &= (node.x + dx <= gGraph.width - gNodes.RADIUS - gNodes.STROKE_WIDTH || dx <= 0);
  });
  return valid;
};


gNodes.validMoveY = function (dy) {
  var valid = true;
  gNodes.nodes.filter (function (node) {
    return node.selected;
  }).forEach (function (node) {
    valid &= (node.y + dy >= gNodes.RADIUS + gNodes.STROKE_WIDTH || dy >= 0);
    valid &= (node.y + dy <= gGraph.height - gNodes.RADIUS - gNodes.STROKE_WIDTH || dy <= 0);
  });
  return valid;
};

gNodes.getNodeIndex = function (id) {
  var index = -1;
  gNodes.nodes.forEach (function (node, i) {
    if (node.id == id) {
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
