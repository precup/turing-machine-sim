// TODO: Shorten edges so the triangle isn't cut off

var gEdges =
  {
    BIDIRECTIONAL_OFFSET: 8,
    LOOP_WIDTH: 70,
    LOOP_HEIGHT: 80,
    LOOP_PEAK: 50,
    LOOP_TEXT_OFFSET: 70,
    TEXT_OFFSET: 10,
    TRANSITION_DY: 20,
    TSPAN_HEIGHT: 10,
    // The below constant is also set in tm.css, change it there, too (in path.lower)
    SELECTABLE_WIDTH: 25,
    // Marker Constants
    // Less useful ones are hardcoded in buildMarker
    // They're all simply guess and check, no real meaning to them
    MARKER_SIZE: 30,
    END_ARROW_OFFSET: 36,
    MOUSE_ARROW_OFFSET: 13
  };
  
if (isIE) {
  //gEdges.BIDIRECTIONAL_OFFSET = 12;
}
  
gEdges.init = function () {  
  gEdges.lowerG = d3.select ("g.edgesLower");
  gEdges.upperG = d3.select ("g.edges");

  gEdges.straightLineFunction = d3.svg.line ()
      .x (function (point) { return point.x; })
      .y (function (point) { return point.y; })
      .interpolate ("linear");
      
  gEdges.curvedLineFunction = d3.svg.line ()
      .x (function (point) { return point.x; })
      .y (function (point) { return point.y; })
      .interpolate ("basis");
      
  gEdges.lineFunction = function (data) {
    if (data[0].x == data[1].x && data[0].y == data[1].y) {
      return gEdges.curvedLineFunction ([
        { x: data[0].x, y: data[0].y },
        { x: data[0].x + gEdges.LOOP_PEAK, y: data[0].y - gEdges.LOOP_HEIGHT / 2 },
        { x: data[0].x + gEdges.LOOP_WIDTH, y: data[0].y },
        { x: data[0].x + gEdges.LOOP_PEAK, y: data[0].y + gEdges.LOOP_HEIGHT / 2 },
        { x: data[0].x, y: data[0].y },
      ]);
    } else {
      return gEdges.straightLineFunction (data);
    }
  };
  
  gEdges.customPathFunction = function (source, target) {
    var startPoint = { x: source.x, y: source.y };
    var endPoint = { x: target.x, y: target.y };
    if (target.id != source.id && 
        gEdges.areConnected (target.id, source.id)) {
      startPoint = gEdges.offsetPoint(startPoint, source, target, gEdges.BIDIRECTIONAL_OFFSET);
      endPoint = gEdges.offsetPoint(endPoint, source, target, gEdges.BIDIRECTIONAL_OFFSET);
    }
    return gEdges.lineFunction ([startPoint, endPoint]);
  };
  
  gEdges.pathFunction = function (edge) {
    return gEdges.customPathFunction (edge.source, edge.target);
  };
  
  gEdges.buildMarker('end-arrow', gEdges.END_ARROW_OFFSET, 'black');
  gEdges.buildMarker('mouse-arrow', gEdges.MOUSE_ARROW_OFFSET, 'black');
  
  gEdges.edges = [];
  gEdges.edgeMap = {};
  
  gEdges.initInitial ();
  gEdges.initSelection ();
  gEdges.initDragging ();
  gEdges.initEditing ();
};

gEdges.addEdge = function (source, target) {
  var edge = {};
  
  edge.source = source;
  edge.target = target;
  edge.transitions = [[]];
  
  gEdges.edges.push (edge);
  gEdges.edgeMap[source.id].push (target.id);
};

gEdges.removeEdge = function (source, target) {
  gEdges.edges = gEdges.edges.filter (function (edge) {
    return edge.source.id != source.id || edge.target.id != target.id;
  });
  
  var index = gEdges.edgeMap[source.id].indexOf(target.id);
  gEdges.edgeMap[source.id].splice(index, 1);
};

gEdges.addNode = function (node) {
  gEdges.edgeMap[node.id] = [];
};

gEdges.removeNode = function (node) {
  gEdges.edges = gEdges.edges.filter (function (edge) {
    return edge.source.id != node.id && edge.target.id != node.id;
  });
  for (var sourceId in gEdges.edgeMap) {
    var index = gEdges.edgeMap[sourceId].indexOf(node.id);
    gEdges.edgeMap[sourceId].splice(index, 1);
  };
  delete gEdges.edgeMap[node.id];
};

gEdges.save = function () {
  var saveData =
    {
      edgeMap: JSON.parse (JSON.stringify (gEdges.edgeMap)),
      edges: JSON.parse (JSON.stringify (gEdges.edges))
    };
    
  saveData.edges.forEach (function (edge) {
    edge.source = edge.source.id;
    edge.target = edge.target.id;
  });
  return saveData;
};

gEdges.load = function (saveData) {
  gEdges.edges = saveData.edges;
  gEdges.edgeMap = saveData.edgeMap;
  gEdges.edges.forEach (function (edge) {
    edge.source = gNodes.nodes[gNodes.getNodeIndex (edge.source)];
    edge.target = gNodes.nodes[gNodes.getNodeIndex (edge.target)];
  });
};

gEdges.createDOMEdges = function (lowerSelection, upperSelection) {
  gBehaviors.apply ("edges",
    lowerSelection.append ("path")
      .attr("fill", "none")
      .classed ("lower", true)
      .classed ("transparent", true)
  );
    
  
  upperSelection = upperSelection.append ("g");
  gBehaviors.apply ("edges", upperSelection);
  
  upperSelection.append ("path")
    .attr ("fill", "none")
    .classed ("edge", true);
    
  upperSelection.append ("text");
};

gEdges.drawDOMEdges = function (lowerSelection, upperSelection) {
  lowerSelection.attr ("d", gEdges.pathFunction);

  upperSelection.select ("path")
    .attr ("d", gEdges.pathFunction)
    .classed ("selected", function (edge) {
      return edge.selected;
    }).style('marker-end', function (edge) {
      return edge.selected ? 'url(#sel-arrow)' : 'url(#end-arrow)';
    });
    
  var tspans = upperSelection.select ("text")
    .selectAll ("tspan")
    .data (function (edge) { return gGraph.mode == gGraph.TM ? edge.transitions[0] : edge.transitions; });
    
  tspans.enter ().append ("tspan");
  
  tspans.text (gEdges.getEdgeLabel)
    .attr ("x", function (d, i2, i1) {
      var actualEdge;
      d3.select (this.parentNode).each (function (edge, i) {
        actualEdge = edge;
      });
      return gEdges.getTextPosition (actualEdge.source, 
                                     actualEdge.target, 
                                     this.parentNode.getBoundingClientRect ()).x; 
    }).attr ("dy", gEdges.TRANSITION_DY);
    
  upperSelection.select ("text")
    .attr("x", function (edge) { 
      return gEdges.getTextPosition (edge.source, 
                                     edge.target, 
                                     this.getBoundingClientRect ()).x; 
    }).attr("y", function (edge) {
      var tspanCount = d3.select (this).selectAll ("tspan").size () - 1;
      return gEdges.getTextPosition (edge.source, 
                                     edge.target, 
                                     this.getBoundingClientRect ()).y + tspanCount * gEdges.TSPAN_HEIGHT; 
    });
    
  tspans.exit ().remove ();
    
  gEdges.drawInitial ();
};

gEdges.destroyDOMEdges = function (lowerSelection, upperSelection) {
  lowerSelection.remove ();
  upperSelection.remove ();
};

gEdges.draw = function () {
  if (isIE) {
    gEdges.lowerG.selectAll ("path").remove ();
    gEdges.upperG.selectAll ("g").remove ();
  }
  var lowerEdges = gEdges.lowerG.selectAll ("path").data (gEdges.edges, gEdges.getEdgeId);
  var upperEdges = gEdges.upperG.selectAll ("g").data (gEdges.edges, gEdges.getEdgeId);
  
  gEdges.createDOMEdges (lowerEdges.enter (), upperEdges.enter ());
  gEdges.drawDOMEdges (lowerEdges, upperEdges);
  gEdges.destroyDOMEdges (lowerEdges.exit (), upperEdges.exit ());
};

gEdges.areConnected = function (sourceId, targetId) {
  return (gEdges.endNode != null && sourceId == gEdges.startNode.id && targetId == gEdges.endNode.id) ||
    (gEdges.edgeMap[sourceId] && gEdges.edgeMap[sourceId].indexOf(targetId) > -1);
};

gEdges.getEdgeLabel = function (transition) { 
  if (gGraph.mode == gGraph.TM) {
    var from = transition.from == ' ' ? gSquare : transition.from;
    var to = transition.to == ' ' ? gSquare : transition.to;
    return from + String.fromCharCode(0x2192) + to + ", " + (transition.direction == 1 ? "R" : "L");
  } else {
    return gEdges.reduceLabel (transition);
  }
};

gEdges.reduceLabel = function (transition) {
  var charSet = gGraph.tapeSet;
  var text = "";
  if (charSet.length / 2 >= transition.length) {
    transition.forEach (function (symbol) {
      text += symbol + ", ";
    });
    if (text.length != 0) {
      text = text.substring (0, text.length - 2);
    }
  } else {
    text = "Σ - ";
    charSet.split ("").forEach (function (symbol) {
      if (transition.indexOf (symbol) == -1) {
        text += symbol + ", ";
      }
    });
    if (text.length != 6) {
      text = text.substring (0, text.length - 2);
    } else {
      text = "Σ";
    }
    if (transition.indexOf(gEpsilon) != -1) {
      text += " + " + gEpsilon;
    }
  }
  return text;
};

gEdges.getEdgeId = function (edge) {
  return edge.source.id + " " + edge.target.id;
};

gEdges.getEdge = function (source, target) {
  var targetEdge = null;
  gEdges.edges.forEach (function (edge) {
    if (edge.source.id == source.id && edge.target.id == target.id) {
      targetEdge = edge;
    }
  });
  return targetEdge;
};

gEdges.buildMarker = function (id, refX, fill) {
  d3.select("svg").append('svg:defs').append('svg:marker')
      .attr('id', id)
      .attr('viewBox', '0 -50 100 100')
      .attr('refX', refX)
      .attr('markerWidth', gEdges.MARKER_SIZE)
      .attr('markerHeight', gEdges.MARKER_SIZE)
      .attr('orient', 'auto')
    .append('svg:path')
      .attr('d', 'M 0,-5 L 10,0 L 0,5 z')
      .attr('fill', fill)
      .attr('stroke', fill)
      .style('pointer-events', 'none');
};

gEdges.getTextPosition = function (source, target, bbox) {
  var startPoint = { x: source.x, y: source.y };
  var endPoint = { x: target.x, y: target.y };
  if (target.id == source.id) {
    startPoint.x += gEdges.LOOP_TEXT_OFFSET;
    startPoint.y -= 1;
    endPoint.x += gEdges.LOOP_TEXT_OFFSET;
    endPoint.y += 1;
  } else if (gEdges.areConnected (target.id, source.id)) {
    startPoint = gEdges.offsetPoint(startPoint, source, target, gEdges.BIDIRECTIONAL_OFFSET);
    endPoint = gEdges.offsetPoint(endPoint, source, target, gEdges.BIDIRECTIONAL_OFFSET);
  }
  
  var midpoint = { x : (startPoint.x + endPoint.x) / 2, y : (startPoint.y + endPoint.y) / 2 };
  var theta = Math.bound (Math.atan2 (startPoint.y - endPoint.y, startPoint.x - endPoint.x) + Math.PI / 2, 0, 2 * Math.PI);
  var dist = Math.sqrt (Math.pow (bbox.height / 2, 2) + Math.pow (bbox.width / 2, 2));
  var hc = (theta > Math.PI) ? -1 : 1;
  var wc = (theta < 3 * Math.PI / 2 && theta >= Math.PI / 2) ? -1 : 1;
  var dtheta = Math.bound (Math.atan2 (hc * bbox.height, wc * bbox.width), 0, 2 * Math.PI);
  var ttheta = Math.abs (dtheta - theta);
  var q = Math.cos (ttheta) * dist;
  q += gEdges.TEXT_OFFSET;
  return {
    x: midpoint.x + Math.cos (theta) * q,
    y: midpoint.y - bbox.height + Math.sin (theta) * q
  };
};

gEdges.offsetPoint = function (point, orig, perp, distance) {
  var angle = Math.atan2 (orig.y - perp.y, orig.x - perp.x);
  var rotatedAngle = angle + Math.PI / 2;
  return {
    x: point.x + Math.cos (rotatedAngle) * distance,
    y: point.y + Math.sin (rotatedAngle) * distance
  };
};