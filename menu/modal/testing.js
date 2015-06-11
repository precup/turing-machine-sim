/*
FILE: menu/modall/testing.js

Handles the bulk testing modal.
*/

/* Focuses on the row "index".
@param (index : integer) the index of the row that should be set to focused
No return value. */
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

/* Builds one new testing row. 
@param (focus : boolean) True if the newly built row should be focused. False otherwise.
No return value.
*/
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

/* Event handler for when the bulk testing modal is first opened.
Builds one testing row.
No return value.
*/
gModalMenu.initBulk = function () {
  gModalMenu.buildRow (false);
  d3.select (".modal-content").attr ("max-height", gGraph.height * gModalMenu.MAX_HEIGHT_PERCENT);
};

/* Unchecks the reject radio button with "index" index.
@param (index : number)
No return value. */
gModalMenu.clearReject = function (index) {
  d3.selectAll (".bulkReject").each (function (junk, i) {
    if (i == index) {
      this.checked = false;
    }
  });
};

/* Unchecks the accept radio button for the row with "index" index.
@param (index : number)
No return value. */
gModalMenu.clearAccept = function (index) {
  d3.selectAll (".bulkAccept").each (function (junk, i) {
    if (i == index) {
      this.checked = false;
    }
  });
};