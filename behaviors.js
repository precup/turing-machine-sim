/* gBehaviors is an event manager that came about after the
 * realization that the tool is entirely event driven. It
 * attempts to allow for easy separation of different behaviors
 * for the same event. 
 *
 * It, like the code in general, has the shortcoming of hiding
 * some interactions so that certain behavior may be non-obvious.
 * For instance, you may add a behavior to an event without 
 * knowing what else will happen on that event. This is both
 * a feature and a bug, since it allows for decoupled code, 
 * but also shares some of the shortcomings of global variables.
 *
 * Note that @type is simply a key, and can be anything you so
 * choose. Multiple element types may all be used with the same
 * key, as long as d3 can set event handlers on them. 
 */
var gBehaviors = 
  {
  };

/* Initializes the event handler. Add appropriate calls to configure here. */
gBehaviors.init = function () {
  gBehaviors.handlers = {};
  
  gBehaviors.configure ("edges", ["mousedown", "mousemove", "mouseup", "dblclick"]);
  gBehaviors.configure ("nodes", ["mousedown", "drag", "mouseover", "mouseout", "mouseup", "dblclick"]);
  gBehaviors.configure ("lowerNodes", ["mousedown", "mousemove", "mouseover", "mouseout"]);
  gBehaviors.configure ("brush", ["brushstart", "brush"]);
  gBehaviors.configure ("background", ["dblclick", "mousemove", "mouseover", "mouseup", "mousedown"]);
  gBehaviors.configure ("page", ["keyup", "keydown"]);
}

/* Sets up gBehaviors to track events from @type. @events is an array
 * of the event names to track. Do not prefix them with 'on'. */
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

/* Adds a behavior to @type's handling of @event. Do not prefix @event
 * with 'on'. When @event is fired, @action is called, provided a call
 * to @condition returns true. @condition and @action are both passed
 * __data__ as a lone argument.
 */
gBehaviors.addBehavior = function (type, event, condition, action) {
  gBehaviors.handlers[type][event].push (
    {
      condition: condition,
      action: action
    }
  );
}

/* Registers all the events added for @type to everything in
 * the provided @selection. */
gBehaviors.apply = function (type, selection) {
  for (var event in gBehaviors[type]) {
    if (event === "drag") {
      /* This is one of the most unfortunate parts of the code.
       * Unfortunately, because of the way d3 brushes work, event
       * application is slightly different, and must be special 
       * cased. */
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