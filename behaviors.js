var gBehaviors = 
  {
  };

gBehaviors.init = function () {
  gBehaviors.handlers = {};
  
  gBehaviors.configure ("edges", ["mousedown", "mousemove", "mouseup"]);
  gBehaviors.configure ("nodes", ["mousedown", "drag", "mouseover", "mouseout", "mouseup"]);
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
      // console.log ("event triggered for " + type + ", event is: " + event);
      // console.log (gBehaviors.handlers[type][event].length);
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
        .on ("dragstart", function () { gNodes.dragging = true; })
        .on ("dragend", function () { gNodes.dragging = false; })
      );
    } else {
      selection.on (event, gBehaviors[type][event]);
    }
  };
}