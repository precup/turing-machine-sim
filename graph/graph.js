var gShiftKey = false;
var gEpsilon = "Ɛ";
var gGraph = 
  {
  };

function gup( name, url ) {
  if (!url) url = location.href
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( url );
  return results == null ? null : results[1];
}
  
gGraph.init = function () {
  var svg = d3.select ("svg");
  gGraph.width = svg.node ().getBoundingClientRect ().width;
  gGraph.height = svg.node ().getBoundingClientRect ().height;
  
  gGraph.charSet = gup ("charset");
  
  gNodes.init ();
  gEdges.init ();
  gBrush.init ();
  gGraph.initDelete ();
  
  gBehaviors.addBehavior ("page", "keydown", function () { return true; }, gGraph.keydown);
  gBehaviors.addBehavior ("page", "keyup", function () { return true; }, gGraph.keyup);
  gBehaviors.apply ("page", d3.select("body"));
  gBehaviors.apply ("background", d3.select("div.gui"));
  
  gNodes.addNode ();
  gNodes.addNode ();
  gNodes.addNode ();
  gEdges.addEdge (gNodes.nodes[0], gNodes.nodes[1]);
  gGraph.draw ();
}

gGraph.keydown = function () {
  gShiftKey = d3.event.shiftKey || d3.event.metaKey;
};

gGraph.keyup = function () {
  gShiftKey = d3.event.shiftKey || d3.event.metaKey;
};

gGraph.save = function () {
  return {
      nodes: gNodes.save (),
      edges: gEdges.save ()
    };
};

gGraph.load = function (saveData) {
  gNodes.load (saveData.nodes);
  gEdges.load (saveData.edges);
};

gGraph.draw = function () {
  gNodes.draw ();
  gEdges.draw ();
  gTopMenu.draw ();
}

// TODO: Make the resizing more useful
// TODO: Find a non-kludgey way for the svg to have 100% height
gGraph.resize = function () {
  var svg = d3.select ("svg");
  gGraph.width = svg.node ().getBoundingClientRect ().width;
  gGraph.height = svg.node ().getBoundingClientRect ().height;
  d3.select (".background").attr("width", gGraph.width);
  d3.select (".background").attr("height", gGraph.height);
};