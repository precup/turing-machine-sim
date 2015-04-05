BLANK = "☐";

/*
 * Has two public functions, run(), which runs the TM until termination, 
 * and step(), which runs the TM for one step.
 * The getTransitions() function collects all transitions from the specified
 * node, and returns a JS object with key as the “fromChar” and value as
 * a JS object with “fromChar”, “direction” and “target” (node).
 */
function Emulator(graph, input, startingNode) {
  var machine = graph;
  var currentNode = startingNode || graph.start.index.toString();
  var tape = new Tape(input, 0);
  var terminated = false;
  var accepted = false;
  
  // Collects all links for the node specified, returns a 
  // map with each key as a valid transition from the
  // node and each value as information about the transition.
  function getTransitions(node) { // returns the transitions with the node as the source
    var transitions = {};
    machine.links.forEach(function findTransitions(element, index, array) {
      if(element.source.index.toString() === node) { // A little convoluted, but should work
        element.transitions.forEach(function addTransitions(elem, idx, arr) {
          var move = {
            character: elem.toChar,
            node: element.target.index.toString(),
            direction: elem.direction
          }
          transitions[elem.fromChar] = move;
        });
      }
    });
    return transitions;
  }

  function _step() {
    if (terminated) return false;

    var currentChar = tape.read();

    var transitions = getTransitions(currentNode.toString());

    var move = transitions[currentChar];
    if(move === undefined) {
      terminated = true;
      return false; // transition for this character doesn't exist
    }
    
    // transition for this character exists
    tape.write(move.character);
    currentNode = move.node;
    move.direction === true ? tape.moveRight() : tape.moveLeft();
    var actualNode = machine.nodes.filter(function (node) { return node.index == currentNode;})[0];
    if(actualNode.accept || actualNode.reject) {
      accepted = actualNode.accept;
      return false;
    }
    return true;
  }

  return {
    run: function run() { // TODO: A limit should be set on the number of iterations
      while(_step()) {}
      return accepted;
    },
    step: function step() { // returns false if the machine has terminated
      return _step();
    },
    getAccepted: function getAccepted() {
      return accepted;
    },
    getTape: function getTape() {
      return tape.toString();
    },
    getState: function getState() {
      return currentNode;
    },
    getTapePosition: function getTapePosition() {
      return tape.getPosition();
    }
  }
}
