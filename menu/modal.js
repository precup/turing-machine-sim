var gModalMenu =
  {
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
      gServer.save ();
      break;
    case "load":
      gModalMenu.loadFromModal ();
      break;
    case "submit":
      gServer.submit ();
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
    default:
      gModalMenu.close (type);
      break;
  }
}

gModalMenu.loadFromModal = function () {
  var loadName = gModalMenu.getLoadName ()
  if (!loadName) {
    gErrorMenu.displayError ("No automata selected");
    return;
  }

  gServer.load (
    loadName,
    function () { // whileRunning
      gModalMenu.setLoadButton ("Loading...");
    },
    function (err) { // error
      gModalMenu.setLoadButton ("Failed");
    },
    function (automata) { // success
      gModalMenu.setLoadButton ("Success!");
      var charSet = automata.meta.charSet;
      var pset = automata.meta.pset;
      var problem = automata.meta.problem;
      buildGraph (null, pset, problem, charSet, "dfa");
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

gModalMenu.getTeamText = function () {
  var names = d3.select (".teamText").node ().value.split (/[ ,\t\r\n]/);
  for (var i = 0; i < names.length; i++) {
    if (names[i].endsWith ("@stanford.edu")) {
      names[i] = names[i].substring (0, names[i].length - "@stanford.edu".length);
    }
    if (names[i] == "") {
      names.splice (i--, 1);
    }
  }
};

gModalMenu.setTeamText = function (names) {
  for (var i = 0; i < names.length; i++) {
    if (!names[i].endsWith ("@stanford.edu")) {
      names[i] += "@stanford.edu";
    }
  }
  d3.select (".teamText").node ().value = names.join (", ");
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
    .classed ("gridInput bulkInput", true)
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

gModalMenu.setSubmitButton = function (text) {
  d3.select (".submitButton").text (text);
};