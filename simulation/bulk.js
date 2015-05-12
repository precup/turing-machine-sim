gSimulator.ACCEPT = "ACCEPT";
gSimulator.REJECT = "REJECT";
gSimulator.NEITHER = "NEITHER";

gSimulator.runTests = function () {
  var inputs = [];
  var illegalsExist = false;
  
  d3.selectAll (".bulkInput").each (function () {
    var test = intersection (this.value, gGraph.charSet);
    illegalsExist |= test.length != this.value.length;
    this.value = test;
    inputs.push ({ 
      testCase: test,
      expected: gSimulator.NEITHER
    });
  });
  d3.selectAll (".bulkAccept").each (function (junk, i) {
    if (this.checked) {
      inputs[i].expected = gSimulator.ACCEPT;
    }
  });
  d3.selectAll (".bulkReject").each (function (junk, i) {
    if (this.checked) {
      inputs[i].expected = gSimulator.REJECT;
    }
  });
  
  if (illegalsExist) {
    gErrorMenu.displayModalError ("testing", "Removing characters not in alphabet");
  }
  
  var results = [];
  var graph = gGraph.save ();
  inputs.forEach (function (input) {
    results.push ({
        accepted: gSimulator.run (graph, input.testCase),
        input: gSimulator.output,
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
      d3.select (this).selectAll ("td").text (function (junk, i) {
        switch (i) {
          case 0:
            return result.input;
          case 1:
            return result.accepted ? "A" : "R";
          case 2:
            if (result.expected === gSimulator.NEITHER) {
              return "-";
            } else {
              var correct = !((result.expected === gSimulator.ACCEPT) ^ result.accepted);
              return correct ? "Y" : "N";
            }
        }
      });
    });
  
  rows.exit ().remove ();
};