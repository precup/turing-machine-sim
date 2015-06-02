var gPset = psets[0];
var gTests = {};
var maxId = 0;
var gradingMock = false;
var selectedStudent = -1;

for (var i = 0; i < gPset.problems.length; i++) {
  gTests[gPset.problems[i].name] = [];
  maxId = Math.max (maxId, gPset.problems[i].id);
}

var gStudents = [];
var gAutomata = {};

function idToName (id) {
  for (var i = 0; i < gPset.problems.length; i++) {
    if (gPset.problems[i].id == id) {
      return gPset.problems[i].name;
    }
  }
  return "";
}

function loadSunets () {
  var text = d3.select (".search-text").node ().value;
  var ngStudents = text.split ("\n");
  for (var i = 0; i < ngStudents.length; i++) {
    ngStudents[i] = ngStudents[i].trim ();
  }
  gServer.getStudentSubmissions (ngStudents, function (err, data) {
      data.forEach (function (json) {
        if (json.pset_id != gPset.id) return;
        if (!gAutomata.hasOwnProperty (json.user_id)) {
          gAutomata[json.user_id] = new Array (maxId + 1);
          for (var i = 0; i <= maxId; i++) {
            gAutomata[json.user_id][i] = null;
          }
        }
        json.automata = JSON.parse (json.automata);
        json.automata.passed = -1;
        json.automata.results = [];
        gAutomata[json.user_id][json.problem_number] = json.automata;
      });
      gStudents = ngStudents;
      draw ();
     });
    draw ();
  });
  setSelected (-1);
}

function openLoad () { 
  if (window.File) {
    document.getElementById ("fileInput").click ();
  } else {
    alert ("Error: your browser doesn't support the File API.");
  }
}

function loadTests () {
  var files = document.getElementById ("fileInput").files;
  if (files.length < 1) return;
  var file = files[0];
  var reader = new FileReader ();

  reader.onload = function (e) {
    var rows = reader.result.split ("\n");
    for (var i = 0; i < rows.length; i++) {
      var test = rows[i].trim ().split (",");
      var name = idToName (test[1]);
      gTests[name].push ({
          name: test[0],
          id: test[1],
          input: test[2],
          output: test[3],
          accept: test[4],
          index: test[5],
          halves: test[6],
          trips: test[7]
        });
    }
    draw ();
  }

  reader.readAsText (file);
}

function runTests () {
  gGraph.epsilonEnabled = false;
  for (var i = 0; i < gStudents.length; i++) {
    var student = gStudents[i];
    for (var j = 0; j < gPset.problems.length; j++) {
      var problem = gPset.problems[j];
      var passed = 0;
      var automata = gAutomata[student][problem.id];
      if (automata == null) continue;
      automata.results = [];
      for (var k = 0; k < gTests[problem.name].length; k++) {
        var test = gTests[problem.name][k];
        gGraph.tapeSet = automata.meta.tapeSet;
        var success = gTMSimulator.run (automata, test.input, true);
        var result = {
          output: gSimulator.output,
          index: gSimulator.index,
          halves: gSimulator.subCalls["half"],
          trips: gSimulator.subCalls["trip"]
        };
        
        while (result.output.length > 0 && result.output[0] == " ") {
          result.output = result.output.substring (1);
          result.index--;
        }
        
        var reason = "";
        if (test.output != "-" && result.output.trim () != test.output) {
          reason += "Output was \"" + result.output.trim () + "\", expected \"" + test.output + "\". ";
        }
        if (test.accept != "-" && success != gSimulator.TIMEOUT && 
            ((test.accept === "true" && success !== true) || (test.accept === "false" && success !== false))) {
          if (test.accept) {
            reason += "Rejected instead of accepting. ";
          } else {
            reason += "Accepted instead of rejecting. ";
          }
        }
        if (test.index != "-" && result.index != test.index) {
          reason += "Index was " + result.index + ", expected " + test.index + ". ";
        }
        if (test.halves != "-" && result.halves != test.halves) {
          reason += "Halved " + result.halves + " times, expected " + test.halves + ". ";
        }
        if (test.trips != "-" && result.trips != test.trips) {
          reason += "Tripled " + result.trips + " times, expected " + test.trips + ". ";
        }
        if (success == gSimulator.TIMEOUT) {
            reason += "Timed out. ";
        }
        automata.results.push ({
          failed: reason.length != 0,
          passed: reason.length == 0,
          reason: reason
        });
        if (reason.length == 0) {
          passed++;
        }
      }
      automata.passed = passed;
    }
  }
  draw ();
}

function setSelected (i) {
  selectedStudent = i;
  d3.select ("h1")
    .text (i == -1 ? "No Student Selected" : "Test Results for " + gStudents[i]);
  d3.selectAll (".student")
    .classed ("selected", function (junk, i2) {
      return i == i2;
    });
  draw ();
}

function draw () {
  var testCount = 0;
  for (var i = 0; i < gPset.problems.length; i++) {
    testCount += gTests[gPset.problems[i].name].length;
  }
  
  var sidebar = d3.select (".students")
    .selectAll (".student")
    .data (gStudents);
    
  var enter = sidebar.enter ()
    .append ("div")
    .classed ("student", true)
    .on ("click", function (junk, i) {
      setSelected (i);
      draw ();
    });
  enter.append ("span")
    .classed ("sunet", true);
  enter.append ("span")
    .classed ("score", true);
    
  sidebar.select (".sunet")
    .text (function (name, i) {
      return name;
    });
  sidebar.select (".score")
    .text (function (name, i) {
      var passed = 0;
      for (var i = 0; i < gPset.problems.length; i++) {
        var automata = gAutomata[name][gPset.problems[i].id];
        console.log (name);
        if (automata != null) {
          if (automata.passed == -1 || passed == -1) {
            passed = -1;
          } else {
            passed += automata.passed;
          }
        }
      }
      return (passed == -1 ? "-" : passed) + "/" + testCount;
    });
    
  sidebar.exit ().remove ();
  
  var testDisplay = d3.select (".grades")
    .selectAll (".problem")
    .data (gPset.problems);
  
  var enter = testDisplay.enter ()
    .append ("div")
    .classed ("problem", true);
  var info = enter.append ("div")
    .classed ("problem-info", true);
  info.append ("span")
    .classed ("name", true)
    .text (function (problem) {
      return problem.name;
    });
  info.append ("div")
    .classed ("test-score", true);
  info.append ("a")
    .text ("View Problem")
    .on ("click", function (problem, idx) {
      if (selectedStudent !== -1) {
        window.location.href = gServer.url_prefix + 
          "/tm.html?student=" + gStudents[selectedStudent] +
          "&submit_pset=0" + 
          "&submit_problem=" + idx;
      } else {
        alert ("No student selected");
      }
    });
    
  testDisplay.select (".problem-info")
    .select (".test-score")
    .text (function (problem) {
      var total = gTests[problem.name].length;
      if (selectedStudent == -1) return "Tests passed: -/" + total;
      var automata = gAutomata[gStudents[selectedStudent]][problem.id];
      if (automata == null) return "No submission present";
      if (automata.passed == -1) return "Tests passed: -/" + total;
      return "Tests passed: " + automata.passed + "/" + total;
    });
    
  enter.append ("div")
    .classed ("problem-tests", true);
    
  var tests = testDisplay.select (".problem-tests")
    .selectAll (".problem-test")
    .data (function (problem) {
      return gTests[problem.name];
    });
  var test = tests.enter ()
    .append ("div")
    .classed ("problem-test", true);
  test.append ("span")
    .classed ("test", true);
  test.append ("span")
    .classed ("result", true);
  test.append ("div")
    .classed ("reason", true);
  tests.select (".test")
    .text (function (test) {
      return test.name;
    });
  tests.select (".result")
    .each (function (test, i) {
      if (selectedStudent == -1) {
        this.failed = false;
        this.passed = false;
        this.parentNode.reason = "";
      } else {
        var automata = gAutomata[gStudents[selectedStudent]][test.id];
        if (automata == null) {
          this.failed = false;
          this.passed = false;
          this.parentNode.reason = "Not submitted";
        } else if (automata.results.length == 0) {
          this.failed = false;
          this.passed = false;
          this.parentNode.reason = "";
        } else {
          var result = automata.results[i];
          this.failed = result.failed;
          this.passed = result.passed;
          this.parentNode.reason = result.reason;
        }
      }
    })
    .classed ("failed", function () {
      return this.failed;
    })
    .classed ("passed", function () {
      return this.passed;
    })
    .text (function () {
      return this.passed ? "Passed" : this.failed ? "Failed" : "Not run";
    });
  
  tests.select (".reason")
    .text (function () {
      return this.parentNode.reason;
    });
}