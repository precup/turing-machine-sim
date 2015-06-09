/* The gNFASimulator simulates an NFA, surprisingly.
 * Allows only running. */
 
var gNFASimulator = 
  {
  };

/* Runs a full simulation on a @graph saved from gGraph.
 * Given an input string @input, returns true for accept
 * and false for reject. Performs the simulation via a 
 * BFS looking for any path that will accept. */
gNFASimulator.run = function (graph, input) {
  gSimulator.output = input;
  var transitionTable = gSimulator.convert (graph);
  var queue = new Queue ();
  var used = {};
  queue.enqueue ({ current: graph.nodes.initial, index: 0 });
  used[graph.nodes.initial + " " + 0] = true;
  
  while (!queue.isEmpty ()) {
    var entry = queue.dequeue ();
    if (entry.index == input.length) {
      for (var i = 0; i < graph.nodes.nodes.length; i++) {
        if (graph.nodes.nodes[i].id == entry.current && graph.nodes.nodes[i].accept) {
          return true;
        }
      }
    } else {
      var choices = transitionTable[entry.current][input[entry.index]];
      for (var i = 0; i < choices.length; i++) {
        var newEntry = { current: choices[i], index: entry.index + 1 };
        if (!used[newEntry.current + " " + newEntry.index]) {
          used[newEntry.current + " " + newEntry.index] = true;
          queue.enqueue (newEntry);
        }
      }
    }
    
    var epsilons = transitionTable[entry.current][gEpsilon];
    for (var i = 0; i < epsilons.length; i++) {
      var newEntry = { current: epsilons[i], index: entry.index };
      if (!used[newEntry.current + " " + newEntry.index]) {
        used[newEntry.current + " " + newEntry.index] = true;
        queue.enqueue (newEntry);
      }
    }
  }
  return false;
};