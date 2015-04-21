var gSimulator = gDFASimulator;

gSimulator.convert = function (graph) {
  var transitionTable = {};
  graph.nodes.nodes.forEach (function (node) {
    transitionTable[node.id] = {};
    for (var i = 0; i < gGraph.charSet.length; i++) {
      transitionTable[node.id][gGraph.charSet[i]] = [];
    }
  });
  graph.edges.edges.forEach (function (edge) {
    edge.transitions.forEach (function (input) {
      transitionTable[edge.source][input].push (edge.target);
    });
  });
  return transitionTable;
};