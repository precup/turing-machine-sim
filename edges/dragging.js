// TODO: Clean up this file

gEdges.initDragging = function () {
  gEdges.initialEdge = d3.select (".miscEdges")
    .append ("path")
    .classed ("temp", true)
    .style ('marker-end', 'url(#mouse-arrow)')
    .attr ("fill", "none")
    .style ("opacity", 0);
    
  gEdges.dragging = false;
  gEdges.startNode = null;
  gEdges.backupNode = null;
  
  var always = function () { return true; };
  gBehaviors.addBehavior ("lowerNodes", "mouseover", always, gEdges.showTempEdge);
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
  
  gBehaviors.addBehavior ("nodes", "mouseover", function () {
      return !gEdges.dragging && gEdges.tempVisible;
    }, gEdges.hideTempEdge);
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

gEdges.addTempEdge = function (endNode) {
  gEdges.backupNode = null;
  gEdges.hideTempEdge ();
  gEdges.addEdge (gEdges.startNode, endNode);
  gGraph.draw ();
};

gEdges.startDragging = function () {
  gEdges.dragging = true;
};

gEdges.hideTempEdge = function () {
  var mouse = d3.mouse(d3.select("svg").node());
  var dist = gNodes.SELECTABLE_RADIUS + 1;
  if (gEdges.backupNode != null) {
    dist = Math.sqrt (Math.pow (mouse[0] - gEdges.backupNode.x, 2) + 
      Math.pow (mouse[1] - gEdges.backupNode.y, 2));
  }
  if (gEdges.backupNode == null || dist > gNodes.SELECTABLE_RADIUS) {
    d3.select ("path.temp").style ("opacity", 0);
    gEdges.dragging = false;
    gEdges.tempVisible = false;
  } else {
    gEdges.startNode = gEdges.backupNode;
    gEdges.dragging = false;
    gEdges.drawTempEdge ();
  }
};

gEdges.drawTempEdge = function () {
  var mouse = d3.mouse(d3.select("svg").node());
  d3.select ("path.temp")
    .attr ("d", function () {
      return gEdges.customPathFunction (gEdges.startNode, { x: mouse[0], y: mouse[1] });
    });
};

gEdges.showTempEdge = function (startNode) {
  if (!gEdges.dragging) {
    gEdges.startNode = startNode;
    d3.select ("path.temp")
      .style ("opacity", 1);
    gEdges.tempVisible = true;
    gEdges.drawTempEdge ();
  } else {
    gEdges.backupNode = startNode;
  }
};