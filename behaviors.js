var gBehaviors = 
  {
  };

gBehaviors.init = function () {
  gBehaviors.handlers = {};
  
  gBehaviors.configure ("edges", ["mousedown", "mousemove", "mouseup", "dblclick"]);
  gBehaviors.configure ("nodes", ["mousedown", "drag", "mouseover", "mouseout", "mouseup", "dblclick"]);
  gBehaviors.configure ("lowerNodes", ["mousedown", "mousemove", "mouseover", "mouseout"]);
  gBehaviors.configure ("brush", ["brushstart", "brush"]);
  gBehaviors.configure ("background", ["dblclick", "mousemove", "mouseover", "mouseup", "mousedown"]);
  gBehaviors.configure ("page", ["keyup", "keydown"]);
}

gBehaviors.configure = function (type, events) {
  gBehaviors.handlers[type] = {};
  gBehaviors[type] = {};
  
  events.forEach (function (event) {
    gBehaviors.handlers[type][event] = [];
    gBehaviors[type][event] = function (data) {
      //if (event != "mousemove")
      //  console.log ("firing " + event + " for " + type);
      gBehaviors.handlers[type][event].forEach (function (entry) {
        if (entry.condition (data)) {
          entry.action (data);
        }
      });
    };
  });
}

gBehaviors.addBehavior = function (type, event, condition, action) {
  gBehaviors.handlers[type][event].push (
    {
      condition: condition,
      action: action
    }
  );
}

gBehaviors.apply = function (type, selection) {
  for (var event in gBehaviors[type]) {
    if (event === "drag") {
      // TODO: Unkludge this
      selection.call (
        d3.behavior.drag ()
        .on ("drag", gBehaviors[type][event])
        .on ("dragstart", function () { 
          gNodes.selectionX = 0;
          gNodes.selectionY = 0;
          gNodes.dragging = true; 
          gEdges.hideTempEdge (); 
        })
        .on ("dragend", function () { 
          gNodes.dragging = false; 
        })
      );
    } else {
      selection.on (event, gBehaviors[type][event]);
    }
  };
}