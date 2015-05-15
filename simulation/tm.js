var gTMSimulator = 
  {
    MAX_ITER: 100000
  };
  
var gBlank = ' ';
var gSquare = String.fromCharCode(0x25A1);
  
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
    edge.transitions[0].forEach (function (input) {
      transitionTable[edge.source][input.from] = JSON.parse (JSON.stringify (input));
      transitionTable[edge.source][input.from].target = edge.target;
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
  var input = state.input;
  if (input.length == state.index) {
    input += gBlank;
  }
  var transition = table[state.initial][input[state.index]];
  if (transition == undefined) {
    return {
      initial: undefined,
      input: input,
      index: state.index
    };
  }
  var result = {
      initial: transition.target,
      index: state.index + transition.direction
    };
  result.input = input.substring (0, state.index) + transition.to + input.substring (state.index + 1);
  while (result.index < 0) {
    result.index++;
    result.input = gBlank + result.input;
  }
  while (result.index >= result.input.length) {
    result.input += (gBlank);
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
    if (state.initial == undefined) {
      gSimulator.output = state.input;
      return false;
    }
    var current = graph.nodes.nodes[gNodes.getNodeIndex (state.initial)];
    if (current.accept) {
      gSimulator.output = state.input;
      return true;
    }
    if (current.reject) {
      gSimulator.output = state.input;
      return false;
    }
    if (i < gTMSimulator.MAX_ITER - 1) {
      state = gTMSimulator.stepState (transitionTable, state);
    }
  }
  gSimulator.output = state.input;
  return gSimulator.TIMEOUT;
};