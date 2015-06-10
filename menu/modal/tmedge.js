/*
FILE: menu/modal/tmedge.js

Manages logic for the TM edges modal.

-- Elements
For each row:
  Character from, character to write, direction to move 
  the tape head, and a delete button
Add characters button, which adds a new row to the editor.
Delete edges button
Cancel editing button
Update editing button

-- Events
Delete row
Delete edge
Cancel editing
Update editing

*/

/* Constants go here */
gModalMenu.tmEdge = {};

/* Focuses on the index of the row to focus on.
@param (index : number)
No return value. */
gModalMenu.tmEdge.focusTmRow = function (index) {
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
    gModalMenu.tmEdge.buildTmRow (true);
  }
};

/* Set the edge state by pushing a new set of transitions.
@param (states : array of objects of {direction, to, from})
No return value. */
gModalMenu.tmEdge.setTmEdgeStates = function (states) {
  if (states.length == 0) {
    states.push ({
        direction: 1,
        to: "",
        from: ""
      });
  }
  
  var newRows = states.length - d3.selectAll (".tmEdge > tr").size ();
  for (var i = 0; i < newRows; i++) {
    gModalMenu.tmEdge.buildTmRow (false);
  }
  
  var rows = d3.select (".tmEdge")
    .selectAll ("tr")
    .filter (function (junk, i) {
      return i != 0;
    })
    .data (states);
    
  rows.select ("td > .edgeLeft")
    .each (function (state) {
      this.checked = state.direction == -1;
    });
  rows.select ("td > .edgeRight")
    .each (function (state) {
      this.checked = state.direction == 1;
    });
  rows.selectAll ("td > .tmEdgeChars")
    .each (function (junk, i2, i1) {
      this.value = i2 == 1 ? states[i1].to : states[i1].from;
    });
    
  rows.exit ().remove ();
};

/* Returns an array of states: [{direction: <number>, from: <string>, to: <string of length 1>}].
No return value. */
gModalMenu.tmEdge.getTmEdgeStates = function () {
  var states = [];
  d3.select (".tmEdge")
    .selectAll ("tr")
    .filter (function (junk, i) {
      return i != 0;
    })
    .each (function () {
      var state = {};
      var row = d3.select (this);
      state.direction = row.select ("td > .edgeLeft").node ().checked ? -1 : 1;
      state.from = row.selectAll ("td > .tmEdgeChars")[0][0].value;
      state.to = row.selectAll ("td > .tmEdgeChars")[0][1].value;
      states.push (state);
    });
  return states;
};

/* Adds a new row for adding a character.
@param (focus : boolean) focuses on the new row if true.
No return value.
*/
gModalMenu.tmEdge.buildTmRow = function (focus) {
  var row = d3.select (".tmEdge").append ("tr");
  
  // Add Character field
  row.append ("td")
    .append ("input")
    .attr ("type", "text")
    .attr ("size", 2)
    .attr ("maxlength", 1)
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
    .attr ("maxlength", 1)
    .classed ("tmEdgeChars", true);
    
  // Add radio col
  var radioTd = row.append ("td");
    
  radioTd.append ("input")
    .attr ("type", "radio")
    .classed ("edgeLeft", true);
  radioTd.append ("label")
    .text (" L ");
  radioTd.append ("input")
    .attr ("type", "radio")
    .attr ("checked", true)
    .classed ("edgeRight", true);
  radioTd.append ("label")
    .text (" R ");
    
  // Add delete col
  row.append ("td")
    .append ("button")
    .classed ("button-delete", true)
    .text ("X");
    
  gModalMenu.tmEdge.updateTmDeleteButtons ();
    
  d3.selectAll (".edgeLeft")
    .on ("change", function (junk, i) {
      gModalMenu.tmEdge.clearRight(i);
    });
  d3.selectAll (".edgeRight")
    .on ("change", function (junk, i) {
      gModalMenu.tmEdge.clearLeft(i);
    });
  d3.selectAll (".tmEdgeChars")  
    .on ("keydown", function (junk, i) {
      if (d3.event.keyCode == 13 || d3.event.keyCode == 40) {
        gModalMenu.tmEdge.focusTmRow (i + 1);
      } else if (d3.event.keyCode == 38) {
        gModalMenu.tmEdge.focusTmRow (i - 1);
      }
    })
};

/* Adds a click event handler to all of the delete buttons. The
event handler will remove the row if the button is clicked.
No return value.
*/
gModalMenu.tmEdge.updateTmDeleteButtons = function () {
  d3.selectAll (".button-delete")
    .on ("click", function (junk, i) {
      d3.select (".tmEdge")
        .selectAll ("tr")
        .filter (function (junk2, i2) {
          return i == i2;
        })
        .remove ();
        gModalMenu.tmEdge.updateTmDeleteButtons ();
    });
};

/* Initialize the modal edge editor by sizing the modal correctly.
No return value.
*/
gModalMenu.tmEdge.initTmEdit = function () {
  d3.select (".modal-content").attr ("max-height", gGraph.height * gModalMenu.MAX_HEIGHT_PERCENT);
};

/* Clears the "Tape Head" left radio button of the row at "index".
@param (index : number) The index of the row to clear the left radio button
No return value.
*/
gModalMenu.tmEdge.clearLeft = function (index) {
  d3.selectAll (".edgeLeft").each (function (junk, i) {
    if (i == index) {
      this.checked = false;
    }
  });
};

/* Clears the "Tape Head" right radio button of the row at "index".
@param (index : number) The index of the row to clear the radio radio button
No return value.
*/
gModalMenu.tmEdge.clearRight = function (index) {
  d3.selectAll (".edgeRight").each (function (junk, i) {
    if (i == index) {
      this.checked = false;
    }
  });
};