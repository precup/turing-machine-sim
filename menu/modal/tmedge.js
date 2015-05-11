gModalMenu.focusTmRow = function (index) {
  index = Math.max (index, 0);
  var focused = false;
  d3.selectAll (".tmEdgeInput")
    .each (function (junk, i) {
      if (i == index) {
        this.focus ();
        focused = true;
      }
    });
  if (!focused) {
    gModalMenu.buildTmRow (true);
  }
};

gModalMenu.buildTmRow = function (focus) {
  var row = d3.select (".tmEdge").append ("tr");
  
  // Add Character field
  row.append ("td")
    .append ("input")
    .attr ("type", "text")
    .attr ("size", 2)
    .classed ("tmEdgeChars", true)
    .each (function () {
      if (focus) {
        this.focus ();
      }
    });
    
  // Add Write field
  row.append ("td")
    .append ("input")
    .attr ("type", "text")
    .attr ("size", 2)
    .classed ("tmEdgeChars", true);
    
  // Add radio col
  var radioTd = row.append ("td");
    
  radioTd.append ("input")
    .attr ("type", "radio")
    .classed ("edgeLeft", true)
    .text (" L ");
  radioTd.append ("input")
    .attr ("type", "radio")
    .classed ("edgeRight", true)
    .text (" R ");
    
  // Add delete col
  row.append ("td")
    .append ("button")
    .classed ("button-delete", true)
    .text ("X");
    
  d3.selectAll (".edgeLeft")
    .on ("change", function (junk, i) {
      gModalMenu.clearRight(i);
    });
  d3.selectAll (".edgeRight")
    .on ("change", function (junk, i) {
      gModalMenu.clearLeft(i);
    });
  d3.selectAll (".tmEdgeChars")  
    .on ("keydown", function (junk, i) {
      if (d3.event.keyCode == 13 || d3.event.keyCode == 40) {
        gModalMenu.focusTmRow (i + 1);
      } else if (d3.event.keyCode == 38) {
        gModalMenu.focusTmRow (i - 1);
      }
    })
};

gModalMenu.initTmEdit = function () {
  gModalMenu.buildTmRow (false);
  gModalMenu.buildTmRow (false);
  d3.select (".modal-content").attr ("max-height", gGraph.height * gModalMenu.MAX_HEIGHT_PERCENT);
};

gModalMenu.clearLeft = function (index) {
  d3.selectAll (".edgeLeft").each (function (junk, i) {
    if (i == index) {
      this.checked = false;
    }
  });
};

gModalMenu.clearRight = function (index) {
  d3.selectAll (".edgeRight").each (function (junk, i) {
    if (i == index) {
      this.checked = false;
    }
  });
};