var gModalMenu =
  {
    confirmFlag: "",
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
    case "edgeEntry":
      gEdges.editComplete ();
      break;
    case "nodeEntry":
      gNodes.editComplete ();
      break;
    case "testing":
      gSimulator.runTests ();
      break;
    case "save":
      gModalMenu.initSave ();
      break;
    case "load":
      gModalMenu.load.onClickLoadBtn ();
      break;
    case "submit":
      gModalMenu.initSubmitToServer ();
      break;
    case "confirm":
      gModalMenu.confirm ();
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
      gModalMenu.confirmCancelled ();
      break;
    default:
      gModalMenu.close (type);
      break;
  }
};

gModalMenu.confirm = function () {
  if (gModalMenu.confirmFlag === "submit") {
    gModalMenu.close ("confirm");
    gModalMenu.open ("submit");
    gModalMenu.submitToServer (function () {
      gModalMenu.close ("submit");
    });
  } else if (gModalMenu.confirmFlag === "save") {
    gModalMenu.close ("confirm");
    gModalMenu.open ("save");
    gModalMenu.save (function () {
      gModalMenu.close ("save");
    })
  }
};

gModalMenu.confirmCancelled = function () {
  if (gModalMenu.confirmFlag === "submit") {
    gModalMenu.close ("confirm");
    gModalMenu.close ("submit");
    gModalMenu.setSubmitButton ("Submit");
  } else if (gModalMenu.confirmFlag === "save") {
    gModalMenu.close ("save");
    gModalMenu.close ("confirm");
    gModalMenu.setSaveButton ("Save");
  }
};

gModalMenu.submitToServer = function (done) {
  var automata = JSON.stringify (gGraph.save ());
  var pset = gModalMenu.getPsetNumber();
  var problem = gModalMenu.getProblemNumber();
  
  if (psets[pset].problems[problem].type != gGraph.mode && gGraph.mode == "nfa") {
    gErrorMenu.displayError ("This automaton is an NFA, but the problem requires a DFA.");
    return;
  }
  if (psets[pset].problems[problem].type != gGraph.mode && gGraph.mode == "dfa") {
    gErrorMenu.displayError ("This automaton is a DFA, but the problem requires an NFA.");
    return;
  }
  if (psets[pset].problems[problem].charSet != gGraph.charSet) {
    gErrorMenu.displayError ("The alphabet for this automaton doesn't match the alphabet for that problem.");
    return;
  }
  
  gServer.submit (automata, pset, problem,
    function (err) {
      if (err) {
        gErrorMenu.displayModalError ("submit", "Failed to submit");
        setTimeout (function () {
          gErrorMenu.clearModalErrors ();
        }, 3000);
        gModalMenu.setSubmitButton ("Submit");
        return;
      } else {
        gModalMenu.setSubmitButton ("Success!");
      }
      setTimeout(function () {
        gModalMenu.setSubmitButton ("Submit");
        done ();
      }, 1000);
    }
  );
};

gModalMenu.initSubmitToServer = function () {
  gModalMenu.confirmFlag = "submit";

  var automata = JSON.stringify (gGraph.save ());
  var pset = gModalMenu.getPsetNumber();
  var problem = gModalMenu.getProblemNumber();

  gModalMenu.setSubmitButton ("Submitting...");

  function isPreviouslySaved (list, pset, problem) {
    var isPreviouslySaved = false;
    return list.some (function (elem, index, arr) {
      var cur_pset_id = parseInt (elem["pset_id"]);
      var cur_problem_id = parseInt (elem["problem_id"]);
      return cur_pset_id === pset &&
        cur_problem_id === problem;
    });
  }

  gServer.listSubmissions (function (data, err) {
    if (err) {
      gErrorMenu.displayModalError ("submit", "Failed to submit");
      gModalMenu.setSubmitButton ("Submit");
      setTimeout (function () {
        gErrorMenu.clearModalErrors ();
      }, 3000);
      return;
    }
    if (isPreviouslySaved (data, pset, problem)) {
      gModalMenu.close ("submit");
      gModalMenu.open ("confirm");
    } else {
      gModalMenu.submitToServer (function () {
        gModalMenu.close ("submit");
      });
    }
  });
};

gModalMenu.initSave = function () {
  gModalMenu.confirmFlag = "save";

  var name = encodeURIComponent(gModalMenu.getSaveName ());
  gServer.listSaved (function (err, data) {
    function isPreviouslySaved (list, name) {
      var isPreviouslySaved = false;
      return list.some (function (elem, index, arr) {
        return elem["name"] === name;
      });
    }
    if (err) {
      gErrorMenu.displayModalError ("save", "Save failed");
      setTimeout (function () {
        gErrorMenu.clearModalErrors ();
        gModalMenu.setSubmitButton ("Submit");
      }, 3000);
      return;
    }

    if (isPreviouslySaved (data, name)) {
      gModalMenu.close ("save");
      gModalMenu.open ("confirm");
    } else {
      gModalMenu.save (function () {
        gModalMenu.close ("save");
      });
    }
  })
};

// done () - not used right now
gModalMenu.save = function (done) {
  var name = gModalMenu.getSaveName ();
  gModalMenu.setSaveButton ("Saving...");
  gServer.save (name, function (err, data) {
    if (err) {
      gErrorMenu.displayModalError ("save", "Failed to save");
      setTimeout (function () {
        gErrorMenu.clearModalErrors ();
      }, 3000);
      gModalMenu.setSaveButton ("Save");
      return;
    } else {
      gModalMenu.setSaveButton ("Saved!");
    }
    window.setTimeout(function () {
      gModalMenu.setSaveButton ("Save"); // return to original
      gModalMenu.close("save");
    }, 1000);
  });
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

gModalMenu.getSaveName = function () {
  return d3.select (".saveText").node ().value;
};

gModalMenu.setSaveName = function (name) {
  d3.select (".saveText").node ().value = decodeURIComponent (name);
};

gModalMenu.setSaveButton = function (text) {
  d3.select (".saveButton").text (text);
};


gModalMenu.initSubmit = function () {
  var psetSelect = d3.select (".pset").selectAll ("option").data (psets);
  psetSelect.enter ()
    .append ("option")
    .attr ("value", function (pset, i) { return i; })
    .text (function (pset, i) { return pset.name; });
  d3.select ('.pset').node ().selectedIndex = 0;
  gModalMenu.changeNumbers ();
};

gModalMenu.changeNumbers = function () {
  var psetNum = d3.select ('.pset').node ().selectedIndex;
  var problemSelect = d3.select (".problem").selectAll ("option").data (psets[psetNum].problems);
  problemSelect.enter ().append ("option");
    
  problemSelect.attr ("value", function (problem) { return problem.charSet; })
    .text (function (problem) { return problem.name; });
    
  problemSelect.exit ().remove ();
  d3.select ('.problem').node ().selectedIndex = 0;
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

gModalMenu.getProblemNumber = function () {
  return d3.select (".problem").node ().selectedIndex;
};

gModalMenu.getPsetNumber = function () {
  return d3.select (".pset").node ().selectedIndex;
};

gModalMenu.setProblemNumber = function (index) {
  d3.select (".problem").node ().selectedIndex = index;
};

gModalMenu.setPsetNumber = function (index) {
  d3.select (".pset").node ().selectedIndex = index;
  gModalMenu.changeNumbers ();
};

gModalMenu.setSubmitButton = function (text) {
  d3.select (".submitButton").text (text);
};