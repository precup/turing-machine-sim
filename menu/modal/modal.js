var gModalMenu =
  {
    MAX_HEIGHT_PERCENT: 0.62
  };

gModalMenu.open = function (type) {
  gModalMenu.currentType = type;
  d3.select ("." + type).style ('display', 'inline');
  d3.select ('.overlay').style ('display', 'inline');
};

gModalMenu.close = function (type) {
  gErrorMenu.clearModalErrors ();
  d3.select ("." + type).style ('display', 'none');
  d3.select ('.overlay').style ('display', 'none');
};

gModalMenu.closeCurrent = function () {
  gModalMenu.cancel (gModalMenu.currentType);
};

gModalMenu.submitOnEnter = function (type) {
  if (event.keyCode == 13) {
    gModalMenu.submit (type);
  }
};

gModalMenu.submit = function (type) {
  switch (type) {
    case "tmEdgeEntry":
      gEdges.tmEditComplete ();
      break;
    case "edgeEntry":
      gEdges.editComplete ();
      break;
    case "nodeEntry":
      gNodes.editComplete ();
      break;
    case "testing":
      gSimulator.runTests ();
      break;
    case "saveas":
      gModalMenu.saveas.clickSaveBtn ();
      break;
    case "load":
      gModalMenu.load.onClickLoadBtn ();
      break;
    case "submit":
      gModalMenu.submitModal.clickSubmitBtn ();
      break;
    case "confirm":
      gModalMenu.confirm.clickConfirmBtn ();
      break;
    default:
      break;
  }
};

gModalMenu.cancel = function (type) {
  switch (type) {
    case "edgeEntry":
      gEdges.editCancelled ();
      break;
    case "confirm":
      gModalMenu.confirm.clickCancelBtn ();
      break;
    case "saveas": 
    default:
      gModalMenu.close (type);
      break;
  }
};

gModalMenu.getEpsilon = function () {
  return gGraph.mode == gGraph.NFA && d3.select(".epsilon").node().checked;
};

gModalMenu.setEpsilon = function (included) {
  d3.select(".epsilon").node().checked = included;
};

gModalMenu.addAllEdgeChars = function () {
  gModalMenu.setEdgeChars (gGraph.charSet);
  gModalMenu.setEpsilon (true);
};

gModalMenu.invertEdgeChars = function () {
  var chars = gGraph.charSet;
  var badChars = gModalMenu.getEdgeCharacters ();
  for (var badChar in badChars) {
    chars = chars.replace (badChars[badChar], "");
  }
  gModalMenu.setEdgeChars (chars);
  gModalMenu.setEpsilon (!gModalMenu.getEpsilon ());
};

gModalMenu.addRemainingEdgeChars = function () {
  var missing = [];
  var graph = gGraph.save ();
  var table = gSimulator.convert (graph);
  for (var character in table[gEdges.editedEdge.source.id]) {
    if (table[gEdges.editedEdge.source.id][character].length == 0) {
      missing.push (character);
    }
  }
  gModalMenu.setEdgeChars (gModalMenu.getEdgeCharacters () + missing.join (""));
};

gModalMenu.setEdgeChars = function (chars) {
  d3.select(".edgeChars").node().value = chars;
};

gModalMenu.getEdgeCharacters = function () {
  return d3.select(".edgeChars").node().value;
};

gModalMenu.deleteEdge = function () {
  gEdges.removeEdge (gEdges.editedEdge.source, gEdges.editedEdge.target);
  gGraph.draw ();
  gModalMenu.close ("edgeEntry");
};

gModalMenu.getNodeName = function () {
  return d3.select (".nodeName").node ().value;
};

gModalMenu.setNodeName = function (name) {
  d3.select (".nodeName").node ().value = name;
};

gModalMenu.setInitial = function (initial) {
  d3.select (".nodeInitialCheckbox").node ().checked = initial;
};

gModalMenu.getInitial = function () {
  return d3.select (".nodeInitialCheckbox").node ().checked;
};

gModalMenu.setState = function (accept, reject) {
  d3.select (".modalAcceptButton").classed ("marked", accept);
  d3.select (".modalNeitherButton").classed ("marked", !accept);
};

gModalMenu.getAccepting = function () {
  return d3.select (".modalAcceptButton").classed ("marked");
};

gModalMenu.getRejecting = function () {
  return d3.select (".modalNeitherButton").classed ("marked");
};

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