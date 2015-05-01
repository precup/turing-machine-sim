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

gTestMenu.runTests = function () {
  if (gNodes.initial == null) {
    gErrorMenu.displayError ("No initial node is set");
  } else {
    gModalMenu.open ("testing");
  }
};

gTestMenu.run = function () {
  if (gNodes.initial == null) {
    gErrorMenu.displayError ("No initial node is set");
  } else {
    gTape.show ();
    gTape.run ();
  }
};

gTestMenu.end = function () {
  gTape.hide ();
};

gTestMenu.step = function () {
  if (gNodes.initial == null) {
    gErrorMenu.displayError ("No initial node is set");
  } else {
    gTape.show ();
    gTape.step ();
  }
};