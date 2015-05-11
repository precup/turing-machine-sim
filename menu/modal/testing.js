gModalMenu.focusRow = function (index) {
  index = Math.max (index, 0);
  var focused = false;
  d3.selectAll (".bulkInput")
    .each (function (junk, i) {
      if (i == index) {
        this.focus ();
        focused = true;
      }
    });
  if (!focused) {
    gModalMenu.buildRow (true);
  }
};

gModalMenu.buildRow = function (focus) {
  var row = d3.select (".testingHeader").append ("tr");
  row.append ("td")
    .append ("input")
    .attr ("type", "text")
    .classed ("bulkInput", true)
    .each (function () {
      if (focus) {
        this.focus ();
      }
    });
    
  row.append ("td")
    .append ("input")
    .attr ("type", "radio")
    .classed ("bulkAccept", true);
  row.append ("td")
    .append ("input")
    .attr ("type", "radio")
    .classed ("bulkReject", true);
  d3.selectAll (".bulkAccept")
    .on ("change", function (junk, i) {
      gModalMenu.clearReject(i);
    });
  d3.selectAll (".bulkReject")
    .on ("change", function (junk, i) {
      gModalMenu.clearAccept(i);
    });
  d3.selectAll (".bulkInput")  
    .on ("keydown", function (junk, i) {
      if (d3.event.keyCode == 13 || d3.event.keyCode == 40) {
        gModalMenu.focusRow (i + 1);
      } else if (d3.event.keyCode == 38) {
        gModalMenu.focusRow (i - 1);
      }
    })
};

gModalMenu.initBulk = function () {
  gModalMenu.buildRow (false);
  d3.select (".modal-content").attr ("max-height", gGraph.height * gModalMenu.MAX_HEIGHT_PERCENT);
};

gModalMenu.clearReject = function (index) {
  d3.selectAll (".bulkReject").each (function (junk, i) {
    if (i == index) {
      this.checked = false;
    }
  });
};

gModalMenu.clearAccept = function (index) {
  d3.selectAll (".bulkAccept").each (function (junk, i) {
    if (i == index) {
      this.checked = false;
    }
  });
};