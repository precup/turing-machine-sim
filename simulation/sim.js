/* gSimulator is the common section of the simulators. */
var gSimulator = 
  {
    TIMEOUT: "timeout"
  };

/* Sets up gSimulator based on the mode. gSimulator will
 * have run and step alias the appropriate simulator's, 
 * and, as such, step is not guaranteed to be defined. */
gSimulator.init = function () {
  var simulator = gGraph.mode == gGraph.DFA ? gDFASimulator : 
                  gGraph.mode == gGraph.NFA ? gNFASimulator :
                                              gTMSimulator;
  gSimulator.run = simulator.run;
  gSimulator.step = simulator.step;
};  

/* Converts a graph saved from gGraph @graph into a table for
 * easier simulation. The table is 3-dimensional, and indexing
 * in via an initial node id and then an input character will
 * give you an array of all the possible exit node ids. */
gSimulator.convert = function (graph) {
  var transitionTable = {};
  var charSet = gGraph.charSet + (gGraph.epsilonEnabled ? gEpsilon : "");
  graph.nodes.nodes.forEach (function (node) {
    transitionTable[node.id] = {};
    for (var i = 0; i < charSet.length; i++) {
      transitionTable[node.id][charSet[i]] = [];
    }
  });
  graph.edges.edges.forEach (function (edge) {
    edge.transitions[0].forEach (function (input) {
      transitionTable[edge.source][input].push (edge.target);
    });
  });
  return transitionTable;
};