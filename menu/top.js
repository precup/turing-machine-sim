var gTopMenu =
  {
    MAX_DISPLAYED_STATES: 5,
    SELECTED_TEXT: "Selected states: "
  };

gTopMenu.addNode = function () {
  gNodes.addNode ();
  gGraph.draw ();
};

gTopMenu.setState = function (accepting, rejecting) {
  if (gNodes.selectionIsEmpty ()) {
    gErrorMenu.displayError ("No states are selected");
  }
  gNodes.setAccepting (accepting);
  gNodes.setRejecting (rejecting);
  gGraph.draw ();
};

gTopMenu.deleteSelected = function () {
  if (gNodes.selectionIsEmpty () && gEdges.selectionIsEmpty ()) {
    gErrorMenu.displayError ("No states or transitions are selected");
  }
  if (gNodes.removeNodes ()) {
    gEdges.deleteSelected ();
    gGraph.draw ();
  }
};

// gTopMenu.openLoadDialog = function () {
//   if (window.File) {
//     document.getElementById ("fileInput").click ();
//   } else {
//     alert ("Error: your browser doesn't support the File API.");
//   }
// };

gTopMenu.setInitial = function () {
  if (gNodes.selectionIsEmpty ()) {
    gErrorMenu.displayError ("No states are selected");
  } else if (gNodes.selectionSize () > 1) {
    gErrorMenu.displayError ("Multiple states are selected. Using the first one.");
  }
  gNodes.setInitial ();
  gGraph.draw ();
};

gTopMenu.snapToGrid = function () {
  gNodes.snapToGrid ();
  gGraph.draw ();
};

gTopMenu.forcedDirectedLayout = function () {
  gNodes.forcedDirectedLayout ();
  gGraph.draw ();
};

gTopMenu.loadFromServer = function () {
  gModalMenu.open ("load");
  gModalMenu.load.onOpen ();
};

gTopMenu.save = function () {
  var BUTTON_TIMEOUT = 2000;
  var name = gServer.name;
  gTopMenu.setSaveButton ("Saving...");
  if (!gModalMenu.saveas.isInvalidName (name) && name) {
    // save
    gServer.save (name,
      function (err, data) {
        if (err) {
          gTopMenu.setSaveButton ("Failed");
          gErrorMenu.displayError ("Save failed: couldn't connect to server.");
        } else {
          gTopMenu.setSaveButton ("Saved!");
        }
        setTimeout (function () {
          gTopMenu.setSaveButton ("Save");
        }, BUTTON_TIMEOUT);
      });
  } else if (!name) {
    // name is null, hasn't been saved
    gTopMenu.saveas ();
    gTopMenu.setSaveButton ("Save");
  } else {
    // show error message
    gErrorMenu.displayError ("Saving to invalid name, use \"Save As\" to change name");
    gTopMenu.setSaveButton ("Save");
  }
};

gTopMenu.saveas = function () {
  gModalMenu.saveas.open ();
};

gTopMenu.submit = function () {
  if (gGraph.pset != null) {
    gModalMenu.submitModal.setPsetNumber (gGraph.pset);
  }
  if (gGraph.problem != null) {
    gModalMenu.submitModal.setProblemNumber (gGraph.problem);
  }
  gModalMenu.open ("submit");
};

gTopMenu.homepage = function () {
  window.location.href = getURLParent () + "index.html";
};

gTopMenu.draw = function () {
  var selectedText = "";
  var selected = gNodes.getSelected ();
  selected.sort ();
  for (var i = 0; i < gTopMenu.MAX_DISPLAYED_STATES && i < selected.length; i++) {
    selectedText += selected[i] + ", ";
  }

  if (selected.length == 0) {
    selectedText = "None";
  } else {
    selectedText = selectedText.substring (0, selectedText.length - 2);
  }

  if (selected.length > gTopMenu.MAX_DISPLAYED_STATES) {
    selectedText += "...";
  }
  var mode = gGraph.mode.toUpperCase ();
  if (mode == "TM") {
    mode = "Turing Machine";
  }
  var pset = gGraph.pset == null ? "" : psets[gGraph.pset].name + ", ";
  var problem = (gGraph.problem == null && gGraph.pset == null) ? "" : psets[gGraph.pset].problems[gGraph.problem].name + ", ";
  d3.select (".current-pset-problem")
    .text (pset + problem);
  d3.select (".current-mode").text (mode);
  d3.select (".current-alphabet").text (gGraph.charSet);
  if (gGraph.mode === "tm" && gGraph.tapeSet && 
    sortString (gGraph.tapeSet) !== sortString (gGraph.charSet)) 
  {
    d3.select (".current-tape-set")
      .style ("display", "inline");
    d3.select (".current-tape-set-inner").text (gGraph.tapeSet);
  }

  d3.select ("#selectedText").text (gTopMenu.SELECTED_TEXT + selectedText);

  d3.select(".acceptButton").classed("marked", gNodes.selectionIsAccepting ());
  d3.select(".rejectButton").classed("marked", gNodes.selectionIsRejecting ());
  d3.selectAll(".neitherButton").classed("marked", gNodes.selectionIsNeither ());
};

gTopMenu.setSaveButton = function (text) {
  d3.select (".saveTopButton").text (text);
};