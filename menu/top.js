// <button type="button" onclick="setStart()">&#x2192; Set as Start</button>
// <input class="fileInput" id="fileInput" type="file" onchange="loadFile();">
// <button type="button" onclick="openModal('.json')">Load</button>
// <button type="button" onclick="downloadAsJson(machine.getSaveData(), 'tm.json')">Download as JSON</button>
// <button type="button" onclick="openModal('.testing')">Run test</button>

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
  gNodes.setAccepting (accepting);
  gNodes.setRejecting (rejecting);
  gGraph.draw ();
};

gTopMenu.deleteSelected = function () {
  gNodes.removeNodes ();
  gEdges.deleteSelected ();
  gGraph.draw ();
};

gTopMenu.openLoadDialog = function () {
  if (window.File) {
    document.getElementById ("fileInput").click ();
  } else {
    alert ("Error: your browser doesn't support the File API.");
  }
};

gTopMenu.setInitial = function () {
  gNodes.setInitial ();
  gGraph.draw ();
};

gTopMenu.snapToGrid = function () {
  gNodes.snapToGrid ();
  gGraph.draw ();
};

gTopMenu.loadFromServer = function () {
  var listSaved_url = "/api/listSaved.php";
  d3.xhr(gServer.url_prefix + listSaved_url)
    .header("Content-Type", "application/json")
    .get(function(err, data) {
      var json_data = JSON.parse(data.response);
      var names = [];
      json_data.forEach(function(elem, index, arr) {
        names.push(elem["name"]);
      });
      gModalMenu.setLoadNames (names);
      gModalMenu.open("load");
    });
};

gTopMenu.save = function () {
  gModalMenu.setSaveName (gServer.name);
  gModalMenu.open ("save");
};


gTopMenu.submit = function () {
  gModalMenu.open ("submit");
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
  
  d3.select ("#selectedText").node ().innerHTML = gTopMenu.SELECTED_TEXT + selectedText;
  
  d3.select(".acceptButton").classed("marked", gNodes.selectionIsAccepting ());
  d3.select(".rejectButton").classed("marked", gNodes.selectionIsRejecting ());
  d3.select(".neitherButton").classed("marked", gNodes.selectionIsNeither ());
};
