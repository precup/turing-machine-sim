var gNFASimulator = 
  {
  };

gNFASimulator.run = function (graph, input) {
  var transitionTable = gSimulation.convert (graph);
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
    }
    
    var choices = transitionTable[entry.current][input[entry.index]];
    for (var i = 0; i < choices.length; i++) {
      var newEntry = { current: choices[i], index: entry.index + 1 };
      if (!used[newEntry.current + " " + newEntry.index]) {
        used[newEntry.current + " " + newEntry.index] = true;
        queue.enqueue.push (newEntry);
      }
    }
    
    var epsilons = transitionTable[gEpsilon][input[entry.index]];
    for (var i = 0; i < epsilons.length; i++) {
      var newEntry = { current: epsilons[i], index: entry.index };
      if (!used[newEntry.current + " " + newEntry.index]) {
        used[newEntry.current + " " + newEntry.index] = true;
        queue.enqueue.push (newEntry);
      }
    }
  }
  return false;
};