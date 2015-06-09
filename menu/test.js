var gTestMenu =
  {
    NUM_CELLS: 250,
    DISPLAY_TIME: 4600,
    FADE_OUT_TIME: 400
  };

gTestMenu.init = function () {
  gTestMenu.reset ();
  gTestMenu.text = "";
  gTestMenu.backupText = "";
  var tape = d3.select (".tape-field");
  gTestMenu.showPlaceholder = true;
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
  gTestMenu.setRunning (false);
  d3.select (".tape-char-input").node ().value = gTestMenu.backupText || "";
  d3.selectAll (".current-tape-char")
    .classed ("current-tape-char", false);
  d3.selectAll (".current-tape-char-solid")
    .classed ("current-tape-char-solid", false);
  gTestMenu.disallowInput ();
  gTape.reset ();
};

gTestMenu.allowInput = function () {
  gTestMenu.showPlaceholder = false;
  gTestMenu.reset ();
  d3.select (".tape-char-input").node ().value = gTestMenu.backupText;

  d3.selectAll (".tape-char")
    .style ("display", "none");

  d3.select (".tape-char-input")
    .style ("display", "inline")
    .each (function () { this.focus (); });
};

gTestMenu.disallowInput = function (text) {
  if (gTestMenu.backupText != intersection (d3.select (".tape-char-input").node ().value, gGraph.charSet)) {
     gTestMenu.backupText = d3.select (".tape-char-input").node ().value;
     var legal = intersection (gTestMenu.backupText, gGraph.charSet)
    if (gTestMenu.backupText.length != legal.length) {
      gErrorMenu.displayError ("Removing characters that aren't in the alphabet.");
    }
    gTestMenu.backupText = legal;
  }
  gTestMenu.text = text == undefined ? gTestMenu.backupText : text;
  
  var displayString = "Click to enter a test";
  d3.selectAll (".tape-char")
    .style ("display", "inline")
    .style ("color", gTestMenu.showPlaceholder ? "#bbb" : "#fff")
    .each (function (junk, i) {
      var text = gTestMenu.showPlaceholder ? displayString : gTestMenu.text;
      this.value = i < text.length ? text[i] : "";
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
    gErrorMenu.displayError ("This automaton doesn't have a start state.");
  } else if (unset.length != 0) {
    gErrorMenu.displayError ("The following states have undefined transitions: " + unset.join (", "));
  } else {
    gModalMenu.open ("testing");
  }
};

gTestMenu.setRunning = function (running) {
  if (running) {
    d3.selectAll (".running")
      .style ("display", "inline");
    d3.select (".runButton").text ("Restart");
  } else {
    d3.selectAll (".running")
      .style ("display", "none");
    d3.select (".runButton").text ("Start");
  }
};

gTestMenu.run = function () {
  var unset = gTestMenu.unsetTransitions ();
  if (gNodes.initial == null) {
    gErrorMenu.displayError ("This automaton doesn't have a start state.");
  } else if (unset.length != 0) {
    gErrorMenu.displayError ("The following states have undefined transitions: " + unset.join (", "));
  } else {
    gTestMenu.showPlaceholder = false;
    gTestMenu.reset ();
    gTestMenu.setRunning (true);
    gTape.show ();
    gTape.run ();
  }
};

gTestMenu.end = function () {
  gTestMenu.setRunning (false);
  d3.selectAll (".current-tape-char")
    .classed ("current-tape-char", false);
  d3.selectAll (".current-tape-char-solid")
    .classed ("current-tape-char-solid", false);
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

gTestMenu.animate = function () {
  gTestMenu.run ();
  gTestMenu.setRunning (false);
};
