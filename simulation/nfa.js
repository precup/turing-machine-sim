var gNFASimulator = 
  {
  };

gNFASimulator.run = function (graph, input) {
  var transitionTable = gSimulation.convert (graph);
  var stack = [];
  var used = {};
  stack.push ({ current: graph.nodes.initial, index: 0 });
  used[graph.nodes.initial + " " + 0] = true;
  
  while (stack.length > 0) {
    var entry = stack.pop ();
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
          stack.push (newEntry);
        }
      }
    }
  }
  return false;
};