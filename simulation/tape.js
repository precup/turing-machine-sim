var gTape =
  {
    SELECT_RADIUS: 50
  };

gTape.init = function () {
  d3.select (".tape")
    .append ("circle")
    .style ("fill", "none")
    .style ("stroke", "blue")
    .attr ("r", gTape.SELECT_RADIUS);
  gTape.hide ();
  gTape.done = true;
  gTape.running = false;
};

gTape.run = function () {
  var input = gTestMenu.text;
  gTape.done = false;
  gTape.running = true;
  d3.select (".tape")
    .select ("circle")
    .style ("stroke", "blue");
    
  gTape.input = input.split ("");
  gTape.index = 0;
  gTape.follow = gTape.current = gNodes.initial;
  gTape.draw ();
};

gTape.drawResult = function (accepted) {
  if (!gTape.done) {
    d3.select (".errors")
      .append ("span")
      .text ("Run finished, " + (accepted ? "accept" : "reject") + "ing string \"" + gTape.input.join ("") + "\"")
      .classed ("run-finished", true)
      .classed ("accepting", accepted)
      .classed ("rejecting", !accepted)
      .transition ()
      .delay (gTestMenu.DISPLAY_TIME)
      .duration (gTestMenu.FADE_OUT_TIME)
      .ease ("cubic")
      .style ("opacity", 0)
      .remove ();
    gTape.done = true;
  }
};

gTape.draw = function () {
  var circle = d3.select (".tape").select ("circle");
  if (gTape.follow) {
    circle.transition ()
      .duration (circle.style ("opacity") == 1 ? 100 : 0)
      .attr ("cx", gTape.follow.x)
      .attr ("cy", gTape.follow.y)
      .style ("opacity", 1);
      
    d3.select (".stepButton").text ("Step").node ().disabled = false;
    if (typeof gTape.current == "undefined" || (gTape.index == gTape.input.length && !gTape.current.accept)) {
      circle.style ("stroke", "red");
      d3.select (".stepButton").text ("Completed").node ().disabled = true;
      gTape.drawResult (false);
    }
    else if (gTape.index == gTape.input.length) {
      circle.style ("stroke", "green");
      d3.select (".stepButton").text ("Completed").node ().disabled = true;
      gTape.drawResult (true);
    }
  } else {
    circle.style ("opacity", 0);
  }
  if (gTape.running && gTape.index <= gTape.input.length) {
    d3.selectAll (".tape-char")
      .classed ("current-tape-char", function (junk, i) {
        if (!d3.select (this).classed ("current-tape-char") && gTape.index == i) {
          this.focus ();
          this.blur ();
        }
        return gTape.index == i;
      });
    
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

gTape.step = function () {
  if (!gTape.running) {
    gTape.run ();
    return;
  }
  if (typeof gTape.current != "undefined" && gTape.index != gTape.input.length) {
    var next = gDFASimulator.step (gGraph.save (), gTape.current.id,  gTape.input,  gTape.index++);
    gTape.current = gNodes.nodes[gNodes.getNodeIndex (next)];
    if (typeof gTape.current != "undefined") {
      gTape.follow = gTape.current;
    }
  }
  gTape.draw ();
};