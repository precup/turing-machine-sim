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
  gTestMenu.disallowInput ();
  gTape.reset ();
};

gTestMenu.allowInput = function () {
  gTestMenu.reset ();
  d3.select (".tape-char-input").node ().value = gTestMenu.backupText;

  d3.selectAll (".tape-char")
    .style ("display", "none");

  d3.select (".tape-char-input")
    .style ("display", "inline")
    .each (function () { this.focus (); });
};

gTestMenu.disallowInput = function (text) {
  gTestMenu.backupText = d3.select (".tape-char-input").node ().value;
  gTestMenu.text = text == undefined ? d3.select (".tape-char-input").node ().value : text;
  var legal = intersection (gTestMenu.text, gGraph.charSet);
  if (gTestMenu.text.length != legal.length) {
    gTestMenu.text = legal;
    gErrorMenu.displayError ("Removing characters that aren't in the alphabet.");
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
  gTestMenu.reset ();
  var unset = gTestMenu.unsetTransitions ();
  if (gNodes.initial == null) {
    gErrorMenu.displayError ("This automaton doesn't have a start state.");
  } else if (unset.length != 0) {
    gErrorMenu.displayError ("The following states have undefined transitions: " + unset.join (", "));
  } else {
    gTestMenu.setRunning (true);
    gTape.show ();
    gTape.run ();
  }
};

gTestMenu.end = function () {
  gTestMenu.setRunning (false);
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
