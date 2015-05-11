/* submit.js */

gModalMenu.initSubmitToServer = function () {
  gModalMenu.confirmFlag = "submit";

  var automata = JSON.stringify (gGraph.save ());
  var pset = gModalMenu.getPsetNumber();
  var problem = gModalMenu.getProblemNumber();

  gModalMenu.setSubmitButton ("Submitting...");

  function isPreviouslySaved (list, pset, problem) {
    var isPreviouslySaved = false;
    return list.some (function (elem, index, arr) {
      var cur_pset_id = parseInt (elem["pset_id"]);
      var cur_problem_id = parseInt (elem["problem_id"]);
      return cur_pset_id === pset &&
        cur_problem_id === problem;
    });
  }

  gServer.listSubmissions (function (data, err) {
    if (err) {
      gErrorMenu.displayModalError ("submit", "Failed to submit");
      gModalMenu.setSubmitButton ("Submit");
      setTimeout (function () {
        gErrorMenu.clearModalErrors ();
      }, 3000);
      return;
    }
    if (isPreviouslySaved (data, pset, problem)) {
      gModalMenu.close ("submit");
      gModalMenu.open ("confirm");
    } else {
      gModalMenu.submitToServer (function () {
        gModalMenu.close ("submit");
      });
    }
  });
};

gModalMenu.submitToServer = function (done) {
  var automata = JSON.stringify (gGraph.save ());
  var pset = gModalMenu.getPsetNumber();
  var problem = gModalMenu.getProblemNumber();
  
  if (psets[pset].problems[problem].type != gGraph.mode && gGraph.mode == "nfa") {
    gErrorMenu.displayError ("This automaton is an NFA, but the problem requires a DFA.");
    return;
  }
  if (psets[pset].problems[problem].type != gGraph.mode && gGraph.mode == "dfa") {
    gErrorMenu.displayError ("This automaton is a DFA, but the problem requires an NFA.");
    return;
  }
  if (psets[pset].problems[problem].charSet != gGraph.charSet) {
    gErrorMenu.displayError ("The alphabet for this automaton doesn't match the alphabet for that problem.");
    return;
  }
  
  gServer.submit (automata, pset, problem,
    function (err) {
      if (err) {
        gErrorMenu.displayModalError ("submit", "Failed to submit");
        setTimeout (function () {
          gErrorMenu.clearModalErrors ();
        }, 3000);
        gModalMenu.setSubmitButton ("Submit");
        return;
      } else {
        gModalMenu.setSubmitButton ("Success!");
      }
      setTimeout(function () {
        gModalMenu.setSubmitButton ("Submit");
        done ();
      }, 1000);
    }
  );
};

gModalMenu.initSubmit = function () {
  var psetSelect = d3.select (".pset").selectAll ("option").data (psets);
  psetSelect.enter ()
    .append ("option")
    .attr ("value", function (pset, i) { return i; })
    .text (function (pset, i) { return pset.name; });
  d3.select ('.pset').node ().selectedIndex = 0;
  gModalMenu.changeNumbers ();
};

gModalMenu.changeNumbers = function () {
  var psetNum = d3.select ('.pset').node ().selectedIndex;
  var problemSelect = d3.select (".problem").selectAll ("option").data (psets[psetNum].problems);
  problemSelect.enter ().append ("option");
    
  problemSelect.attr ("value", function (problem) { return problem.charSet; })
    .text (function (problem) { return problem.name; });
    
  problemSelect.exit ().remove ();
  d3.select ('.problem').node ().selectedIndex = 0;
};

gModalMenu.getProblemNumber = function () {
  return d3.select (".problem").node ().selectedIndex;
};

gModalMenu.getPsetNumber = function () {
  return d3.select (".pset").node ().selectedIndex;
};

gModalMenu.setProblemNumber = function (index) {
  d3.select (".problem").node ().selectedIndex = index;
};

gModalMenu.setPsetNumber = function (index) {
  d3.select (".pset").node ().selectedIndex = index;
  gModalMenu.changeNumbers ();
};

gModalMenu.setSubmitButton = function (text) {
  d3.select (".submitButton").text (text);
};