// run(graph, input) return (accept/reject, end state)

// each link will have a transition
// transition {
//   fromChar,
//   toChar, // empty string represents blank space character
//   direction // True is to the right, False is to the left
// }

function testHarness(graph, tests) {
  Object.keys(tests).forEach(function runTest(element, index, array) {
    var em = new Emulator(graph, element);
    em.run();
    console.log(element);
    console.log("Result: ", em.getTape(), " Expected: ", tests[element].result);
    console.log("Passes test?: ", em.getTape() === tests[element].result);
  });
}

// Test Set 1: Doubling the first character of the string. 
// Test: "0" => "00", Accept
// Test: "01" => "001", Accept
// Test: "10" => "110", Accept
// Test: "" => N/A, Reject
var test1 = {
  "0": {
    result: "00",
    accepted: true
  },
  "01": {
    result: "001",
    accepted: true
  },
  "10": {
    result: "110",
    accepted: true
  },
  "": {
    result: "",
    accepted: false
  }
}

var graph1 = {
  nodes: [{
    x: 0,
    y: 0
  }, {
    x: 1,
    y: 1
  }, {
    x: 2,
    y: 2
  }, {
    x: 3,
    y: 3
  }],
  links: [{
    source: "0",
    target: "1",
    transitions: [{
      fromChar: "0",
      toChar: "0",
      direction: false
    }]
  }, {
    source: "0",
    target: "2",
    transitions: [{
      fromChar: "1",
      toChar: "1",
      direction: false
    }]
  }, {
    source: "1",
    target: "3",
    transitions: [{
      fromChar: BLANK,
      toChar: "0",
      direction: true
    }]
  }, {
    source: "2",
    target: "3",
    transitions: [{
      fromChar: BLANK,
      toChar: "1",
      direction: true
    }]
  }]
}