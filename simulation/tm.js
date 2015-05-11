var gTMSimulator = 
  {
    MAX_ITER: 100000
  };
  
var gBlank = '\x25A1';
  
gTMSimulator.convert = function (graph) {
  var transitionTable = {};
  var charSet = gGraph.charSet + (gGraph.epsilonEnabled ? gEpsilon : "");
  graph.nodes.nodes.forEach (function (node) {
    transitionTable[node.id] = {};
    for (var i = 0; i < charSet.length; i++) {
      transitionTable[node.id][charSet[i]] = null;
    }
  });
  graph.edges.edges.forEach (function (edge) {
    edge.transitions.forEach (function (input) {
      transitionTable[edge.source][input.character] = JSON.parse (JSON.stringify (input));
      transitionTable[edge.source][input.character].target = edge.target;
    });
  });
  return transitionTable;
};
  
gTMSimulator.step = function (graph, initial, input, index) {
  var transitionTable = gTMSimulator.convert (graph);
  var transition = transitionTable[initial][input[index]];
  return gTMSimulator.stepState (transitionTable, {
      initial: initial,
      input: input,
      index: index
    });
};

gTMSimulator.stepState = function (table, state) {
  var transition = table[state.initial][state.input[state.index]];
  var result = {
      initial: transition.target.id,
      input: state.input.substr(0, index) + transition.result + state.input.substr(index + 1),
      index: state.index + transition.direction
    };
  if (result.index < 0) {
    result.index = 0;
    result.input = gBlank + result.input;
  }
  else if (result.index >= result.input) {
    result.input += gBlank;
  }
  return result;
};

gTMSimulator.run = function (graph, input) {
  var state = {
    initial: graph.nodes.initial,
    input: input,
    index: 0
  };
  var transitionTable = gTMSimulator.convert (graph);
  for (var i = 0; i < gTMSimulator.MAX_ITER; i++) {
    var current = graph.nodes.nodes[gNodes.getNodeIndex (state.initial)];
    if (current.accept) {
      return true;
    }
    if (current.reject) {
      return false;
    }
    if (i < gTMSimulator.MAX_ITER - 1) {
      state = gTMSimulator.stepState (transitionTable, state);
    }
  }
  return gSimulator.TIMEOUT;
};