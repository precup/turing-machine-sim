/*

submit.js

-- elements
problem set select
problem select
submit button
cancel button

-- events
init
(open is handled by default)
clickSubmitBtn
clickCancelBtn
clickConfirmBtn
clickConfirmCancelBtn

*/

gModalMenu.submitModal = {};

gModalMenu.submitModal.init = function () {
  var psetSelect = d3.select (".pset").selectAll ("option").data (psets);
  psetSelect.enter ()
    .append ("option")
    .attr ("value", function (pset, i) { return i; })
    .text (function (pset, i) { return pset.name; });
  d3.select ('.pset').node ().selectedIndex = 0;
  gModalMenu.submitModal.changenumbers ();
};

gModalMenu.submitModal.clickSubmitBtn = function () {
  gModalMenu.confirm.flag = "submit";

  var automata = JSON.stringify (gGraph.save ());
  var pset = gModalMenu.submitModal.getPsetNumber ();
  var problem = gModalMenu.submitModal.getProblemNumber ();

  gModalMenu.submitModal.setSubmitButton ("Submitting...");

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
      gModalMenu.submitModal.setSubmitButton ("Submit");
      return;
    }
    if (isPreviouslySaved (data, pset, problem)) {
      gModalMenu.close ("submit");
      gModalMenu.confirm.open ();
    } else {
      gModalMenu.submitModal.submit (function () {
        gModalMenu.close ("submit");
      });
    }
  });
};

gModalMenu.submitModal.clickCancelBtn = function () {
  gModalMenu.cancel ('submit');
  gErrorMenu.clearModalErrors ();
};

gModalMenu.submitModal.clickConfirmBtn = function () {
  gModalMenu.close ("confirm");
  gModalMenu.open ("submit");
  gModalMenu.submitModal.submit (function () {
    gModalMenu.close ("submit");
  });
};

gModalMenu.submitModal.clickConfirmCancelBtn = function () {
  gModalMenu.close ("confirm");
  gModalMenu.open ("submit");
  gModalMenu.submitModal.setSubmitButton ("Submit");
};

gModalMenu.submitModal.changenumbers = function () {
  var psetNum = d3.select ('.pset').node ().selectedIndex;
  var problemSelect = d3.select (".problem").selectAll ("option").data (psets[psetNum].problems);
  problemSelect.enter ().append ("option");
    
  problemSelect.attr ("value", function (problem) { return problem.charSet; })
    .text (function (problem) { return problem.name; });
    
  problemSelect.exit ().remove ();
  d3.select ('.problem').node ().selectedIndex = 0;
};

gModalMenu.submitModal.submit = function (done) {
  var automata = JSON.stringify (gGraph.save ());
  var pset = gModalMenu.submitModal.getPsetNumber();
  var problem = gModalMenu.submitModal.getProblemNumber();
  
  if (psets[pset].problems[problem].type != gGraph.mode && gGraph.mode == "nfa") {
    gErrorMenu.displayModalError ("submit", "This automaton is an NFA, but the problem requires a DFA.");
    gModalMenu.submitModal.setSubmitButton ("Submit");
    return;
  }
  if (psets[pset].problems[problem].type != gGraph.mode && gGraph.mode == "dfa") {
    gErrorMenu.displayModalError ("submit", "This automaton is a DFA, but the problem requires an NFA.");
    gModalMenu.submitModal.setSubmitButton ("Submit");
    return;
  }
  if (psets[pset].problems[problem].charSet != gGraph.charSet) {
    gErrorMenu.displayModalError ("submit", "The alphabet for this automaton doesn't match the alphabet for that problem.");
    gModalMenu.submitModal.setSubmitButton ("Submit");

    return;
  }
  if (gGraph.mode === "tm" && psets[pset].problems[problem].tapeSet != gGraph.tapeSet) {
    gErrorMenu.displayModalError ("submit", "The tape alphabet for this turing machine doesn't match the tape alphabet for that problem.");
    gModalMenu.submitModal.setSubmitButton ("Submit");

    return;
  }
  
  gServer.submit (automata, pset, problem,
    function (err) {
      if (err) {
        gErrorMenu.displayModalError ("submit", "Failed to submit");
        gModalMenu.submitModal.setSubmitButton ("Submit");
        return;
      } else {
        gModalMenu.submitModal.setSubmitButton ("Success!");
      }
      setTimeout(function () {
        gModalMenu.submitModal.setSubmitButton ("Submit");
        done ();
      }, 1000);
    }
  );
};

gModalMenu.submitModal.getProblemNumber = function () {
  return d3.select (".problem").node ().selectedIndex;
};

gModalMenu.submitModal.getPsetNumber = function () {
  return d3.select (".pset").node ().selectedIndex;
};

gModalMenu.submitModal.setProblemNumber = function (index) {
  d3.select (".problem").node ().selectedIndex = index;
};

gModalMenu.submitModal.setPsetNumber = function (index) {
  d3.select (".pset").node ().selectedIndex = index;
  gModalMenu.submitModal.changenumbers ();
};

gModalMenu.submitModal.setSubmitButton = function (text) {
  d3.select (".submitButton").text (text);
};