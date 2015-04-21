gSimulator.ACCEPT = "ACCEPT";
gSimulator.REJECT = "REJECT";
gSimulator.NEITHER = "NEITHER";

gSimulator.runTests = function () {
  var testLines = d3.select(".testingText").node().value.split ("\n");
  var inputs = [];
  testLines.forEach (function (line) {
    var input = 
      {
        expected: gSimulator.NEITHER,
        testCase: line
      };
    if (line.endsWith (" A") || line.endsWith (" R")) {
      input.expected = line.endsWith ("A") ? gSimulator.ACCEPT : gSimulator.REJECT;
      input.testCase = line.substring (0, line.length - 2);
    }
    inputs.push (input);
  });
  var results = [];
  var graph = gGraph.save ();
  inputs.forEach (function (input) {
    results.push ({
        input: input.testCase,
        accepted: gSimulator.run (graph, input.testCase),
        expected: input.expected
      });
  });
  
  var rows = d3.select (".testingResults")
    .selectAll ("tr")
    .data (results);
    
  var entered = rows.enter ()
    .append ("tr");
  entered.append ("td")
    .attr ("width", "60%")
    .style ("text-align", "left");
  entered.append ("td")
    .attr ("width", "20%")
    .style ("text-align", "center");
  entered.append ("td")
    .attr ("width", "20%")
    .style ("text-align", "center");
  
  rows.each (function (result) {
      d3.select (this).selectAll ("td").each (function (junk, i) {
        switch (i) {
          case 0:
            this.innerHTML = result.input;
            break;
          case 1:
            this.innerHTML = result.accepted ? "A" : "R";
            break;
          case 2:
            if (result.expected === gSimulator.NEITHER) {
              this.innerHTML = "-";
            } else {
              var correct = !((result.expected === gSimulator.ACCEPT) ^ result.accepted);
              this.innerHTML = "<div style='color: " + 
                               (correct ? "#00D000" : "red") + 
                               ";'>" +
                               (correct ? "Y" : "N") +
                               "</div>";
            }
            break;
        }
      });
    });
  
  rows.exit ().remove ();
  var height = 334 + Math.max (0, results.length * 31 - 161); // Derived experimentally
  d3.select (".testing")
    .style ("height", height + "px")
    .style ("margin-top", (-height/2) + "px");
};