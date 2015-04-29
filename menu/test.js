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
   
  d3.selectAll (".tape-char")
    .style ("display", "inline")
    .each (function (junk, i) {
      this.value = i < gTestMenu.text.length ? gTestMenu.text[i] : "";
    });
    
  d3.select (".tape-char-input")
    .style ("display", "none");
};

gTestMenu.runTests = function () {
  gModalMenu.open ("testing");
};

gTestMenu.run = function () {
  gTape.show ();
  gTape.run ();
};

gTestMenu.end = function () {
  gTape.hide ();
};

gTestMenu.step = function () {
  gTape.step ();
};