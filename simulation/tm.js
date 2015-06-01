var gTMSimulator = 
  {
    MAX_ITER: 100000
  };
  
var gBlank = ' ';
var gSquare = String.fromCharCode(0x25A1);

var subroutines = { // this is a horrible hack if ever there was one
  'half': function(state){
    var input = state.input;
    var onesCount = 0;
    for(var i=state.index; i<input.length && input[i] == '1'; ++i) {
      ++onesCount;
    }
    var replacement = '';
    for(var i=0; i<onesCount; ++i) {
      replacement += (i < onesCount / 2) ? '1' : ' ';
    }
    input = input.substring(0, state.index) + replacement + input.substring(state.index + onesCount);
    state.input = input;
    return state;
  },
  'trip': function(state){
    var input = state.input;
    var onesCount = 0;
    for(var i=state.index; i<input.length && input[i] == '1'; ++i) {
      ++onesCount;
    }
    var replacement = '';
    for(var i=0; i<3*onesCount+1; ++i) {
      replacement += '1';
    }
    input = input.substring(0, state.index) + replacement + input.substring(state.index + 3*onesCount);
    state.input = input;
    return state;
  }
};


gTMSimulator.convert = function (graph) {
  var transitionTable = {};
  var charSet = gGraph.tapeSet + (gGraph.epsilonEnabled ? gEpsilon : "");
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
  return gTMSimulator.stepState (graph, transitionTable, {
      initial: initial,
      input: input,
      index: index
    });
};

gTMSimulator.stepState = function (graph, table, state) {
  var current = graph.nodes.nodes[gNodes.getNodeIndex (state.initial)];
  if (subroutines.hasOwnProperty(current.name)) {
    var exit = gNodes.getNodeIndexFromName (current.name + '_');
    if (exit == -1) {
      gErrorMenu.displayError ("Missing subroutine exit point.");
      return {
        initial: undefined,
        input: state.input,
        index: state.index
      };
    }
    var result = subroutines[current.name] (state);
    gTMSimulator.subCalls[current.name]++;
    result.initial = gNodes.nodes[exit].id;
    return result;
  }
  else {
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
  }
};

gTMSimulator.run = function (graph, input) {
  gTMSimulator.subCalls = {};
  for (var name in subroutines) {
    if (subroutines.hasOwnProperty(name)) {
      gTMSimulator.subCalls[name] = 0;
    }
  }
  
  var state = {
    initial: graph.nodes.initial,
    input: input,
    index: 0
  };
  var transitionTable = gTMSimulator.convert (graph);
  for (var i = 0; i < gTMSimulator.MAX_ITER; i++) {
    if (state.initial == undefined) {
      gSimulator.subCalls = JSON.parse (JSON.stringify (gTMSimulator.subCalls));
      gSimulator.index = state.index;
      gSimulator.output = state.input;
      return false;
    }
    var current = graph.nodes.nodes[gNodes.getNodeIndex (state.initial)];
    if (current.accept) {
      gSimulator.subCalls = JSON.parse (JSON.stringify (gTMSimulator.subCalls));
      gSimulator.index = state.index;
      gSimulator.output = state.input;
      return true;
    }
    if (current.reject) {
      gSimulator.subCalls = JSON.parse (JSON.stringify (gTMSimulator.subCalls));
      gSimulator.index = state.index;
      gSimulator.output = state.input;
      return false;
    }
    if (i < gTMSimulator.MAX_ITER - 1) {
      state = gTMSimulator.stepState (graph, transitionTable, state);
    }
  }
  gSimulator.subCalls = JSON.parse (JSON.stringify (gTMSimulator.subCalls));
  gSimulator.index = state.index;
  gSimulator.output = state.input;
  return gSimulator.TIMEOUT;
};
