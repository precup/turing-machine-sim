// TODO: Get actual text bounding box
// TODO: Shorten edges so the triangle isn't cut off

var gEdges =
  {
    BIDIRECTIONAL_OFFSET: 8,
    LOOP_WIDTH: 70,
    LOOP_HEIGHT: 80,
    LOOP_PEAK: 50,
    TEXT_OFFSET: 5,
    TRANSITION_DY: 20,
    // The below constant is also set in tm.css, change it there, too (in path.lower)
    SELECTABLE_WIDTH: 25,
    // Marker Constants
    // Less useful ones are hardcoded in buildMarker
    // They're all simply guess and check, no real meaning to them
    MARKER_SIZE: 30,
    END_ARROW_OFFSET: 36,
    MOUSE_ARROW_OFFSET: 13
  };
  
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
  gEdges.edgeMap[node.id].forEach (function (id) {
    var index = gEdges.edgeMap[id].indexOf(node.id);
    gEdges.edgeMap[id].splice(index, 1);
  });
  delete gEdges.edgeMap[node.id];
};

gEdges.save = function () {
  var saveData =
    {
      edgeMap: JSON.parse (JSON.stringify (gEdges.edgeMap)),
      edges: JSON.parse (JSON.stringify (gEdges.edges))
    };
  console.log (JSON.stringify(saveData.edges));
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
    console.log ((edge.source) + " " + (edge.target));
    console.log (gNodes.getNodeIndex (edge.source) + " " + gNodes.getNodeIndex (edge.target));
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
  
  upperSelection.select ("text")
    .attr("x", function (edge) { 
      var height = this.getBoundingClientRect ().height;
      var width = this.getBoundingClientRect ().width;
      return gEdges.getTextPosition (edge.source, edge.target, { width: 60, height: 20 }).x; 
    }).attr("y", function (edge) { 
      var height = this.getBoundingClientRect ().height;
      var width = this.getBoundingClientRect ().width;
      return gEdges.getTextPosition (edge.source, edge.target, { width: 60, height: 20 }).y; 
    });
    
  var tspans = upperSelection.select ("text")
    .selectAll ("tspan")
    .data (function (edge) { return edge.transitions; });
    
  tspans.enter ().append ("tspan");
  
  tspans.text (function (transition) { 
      var text = "";
      transition.forEach (function (symbol) {
        text += symbol + ", ";
      });
      if (text.length != 0) {
        text = text.substring (0, text.length - 2);
      }
      return text;
    })
    .attr ("x", function (d, i2, i1) { 
      var width = this.parentNode.getBoundingClientRect ().height;
      var height = this.parentNode.getBoundingClientRect ().width;
      return gEdges.getTextPosition (gEdges.edges[i1].source, gEdges.edges[i1].target, { width: 60, height: 20 }).x; 
    }).attr ("dy", gEdges.TRANSITION_DY);
    
  gEdges.drawInitial ();
};

gEdges.destroyDOMEdges = function (lowerSelection, upperSelection) {
  lowerSelection.remove ();
  upperSelection.remove ();
};

gEdges.draw = function () {
  var lowerEdges = gEdges.lowerG.selectAll ("path").data (gEdges.edges, gEdges.getEdgeId);
  var upperEdges = gEdges.upperG.selectAll ("g").data (gEdges.edges, gEdges.getEdgeId);
  
  gEdges.createDOMEdges (lowerEdges.enter (), upperEdges.enter ());
  gEdges.drawDOMEdges (lowerEdges, upperEdges);
  gEdges.destroyDOMEdges (lowerEdges.exit (), upperEdges.exit ());
};

gEdges.areConnected = function (sourceId, targetId) {
  return gEdges.edgeMap[sourceId] && gEdges.edgeMap[sourceId].indexOf(targetId) > -1;
};

gEdges.getEdgeId = function (edge) {
  return edge.source.id + " " + edge.target.id;
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
  var midpoint = { x : (source.x + target.x) / 2, y : (source.y + target.y) / 2 };
  var theta = Math.atan2 (target.y - source.y, target.x - source.x);
  var dist = Math.sqrt (Math.pow (bbox.height / 2, 2) + Math.pow (bbox.width / 2, 2));
  var q = Math.cos (Math.atan2 (bbox.height / 2, bbox.width / 2) - theta);
  q = Math.min (q, Math.cos (Math.atan2 (bbox.height / 2, -bbox.width / 2) - theta));
  q = Math.min (q, Math.cos (Math.atan2 (-bbox.height / 2, bbox.width / 2) - theta));
  q = Math.min (q, Math.cos (Math.atan2 (-bbox.height / 2, -bbox.width / 2) - theta));
  q *= dist;
  q -= gEdges.TEXT_OFFSET;
  return {
    x: midpoint.x + Math.cos (theta + Math.PI / 2) * q,
    y: midpoint.y - bbox.height / 2 + Math.sin (theta + Math.PI / 2) * q
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