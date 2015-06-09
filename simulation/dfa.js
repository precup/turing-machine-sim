/* The gDFASimulator simulates a DFA, surprisingly.
 * Allows both stepping and running. */

var gDFASimulator = 
  {
  };
  
/* Given a @graph saved from gGraph, and initial node id,
 * an input string, and the index where the cursor is,
 * returns the id of the node to transition to. */
gDFASimulator.step = function (graph, initial, input, index) {
  var transitionTable = gSimulator.convert (graph);
  return transitionTable[initial][input[index]][0];
};

/* Runs a full simulation on a @graph saved from gGraph.
 * Given an input string @input, returns true for accept
 * and false for reject. */
gDFASimulator.run = function (graph, input) {
  gSimulator.output = input;
  var transitionTable = gSimulator.convert (graph);
  var current = graph.nodes.initial;
  for (var i = 0; i < input.length; i++) {
    var choices = transitionTable[current][input[i]];
    if (choices.length == 0) {
      return false;
    }
    current = choices[0];
  }
  for (var i = 0; i < graph.nodes.nodes.length; i++) {
    if (graph.nodes.nodes[i].id == current) {
      return graph.nodes.nodes[i].accept;
    }
  }
  return false;
};