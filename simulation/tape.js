var gTape =
  {
    SELECT_RADIUS: 50,
    BUBBLE_OFFSET: 55,
    BUBBLE_WIDTH: 12,
    BUBBLE_HEIGHT: 2,
    TEXT_OFFSET: 12,
    ARROW_OFFSET: 20
  };

gTape.init = function () {
  d3.select (".tape")
    .append ("circle")
    .style ("fill", "none")
    .style ("stroke", "blue")
    .attr ("r", gTape.SELECT_RADIUS);
  d3.select (".tape")
    .append ("rect")
    .style ("fill", "blue")
    .style ("stroke", "none")
    .attr ("rx", 4)
    .attr ("ry", 4);
  d3.select (".tape")
    .append ("polygon")
    .attr ("points", "-6,0 6,0 0,4")
    .style ("fill", "blue")
    .style ("stroke", "none");
  d3.select (".tape")
    .append ("text")
    .style ("stroke", "none")
    .style ("fill", "white");
  gTape.hide ();
  gTape.done = true;
  gTape.running = false;
  gTape.animating = false;
};

gTape.run = function () {
  var input = gTestMenu.text;
  gTape.done = false;
  gTape.running = true;
  d3.select (".tape")
    .select ("circle")
    .style ("stroke", "blue");
  d3.select (".tape")
    .select ("rect")
    .style ("fill", "blue");
  d3.select (".tape")
    .select ("polygon")
    .style ("fill", "blue");
    
  gTape.input = input.split ("");
  gTape.index = 0;
  gTape.follow = gTape.current = gNodes.initial;
  gTape.draw ();
};

gTape.drawResult = function (accepted) {
  if (!gTape.done) {
    var message = "Run finished, " + (accepted ? "accept" : "reject") + "ing string \"" + gTape.input.join ("") + "\"";
    if (gGraph.mode == gGraph.TM && gTape.follow && !gTape.follow.accept && !gTape.follow.reject) {
      message += " because of a missing transition";
    } else if (gGraph.mode != gGraph.TM && gTape.follow && !gTape.follow.accept && gTape.input.length > gTape.index) {
      message += " because of a missing transition";
    }
    gErrorMenu.displayMessage (message, false, accepted ? "accepting run-finished" : "rejecting run-finished");
    gTape.done = true;
  }
};

gTape.draw = function () {
  var circle = d3.select (".tape").select ("circle");
  var rect = d3.select (".tape").select ("rect");
  var poly = d3.select (".tape").select ("polygon");
  var text = d3.select (".tape").select ("text");
  if (gTape.follow) {
    var duration = gTape.follow != gTape.prev && circle.style ("opacity") == 1 ? 100 : 0;
    text.text ("CURRENT STATE");
    circle.transition ()
      .duration (duration)
      .attr ("cx", gTape.follow.x)
      .attr ("cy", gTape.follow.y)
      .style ("opacity", 1);
    var textSize;
    text.each (function () { textSize = this.getBoundingClientRect (); });
    var rectY = gTape.follow.y - gTape.BUBBLE_OFFSET - textSize.height - gTape.BUBBLE_HEIGHT;
    rect.transition ()
      .attr ("width", textSize.width + gTape.BUBBLE_WIDTH)
      .attr ("height", textSize.height + gTape.BUBBLE_HEIGHT)
      .duration (duration)
      .attr ("x", gTape.follow.x - (textSize.width + gTape.BUBBLE_WIDTH) / 2)
      .attr ("y", rectY)
      .style ("opacity", 1);
    poly.transition ()
      .duration (duration)
      .attr ("transform", "translate(" + gTape.follow.x + "," + (rectY + gTape.ARROW_OFFSET) + ")")
      .style ("opacity", 1);
    text.transition ()
      .duration (duration)
      .attr ("x", gTape.follow.x)
      .attr ("y", rectY + textSize.height / 2 + gTape.BUBBLE_HEIGHT + (isIE ? gNodes.IE_TEXT_OFFSET : 0))
      .style ("opacity", 1);
      
    d3.select (".stepButton").text ("Step").node ().disabled = false;
    if (gTape.isRejecting ()) {
      circle.style ("stroke", "red");
      rect.style ("fill", "red");
      poly.style ("fill", "red");
      d3.select (".stepButton").text ("Completed").node ().disabled = true;
      gTape.drawResult (false);
    }
    else if (gTape.isAccepting ()) {
      circle.style ("stroke", "green");
      rect.style ("fill", "green");
      poly.style ("fill", "green");
      d3.select (".stepButton").text ("Completed").node ().disabled = true;
      gTape.drawResult (true);
    }
  } else {
    circle.style ("opacity", 0);
    rect.style ("opacity", 0);
    poly.style ("opacity", 0);
    text.style ("opacity", 0);
  }
  var currentTapeClass = gGraph.mode == gGraph.TM ? "current-tape-char-solid" : "current-tape-char";
  if (gTape.running && gTape.index <= gTape.input.length) {
    d3.selectAll (".tape-char")
      .classed (currentTapeClass, function (junk, i) {
        if (!d3.select (this).classed (currentTapeClass) && gTape.index == i) {
          this.focus ();
          this.blur ();
        }
        return gTape.index == i;
      });
    
  }
  gTape.prev = gTape.follow;
};

gTape.isAccepting = function () {
  if (gGraph.mode == gGraph.DFA) {
    return typeof gTape.current != "undefined" && 
      gTape.current.accept &&
      gTape.index == gTape.input.length;
  } else {
    return typeof gTape.current != "undefined" && 
      gTape.current.accept;
  }
};

gTape.isRejecting = function () {
  if (gGraph.mode == gGraph.DFA) {
    return typeof gTape.current == "undefined" || 
      (!gTape.current.accept && gTape.index == gTape.input.length);
  } else {
    return typeof gTape.current == "undefined" || gTape.current.reject;
  }
};

gTape.show = function () {
  d3.select (".tape").style ("opacity", 1);
};

gTape.reset = function () {
  gTape.done = true;
  gTape.running = false;
  gTape.follow = null;
  gTape.draw ();
};

gTape.hide = function () {
  gTape.reset ();
  d3.select (".tape").style ("opacity", 0);
};

gTape.animate = function () {
  gTape.animating = true;
  gTape.step ();
};

gTape.step = function () {
  if (!gTape.running) {
    gTape.run ();
    return;
  }
  if (!gTape.isRejecting () && !gTape.isAccepting ()) {
    if (gGraph.mode == gGraph.DFA) {
      var next = gDFASimulator.step (gGraph.save (), gTape.current.id,  gTape.input,  gTape.index++);
      gTape.current = gNodes.nodes[gNodes.getNodeIndex (next)];
    } else {
      var next = gTMSimulator.step (gGraph.save (), gTape.current.id,  gTape.input.join (""),  gTape.index);
      gTape.current = gNodes.nodes[gNodes.getNodeIndex (next.initial)];
      gTape.input = next.input.split ("");
      gTape.index = next.index;
      gTestMenu.disallowInput (gTape.input.join (""));
    }
    if (typeof gTape.current != "undefined") {
      gTape.follow = gTape.current;
    }
  } else {
    gTape.animating = false;
  }
  gTape.draw ();
  if (gTape.animating) {
    setTimeout (gTape.step, 1000 / 3);
  }
};