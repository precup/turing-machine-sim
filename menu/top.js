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
    setTimeout (function () {
      gErrorMenu.clearModalErrors ();
    }, 3000);
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
  gModalMenu.setSaveName (gServer.name);
  gModalMenu.open ("save");
};

gTopMenu.submit = function () {
  if (gGraph.pset != null) {
    gModalMenu.setPsetNumber (gGraph.pset);
  }
  if (gGraph.problem != null) {
    gModalMenu.setProblemNumber (gGraph.problem);
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

  d3.select (".current-mode").text (gGraph.mode == gGraph.DFA ? "DFA" : "NFA");
  d3.select (".current-alphabet").text (gGraph.charSet);

  d3.select ("#selectedText").text (gTopMenu.SELECTED_TEXT + selectedText);

  d3.select(".acceptButton").classed("marked", gNodes.selectionIsAccepting ());
  d3.select(".rejectButton").classed("marked", gNodes.selectionIsRejecting ());
  d3.select(".neitherButton").classed("marked", gNodes.selectionIsNeither ());
};
