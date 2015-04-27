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

gTopMenu.runTests = function () {
  gModalMenu.open ("testing");
};

gTopMenu.run = function () {
  gTape.show ();
  gTape.run (d3.select (".stepText").node ().value);
};

gTopMenu.end = function () {
  gTape.hide ();
};

gTopMenu.step = function () {
  gTape.step ();
};

gTopMenu.loadFromServer = function () {
    var list_url = "/api/list.php";
    d3.xhr(list_url)
      .header("Content-Type", "application/json")
      .get(function(err, data) {
        console.log("data", data);
        var json_data = JSON.parse(data.response);
        console.log(json_data);
        var nice_data = "";
        json_data.forEach(function(elem, index, arr) {
          nice_data += elem[0] + "," + elem[1] + "\n";
        });
        var selected_id = parseInt(prompt(nice_data));
        console.log(selected_id);
        var get_url = "/api/load.php" + "?id=" + selected_id;
        d3.xhr(get_url)
          .header("Content-Type", "application/json")
          .post(selected_id, 
            function(err, data) {
              if(err) console.log(err);
              console.log(data);
              var json_data = JSON.parse(data.response);
              console.log(json_data);
              gGraph.load(JSON.parse(json_data[0][1]));
              gGraph.draw ();
          });
      });
};

gTopMenu.load = function () {
  var files = document.getElementById ("fileInput").files;
  if (files.length < 1) return;
  var file = files[0];
  var reader = new FileReader ();

  reader.onload = function (e) {
    gGraph.load (JSON.parse (reader.result));
    gGraph.draw ();
  }

  reader.readAsText (file);
};

gTopMenu.save = function (elem) {
  var save_url = "/api/save.php";
  elem.innerHTML = "Saving...";
  var stringGraph = JSON.stringify(gGraph.save());
  var name = "name";

  var pack = {
    automata: stringGraph,
    name: name
  };
  console.log(pack);
  d3.xhr(save_url)
    .header("Content-Type", "application/json")
    .post(
      JSON.stringify(pack),
      function(err, rawData) {
        if (err) {
          elem.innerHTML = "Failed";
        } else { 
          elem.innerHTML = "Saved!";
        }
        console.log(rawData);
        window.setTimeout(function() {
          elem.innerHTML = "Save"; // return to original
        }, 1000);
      }
    );
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
