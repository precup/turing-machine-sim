/* This file takes care of everything related to the dragging
 * of new edges. */

/* Sets up everything related to dragging. */
gEdges.initDragging = function () {    
  gEdges.dragging = false;
  gEdges.startNode = null;
  gEdges.backupNode = null;
  gEdges.endNode = null;
  
  // This handles the behaviors for the lowerNodes themselves
  var always = function () { return true; };
  gBehaviors.addBehavior ("lowerNodes", "mouseover", function () {
      return !gNodes.dragging;
    }, gEdges.showTempEdge);
  gBehaviors.addBehavior ("lowerNodes", "mousemove", function () {
      return !gNodes.dragging;
    }, gEdges.drawTempEdge);
  gBehaviors.addBehavior ("lowerNodes", "mousedown", always, gEdges.startDragging);
  gBehaviors.addBehavior ("background", "mousedown", function () {
      if (gEdges.startNode == null) {
        return false;
      }
      var mouse = d3.mouse(d3.select("svg").node());
      var dist = Math.sqrt (Math.pow (mouse[0] - gEdges.startNode.x, 2) + 
        Math.pow (mouse[1] - gEdges.startNode.y, 2));
      return dist <= gNodes.SELECTABLE_RADIUS && dist > gNodes.RADIUS;
  }, gEdges.startDragging);
  
  // These are the behaviors for hiding or drawing the edge
  // The first few handle when the edge needs to snap to a node
  // The rest are for hiding and drawing, depending on whether 
  // the user is currently dragging.
  gBehaviors.addBehavior ("nodes", "mouseover", function () {
      return !gEdges.dragging && gEdges.tempVisible;
    }, gEdges.hideTempEdge);
  gBehaviors.addBehavior ("nodes", "mouseover", function () {
      return gEdges.dragging;
    }, gEdges.setTempEdgeEnd);
  gBehaviors.addBehavior ("nodes", "mouseout", always, gEdges.unsetTempEdgeEnd);
  gBehaviors.addBehavior ("background", "mousemove", function () {
      var mouse = d3.mouse(d3.select("svg").node());
      if (gEdges.dragging || !gEdges.tempVisible)
        return false;
      var dist = Math.sqrt (Math.pow (mouse[0] - gEdges.startNode.x, 2) + 
        Math.pow (mouse[1] - gEdges.startNode.y, 2));
      return dist > gNodes.SELECTABLE_RADIUS;
    }, gEdges.hideTempEdge);
  gBehaviors.addBehavior ("edges", "mousemove", function () {
      var mouse = d3.mouse(d3.select("svg").node());
      if (gEdges.dragging || !gEdges.tempVisible)
        return false;
      var dist = Math.sqrt (Math.pow (mouse[0] - gEdges.startNode.x, 2) + 
        Math.pow (mouse[1] - gEdges.startNode.y, 2));
      return dist > gNodes.SELECTABLE_RADIUS;
    }, gEdges.hideTempEdge);
  gBehaviors.addBehavior ("background", "mousemove", function () {
      return gEdges.dragging;
    }, gEdges.drawTempEdge);
  gBehaviors.addBehavior ("edges", "mousemove", function () {
      return gEdges.dragging;
    }, gEdges.drawTempEdge);

  
  gBehaviors.addBehavior ("edges", "mouseup", always, gEdges.hideTempEdge);
  gBehaviors.addBehavior ("background", "mouseup", always, gEdges.hideTempEdge);
  
  gBehaviors.addBehavior ("nodes", "mouseup", function () {
      return gEdges.dragging;
    }, gEdges.addTempEdge);
};

/* Unsnaps the drag edge from any node it is snapped to, if any. */
gEdges.unsetTempEdgeEnd = function () {
  if (gEdges.endNode != null) {
    gEdges.endNode = null;
    gGraph.draw ();
  }
};

/* Snaps the edge to the specified node @endNode. */
gEdges.setTempEdgeEnd = function (endNode) {
  gEdges.endNode = endNode;
  gGraph.draw ();
};

/* Turns the currently dragged edge into an actual 
 * edge that terminates at node @endNode. */
gEdges.addTempEdge = function (endNode) {
  gEdges.endNode = null;
  gEdges.backupNode = null;
  gEdges.hideTempEdge ();
  var edge = gEdges.getEdge (gEdges.startNode, endNode);
  if (edge == null) {
    gEdges.addEdge (gEdges.startNode, endNode);
    edge = gEdges.edges[gEdges.edges.length - 1];
  }
  gGraph.draw ();
  gEdges.editEdge (edge);
};

/* Call this to begin dragging an edge. */
gEdges.startDragging = function () {
  gEdges.dragging = true;
};

/* Hides the currently drawn temp edge. If it's dragging, near a node
 * that is not the startNode, and ignoreBackup is false, it will fall
 * back to drawing a new temp edge on the nearby node. */
gEdges.hideTempEdge = function (ignoreBackup) {
  var mouse = ignoreBackup ? [0, 0] : d3.mouse (d3.select ("svg").node ());
  var dist = gNodes.SELECTABLE_RADIUS + 1;
  if (gEdges.backupNode != null) {
    dist = Math.sqrt (Math.pow (mouse[0] - gEdges.backupNode.x, 2) + 
      Math.pow (mouse[1] - gEdges.backupNode.y, 2));
  }
  if (ignoreBackup || gEdges.backupNode == null || dist > gNodes.SELECTABLE_RADIUS) {
    d3.select ("path.temp").remove ();  
    gEdges.dragging = false;
    gEdges.tempVisible = false;
  } else {
    gEdges.startNode = gEdges.backupNode;
    gEdges.dragging = false;
    gEdges.drawTempEdge ();
  }
};

/* Draws the temp edge based on the current internal state. */
gEdges.drawTempEdge = function () {
  if (gEdges.startNode == null) return;
  if (gNodes.dragging) {
    d3.select ("path.temp").remove ();  
    gEdges.dragging = false;
    gEdges.tempVisible = false;
    return;
  }
  var mouse = d3.mouse(d3.select("svg").node());
  
  d3.select ("path.temp").remove ();  
  gEdges.initialEdge = d3.select (".miscEdges")
    .append ("path")
    .classed ("temp", true)
    .style ("opacity", 1)
    .style ('marker-end', 'url(#mouse-arrow)')
    .attr ("fill", "none")
    .attr ("stroke", "black")
    .attr ("d", function () {
      if (gEdges.endNode != null) {
        return gEdges.customPathFunction (gEdges.startNode, gEdges.endNode);
      }
      return gEdges.customPathFunction (gEdges.startNode, { x: mouse[0], y: mouse[1] });
    })
    .style ('marker-end', function () {
      return gEdges.endNode == null ? 'url(#mouse-arrow)' : 'url(#end-arrow)';
    });
};

/* Shows a temp edge that starts at node @startNode. */
gEdges.showTempEdge = function (startNode) {
  if (!gNodes.dragging) {
    if (!gEdges.dragging) {
      gEdges.startNode = startNode;
      gEdges.tempVisible = true;
      gEdges.drawTempEdge ();
    } else {
      gEdges.backupNode = startNode;
    }
  }
};
