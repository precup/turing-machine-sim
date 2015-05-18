var gShiftKey = false;
var gEpsilon = "Ɛ";
var gGraph = 
  {
    HEIGHT_OFFSET: 5,
    BUFFER: 100,
    DFA: "dfa",
    NFA: "nfa",
    TM: "tm"
  };
  
gGraph.init = function (pset, problem, charSet, mode, tapeSet) {
  var svg = d3.select ("svg");
  gGraph.width = svg.node ().getBoundingClientRect ().width;
  gGraph.height = svg.node ().getBoundingClientRect ().height - gGraph.HEIGHT_OFFSET;
  gGraph.height -= d3.select (".tape-bar").node ().getBoundingClientRect ().height;
  svg.attr ("height", gGraph.height);
  
  var charSetParam = charSet;
  gGraph.problem = problem;
  gGraph.pset = pset;
  gGraph.mode = mode;
  if (gGraph.mode != gGraph.NFA && gGraph.mode != gGraph.TM) {
    gGraph.mode = gGraph.DFA;
  }
  if (charSetParam == null) {
    window.location = getURLParent () + "index.html";
  }
  gGraph.charSet = sortString (removeDuplicates (charSetParam));
  if (mode === "tm") {
    gGraph.tapeSet = sortString (removeDuplicates (tapeSet + " "));
  }
  gGraph.epsilonEnabled = gGraph.mode == gGraph.NFA;
  
  gServer.getSunetid (function (sunetid) {
    gGraph.sunetid = sunetid;
  });
  
  if (gGraph.mode == gGraph.DFA) {
    d3.selectAll (".dfa-hide")
      .style ("display", "none");
  } else if (gGraph.mode == gGraph.NFA) {
    d3.selectAll (".nfa-hide")
      .style ("display", "none");
  } else {
    d3.selectAll (".tm-hide")
      .style ("display", "none");
    gGraph.charSet += ' ';
  }
  
  gNodes.init ();
  gEdges.init ();
  gBrush.init ();
  gTape.init ();
  gTestMenu.init ();
  gModalMenu.initBulk ();
  gModalMenu.submitModal.init ();
  gModalMenu.tmEdge.initTmEdit ();
  gTableMenu.init ();
  gGraph.initDelete ();
  gGraph.initCookie ();
  gSimulator.init ();
  
  d3.selectAll (".popup")
    .on ("click", function () {
      d3.event.stopPropagation ();
    });
  
  d3.selectAll (".overlay")
    .on ("click", function () {
      gModalMenu.closeCurrent ();
    });
  
  gBehaviors.addBehavior ("page", "keydown", function () { return true; }, gGraph.keydown);
  gBehaviors.addBehavior ("page", "keyup", function () { return true; }, gGraph.keyup);
  gBehaviors.apply ("page", d3.select("body"));
  gBehaviors.apply ("background", d3.select("div.gui"));

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
      edges: gEdges.save (),
      meta: {
        charSet: gGraph.charSet,
        pset: gGraph.pset,
        problem: gGraph.problem,
        mode: gGraph.mode,
        tapeSet: gGraph.tapeSet
      }
    };
};

gGraph.load = function (saveData) {
  gNodes.load (saveData.nodes);
  gEdges.load (saveData.edges);
  gTape.reset ();
  gTestMenu.reset ();
};

gGraph.draw = function () {
  gNodes.draw ();
  gEdges.draw ();
  gTopMenu.draw ();
  gTableMenu.draw ();
  gTape.draw ();
}

// TODO: Make the resizing more useful
// TODO: Find a non-kludgey way for the svg to have 100% height
gGraph.resize = function () {
  var svg = d3.select ("svg");
  gGraph.width = svg.node ().getBoundingClientRect ().width;
  gGraph.height = svg.node ().getBoundingClientRect ().height;
  d3.select (".background").attr ("width", gGraph.width);
  d3.select (".background").attr ("height", gGraph.height);
  d3.select (".modal-content").attr ("max-height", gGraph.height * gModalMenu.MAX_HEIGHT_PERCENT);
};