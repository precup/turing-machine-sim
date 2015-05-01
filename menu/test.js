var gTestMenu = 
  {
    NUM_CELLS: 250
  };
  
gTestMenu.init = function () {
  gTestMenu.text = "";
  var tape = d3.select (".tape-field");
  for (var i = 0; i < gTestMenu.NUM_CELLS; i++) {
    tape.append ("input")
      .attr ("type", "text")
      .classed ("tape-char", true)
      .attr ("name", "tapeChar[]")
      .attr ("maxlength", 1)
      .attr ("readonly", "readonly")
      .on ("click", gTestMenu.allowInput);
  }
  d3.select (".tape-char-input")
    .attr ("maxlength", gTestMenu.NUM_CELLS)
    .on ("keydown", function () {
      if (d3.event.keyCode == 13) {
        gTestMenu.disallowInput ();
        gTestMenu.run ();
      }
    });
    
  gTestMenu.disallowInput ();
};

gTestMenu.reset = function () {
  d3.select (".tape-char-input").node ().value = "";
  d3.selectAll (".current-tape-char")
    .classed ("current-tape-char", false);
  gTestMenu.disallowInput ();
};

gTestMenu.allowInput = function () {
  d3.select (".tape-char-input").node ().value = gTestMenu.text;

  d3.selectAll (".tape-char")
    .style ("display", "none");

  d3.select (".tape-char-input")
    .style ("display", "inline")
    .each (function () { this.focus (); });
};

gTestMenu.disallowInput = function () {
  gTestMenu.text = d3.select (".tape-char-input").node ().value;
  var legal = intersection (gTestMenu.text, gGraph.charSet);
  if (gTestMenu.text.length != legal.length) {
    gTestMenu.text = legal;
    gErrorMenu.displayError ("Removing illegal characters in the input");
  }
   
  d3.selectAll (".tape-char")
    .style ("display", "inline")
    .each (function (junk, i) {
      this.value = i < gTestMenu.text.length ? gTestMenu.text[i] : "";
    });
    
  d3.select (".tape-char-input")
    .style ("display", "none");
};

gTestMenu.unsetTransitions = function () {
  var missing = [];
  if (gGraph.mode == gGraph.DFA) {
    var graph = gGraph.save ();
    var table = gSimulator.convert (graph);
    for (var nodeId in table) {
      var hasMissing = false;
      for (var character in table[nodeId]) {
        hasMissing |= table[nodeId][character].length == 0;
      }
      if (hasMissing) {
        missing.push (gNodes.nodes[gNodes.getNodeIndex (nodeId)].name);
      }
    }
  }
  return missing;
};

gTestMenu.runTests = function () {
  var unset = gTestMenu.unsetTransitions ();
  if (gNodes.initial == null) {
    gErrorMenu.displayError ("No initial node is set");
  } else if (unset.length != 0) {
    gErrorMenu.displayError ("The following nodes have undefined transitions: " + unset.join (", "));
  } else {
    gModalMenu.open ("testing");
  }
};

gTestMenu.run = function () {
  var unset = gTestMenu.unsetTransitions ();
  if (gNodes.initial == null) {
    gErrorMenu.displayError ("No initial node is set");
  } else if (unset.length != 0) {
    gErrorMenu.displayError ("The following nodes have undefined transitions: " + unset.join (", "));
  } else {
    gTape.show ();
    gTape.run ();
  }
};

gTestMenu.end = function () {
  d3.selectAll (".current-tape-char")
    .classed ("current-tape-char", false);
  gTestMenu.disallowInput ();
  gTape.hide ();
};

gTestMenu.step = function () {
  var unset = gTestMenu.unsetTransitions ();
  if (gNodes.initial == null) {
    gErrorMenu.displayError ("No initial node is set");
  } else if (unset.length != 0) {
    gErrorMenu.displayError ("The following nodes have undefined transitions: " + unset.join (", "));
  } else {
    gTape.show ();
    gTape.step ();
  }
};