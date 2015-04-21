var gDFASimulator = 
  {
  };
  
gDFASimulator.step = function (graph, initial, input, index) {
  var transitionTable = gSimulator.convert (graph);
  return transitionTable[initial][input[index]];
};

gDFASimulator.run = function (graph, input) {
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