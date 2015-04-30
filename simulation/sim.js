var gSimulator = gGraph.mode == gGraph.DFA ? gDFASimulator : gNFASimulator;

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