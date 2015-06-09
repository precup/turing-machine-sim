/* The gTMSimulator simulates a Turing Machine, surprisingly.
 * Allows both stepping and running. */

var gTMSimulator = 
  {
    // The number of iterations to run on the 
    // simulator before terminating
    MAX_ITER: 100000
  };
  
var gBlank = ' ';
var gSquare = String.fromCharCode(0x25A1);

/* The subroutines that are recognized. Defined as a map
 * from name to function (state), where state is the same as
 * in stepState. The function must return a state with the
 * appropriately modified input and index. Changes to initial will
 * be overwritten. 
 *
 * TODO: Replace Kevin's code with something that meshes more neatly
 * with the codebase. */
var subroutines = {
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

/* Given a graph saved from gGraph @graph, returns a table for simpler
 * simulation. The table has two dimensions, initial node id and input
 * character, and each entry is set to either null, if no transition
 * is defined, or the associated transition object. If not null, the
 * object has the target node added as 'target'. */
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
  
/* Given a @graph saved from gGraph, and initial node id,
 * an input string, and the index where the cursor is,
 * returns the a state object with the same format as stepState. */
gTMSimulator.step = function (graph, initial, input, index) {
  var transitionTable = gTMSimulator.convert (graph);
  var transition = transitionTable[initial][input[index]];
  return gTMSimulator.stepState (graph, transitionTable, {
      initial: initial,
      input: input,
      index: index
    });
};

/* Given a @graph saved from gGraph, the associated table from convert,
 * and a state, computes the next state. State format is an object 
 * containing three fields, 'input', 'index', and 'initial', which are
 * the tape, the cursor position on the tape, and the current node's index,
 * respectively. @standalone specifies whether or not this is currently 
 * connected to the full app so it knows whether or not to display errors. */
gTMSimulator.stepState = function (graph, table, state, standalone) {
  var current = graph.nodes.nodes[gTMSimulator.getNodeIndex (graph, state.initial)];
  if (subroutines.hasOwnProperty(current.name)) {
    // Find and run the subroutine
    var exit = gTMSimulator.getNodeIndexFromName (graph, current.name + '_');
    if (exit == -1) {
      if (standalone !== true) {
        gErrorMenu.displayError ("Missing subroutine exit point.");
      }
      return {
        initial: undefined,
        input: state.input,
        index: state.index
      };
    }
    var result = subroutines[current.name] (state);
    gTMSimulator.subCalls[current.name]++;
    result.initial = graph.nodes.nodes[exit].id;
    return result;
  }
  else {
    // Simulate normally
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

/* Given a graph saved from gGraph @graph, finds and returns
 * the index of the node with the specified @id. Returns 
 * -1 if not found. Identical to the one in nodes.js, copied
 * here because the grading page shouldn't have the full
 * interface loaded, but needs gTMSimulator. */
gTMSimulator.getNodeIndex = function (graph, id) {
  var index = -1;
  graph.nodes.nodes.forEach (function (node, i) {
    if (node.id == id) {
      index = i;
    }
  });
  return index;
}

/* Given a graph saved from gGraph @graph, finds and returns
 * the index of the node with the specified @name. Returns 
 * -1 if not found. Identical to the one in nodes.js, copied
 * here because the grading page shouldn't have the full
 * interface loaded, but needs gTMSimulator. */
gTMSimulator.getNodeIndexFromName = function (graph, name) {
  var index = -1;
  graph.nodes.nodes.forEach (function (node, i) {
    if (node.name === name) {
      index = i;
    }
  });
  return index;
}

/* Given a graph saved from gGraph @graph, runs the input
 * string @input and returns the result. @standalone specifies
 * whether or not this is currently connected to the full app
 * so it knows whether or not to display errors. Returns true
 * for accept, false for reject, and gSimulator.TIMEOUT on
 * timeout. Sets gSimulator.index to the ending index, 
 * gSimulator.output to the ending tape, and gSimulator.subCalls
 * to a map from subroutine name to number of calls. */
gTMSimulator.run = function (graph, input, standalone) {
  gTMSimulator.subCalls = {};
  for (var name in subroutines) {
    if (subroutines.hasOwnProperty(name)) {
      gTMSimulator.subCalls[name] = 0;
    }
  }
  
  if (graph.nodes.initial == null) {
    gSimulator.subCalls = JSON.parse (JSON.stringify (gTMSimulator.subCalls));
    gSimulator.index = 0;
    gSimulator.output = input;
    return false;
  }
  
  var state = {
    initial: graph.nodes.initial,
    input: input,
    index: 0
  };
  var transitionTable = gTMSimulator.convert (graph);
  for (var i = 0; i < gTMSimulator.MAX_ITER && state.input.length < 100000; i++) {
    if (state.initial == undefined) {
      gSimulator.subCalls = JSON.parse (JSON.stringify (gTMSimulator.subCalls));
      gSimulator.index = state.index;
      gSimulator.output = state.input;
      return false;
    }
    var current = graph.nodes.nodes[gTMSimulator.getNodeIndex (graph, state.initial)];
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
      state = gTMSimulator.stepState (graph, transitionTable, state, standalone);
    }
  }
  gSimulator.subCalls = JSON.parse (JSON.stringify (gTMSimulator.subCalls));
  gSimulator.index = state.index;
  gSimulator.output = state.input;
  return gSimulator.TIMEOUT;
};
