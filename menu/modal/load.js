/*
-- load.js

-- elements
list of previously saved automata
cancel button
load button

-- events
onOpen
onClickLoadBtn
(cancel is handled by the default gModalMenu default handler)

*/

gModalMenu.load = {};

/* Event handlers */

gModalMenu.load.onOpen = function () {
  gModalMenu.open("load");
  gModalMenu.load.setLoadMessage ("Gathering saved automata...");
  
  gServer.listSaved (function (err, data) {
    if (err) {
      gErrorMenu.displayModalError ("load", "Could not gather saved automata...");
      d3.select (".load")
        .selectAll ("li")
        .remove ();
      
      return;
    }
    else {
      var names = [];
      data.forEach (function (elem, index, arr) {
        names.push (elem["name"]);
      });
      gModalMenu.load.setLoadNames (names);
    }
  });
}

gModalMenu.load.onClickLoadBtn = function () {
  gErrorMenu.clearModalErrors ();
  var name = gModalMenu.load.getLoadName ();

  if (!name) {
    gErrorMenu.displayModalError ("load", "No automaton selected");
    return;
  }
  gModalMenu.load.setLoadButton ("Loading...");
  gServer.load (
    name,
    function (err, automata) {
      if (err) {
        gErrorMenu.displayModalError ("load", "Failed to load");
        gModalMenu.load.setLoadButton ("Load");
        return;
      }
      gServer.changeName (decodeURIComponent (name));
      gModalMenu.load.setLoadButton ("Success!");
      gGraph.charSet = automata.meta.charSet;
      gGraph.pset = automata.meta.pset;
      gGraph.problem = automata.meta.problem;
      if (mode === "tm") {
        gGraph.tapeSet = automata.meta.tapeSet;
      }
      var mode = automata.meta.mode;
      if (mode != gGraph.mode) {
        window.location.href = getURLParent () + "tm.html?saved=" + name;
      }
      gGraph.load (automata);
      gGraph.draw ();
      setTimeout (function () {
        gModalMenu.load.setLoadButton ("Load");
        gModalMenu.close ("load");
      }, 300);
    });
}

gModalMenu.load.clickCancelBtn = function () {
  gErrorMenu.clearModalErrors ();
  gModalMenu.close ("load");
}

/* helper functions */

/* setter for the list of automata to load */
gModalMenu.load.setLoadNames = function (names) {
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
      .append ("p")
      .classed ("modal-description", true)
      .text ("Nothing's been saved yet");
  }
};

/* Get the selected node name. null if none selected */
gModalMenu.load.getLoadName = function () {  
  var node = d3.select (".loadNames").select ("li.selected").node ();
  return node == null ? null : encodeURIComponent (d3.select (".loadNames").select ("li.selected").text ());
};

gModalMenu.load.setLoadButton = function (text) {
  d3.select ('.loadButton').text (text);
};

gModalMenu.load.setLoadMessage = function (message) {
  d3.select (".loadNames")
    .selectAll ("li")
    .remove ();
  d3.select (".loadNames")
    .append ("li")
    .classed ("load-nothing", true)
    .append ("p")
    .classed ("modal-description", true)
    .text (message);
}
