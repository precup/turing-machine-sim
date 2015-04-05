/*
Alphabet of 0s and 1s.
Flips all 0s to 1s and all 1s to 0s. Appends a 1. Returns the tape reader to the first character of the string.
*/

graph = {"nodes":[{"x":300,"y":300,"index":0,"name":"n0","selected":false},{"x":578,"y":301,"index":1,"name":"n1","selected":false},{"x":860,"y":304,"transitions":[],"index":2,"name":"n2","selected":true,"reject":false,"accept":true}],"links":[{"source":0,"target":0,"transitions":[{"toNode":"n0","direction":true,"toChar":"0","fromChar":"1","fromNode":"n0"},{"toNode":"n0","direction":true,"toChar":"1","fromChar":"0","fromNode":"n0"}]},{"source":0,"target":1,"transitions":[{"toNode":"n1","direction":false,"toChar":"1","fromChar":"☐","fromNode":"n0"}]},{"source":1,"target":1,"transitions":[{"toNode":"n1","direction":false,"toChar":"1","fromChar":"1","fromNode":"n1"},{"toNode":"n1","direction":false,"toChar":"0","fromChar":"0","fromNode":"n1"}]},{"source":1,"target":2,"transitions":[{"toNode":"n2","direction":true,"toChar":"☐","fromChar":"☐","fromNode":"n1"}]}],"start":-1};

testCases = {
  "": {
    result: "1",
    accepted: true
  },
  "0": {
    result: "11",
    accepted: true
  },
  "1": {
    result: "01",
    accepted: true
  },
  "101": {
    result: "0101",
    accepted: true
  },
  "12": {
    result: "",
    accepted: false
  },
  "☐☐1": {
    result: "☐☐01",
    accepted: false
  }
}