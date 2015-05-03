var gModalMenu =
  {
    confirmFlag: "",
    MAX_HEIGHT_PERCENT: 0.62
  };

gModalMenu.open = function (type) {
  gModalMenu.currentType = type;
  d3.select ("." + type).style ('display', 'inline');
  d3.select ('.overlay').style ('display', 'inline');
}

gModalMenu.close = function (type) {
  d3.select ("." + type).style ('display', 'none');
  d3.select ('.overlay').style ('display', 'none');
};

gModalMenu.closeCurrent = function () {
  gModalMenu.cancel (gModalMenu.currentType);
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
      // gServer.save ();
      gModalMenu.initSave ();
      break;
    case "load":
      gModalMenu.loadFromModal ();
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
}

gModalMenu.cancel = function (type) {
  switch (type) {
    case "edgeEntry":
      gEdges.editCancelled ();
      break;
    case "submit":
      gModalMenu.submitCancelled ();
    case "save":
      gModalMenu.saveCancelled ();
    default:
      gModalMenu.close (type);
      break;
  }
}

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
}

gModalMenu.submitToServer = function (done) {
  var automata = JSON.stringify (gGraph.save ());
  var pset = gModalMenu.getPsetNumber();
  var problem = gModalMenu.getProblemNumber();
  gServer.submit (automata, pset, problem,
    function (err) {
      if (err) {
        gModalMenu.setSubmitButton ("Failed");
      } else {
        gModalMenu.setSubmitButton ("Success!");
        setTimeout(function () {
          gModalMenu.setSubmitButton ("Submit");
          done ();
        }, 1000);
      }
    }
  );
}

gModalMenu.submitCancelled = function () {
  gModalMenu.close ("confirm");
}

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
    if (isPreviouslySaved (data, pset, problem)) {
      gModalMenu.close ("submit");
      gModalMenu.open ("confirm");
    } else {
      gModalMenu.submitToServer (function () {
        gModalMenu.close ("submit");
      });
    }
  });
}

gModalMenu.initSave = function () {
  gModalMenu.confirmFlag = "save";

  var name = gModalMenu.getSaveName ();
  gServer.listSaved (function (data) {
    function isPreviouslySaved (list, name) {
      var isPreviouslySaved = false;
      return list.some (function (elem, index, arr) {
        return elem["name"] === name;
      });
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
}

gModalMenu.saveCancelled = function () {
  gModalMenu.close ("confirm");
}

// done ()
gModalMenu.save = function (done) {
  var name = gModalMenu.getSaveName ();
  gModalMenu.setSaveButton ("Saving...");
  gServer.save (name, function (err, data) {
    if (err) {
      if (typeof err === "string") {
        gErrorMenu.displayError (err);
      }
      gModalMenu.setSaveButton ("Failed");
    } else {
      gModalMenu.setSaveButton ("Saved!");
    }
    window.setTimeout(function () {
      gModalMenu.setSaveButton ("Save"); // return to original
      gModalMenu.close("save");
    }, 1000);
  });
}

gModalMenu.getEpsilon = function () {
  return gGraph.mode == gGraph.NFA && d3.select(".epsilon").node().checked;
}

gModalMenu.setEpsilon = function (included) {
  d3.select(".epsilon").node().checked = included;
}

gModalMenu.addAllEdgeChars = function () {
  gModalMenu.setEdgeChars (gGraph.charSet);
  gModalMenu.setEpsilon (true);
}

gModalMenu.invertEdgeChars = function () {
  var chars = gGraph.charSet;
  var badChars = gModalMenu.getEdgeCharacters ();
  for (var badChar in badChars) {
    chars = chars.replace (badChars[badChar], "");
  }
  gModalMenu.setEdgeChars (chars);
  gModalMenu.setEpsilon (!gModalMenu.getEpsilon ());
}

gModalMenu.setEdgeChars = function (chars) {
  d3.select(".edgeChars").node().value = chars;
}

gModalMenu.getEdgeCharacters = function () {
  return d3.select(".edgeChars").node().value;
}

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
  d3.select (".saveText").node ().value = name;
};

gModalMenu.setSaveButton = function (text) {
  d3.select (".saveButton").text (text);
};

gModalMenu.setLoadNames = function (names) {
  var lis = d3.select (".loadNames")
    .selectAll ("li")
    .data (names);
    
  lis.enter ().append ("li");
  lis.classed ("selected", false)
    .classed ("load-nothing", false)
    .text (function (name) {
      return name;
     })
    .on ("click", function () {
      d3.select (".loadNames").selectAll ("li").classed ("selected", false);
      d3.select (this).classed ("selected", true);
    })
    .style ("cursor", "pointer");
  lis.exit ().remove ();
  
  if (names.length == 0) {
    d3.select (".loadNames")
      .append ("li")
      .classed ("load-nothing", true)
      .html ("<p class='modal-description'>Nothing's been saved yet</p>");
  }
};

gModalMenu.getLoadName = function () {  
  var node = d3.select (".loadNames").select ("li.selected").node ();
  return node == null ? null : d3.select (".loadNames").select ("li.selected").text ();
};

gModalMenu.setLoadButton = function (text) {
  d3.select ('.loadButton').text (text);
};

gModalMenu.loadFromModal = function () {
  var name = gModalMenu.getLoadName ();
  gServer.load (
    name,
    function () { // whileRunning
      gModalMenu.setLoadButton ("Loading...");
    },
    function (err) { // error
      gModalMenu.setLoadButton ("Failed");
    },
    function (automata) { // success
      gModalMenu.setLoadButton ("Success!");
      gGraph.charSet = automata.meta.charSet;
      gGraph.pset = automata.meta.pset;
      gGraph.problem = automata.meta.problem;
      var mode = automata.meta.mode;
      if (mode != gGraph.mode) {
        window.location.href = getURLParent () + "tm.html?saved=" + name;
      }
      gGraph.load (automata);
      gGraph.draw ();
    },
    function () { // callback
      setTimeout (function () {
        gModalMenu.setLoadButton ("Load");
        gModalMenu.close ("load");
      }, 300);
    });
}

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
};

gModalMenu.setSubmitButton = function (text) {
  d3.select (".submitButton").text (text);
};