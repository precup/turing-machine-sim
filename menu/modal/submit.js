/*

FILE: menu/modal/submit.js

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

/* Put constants into the submitModal object here. */
gModalMenu.submitModal = {};

/* Initializes the Submit Modal by loading the select lists with 
the psets and problem numbers.
No return value. */
gModalMenu.submitModal.init = function () {
  var psetSelect = d3.select (".pset").selectAll ("option").data (psets);
  psetSelect.enter ()
    .append ("option")
    .attr ("value", function (pset, i) { return i; })
    .text (function (pset, i) { return pset.name; });
  d3.select ('.pset').node ().selectedIndex = 0;
  gModalMenu.submitModal.changenumbers ();
};

/* Event handler for clicking the submit button.
Checks if the submission has been previously submitted to the database.
If not, goes ahead with submission. Otherwise, opens the confirm menu
and waits for user confirmation.
No return value. */
gModalMenu.submitModal.clickSubmitBtn = function () {
  gModalMenu.confirm.flag = "submit";

  var automata = JSON.stringify (gGraph.save ());
  var pset = gModalMenu.submitModal.getPsetNumber ();
  var problem = gModalMenu.submitModal.getProblemNumber ();

  problem = psets[pset].problems[problem].id;
  pset = psets[pset].id;

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

/* Event handler for clicking the cancel button. Closes the
submit modal and clears modal errors. */
gModalMenu.submitModal.clickCancelBtn = function () {
  gModalMenu.cancel ('submit');
  gErrorMenu.clearModalErrors ();
};

/* Event handler for the user confirming to overwrite a 
previous submission. Goes ahead and submits the automaton, then
closes the submission on success. */
gModalMenu.submitModal.clickConfirmBtn = function () {
  gModalMenu.close ("confirm");
  gModalMenu.open ("submit");
  gModalMenu.submitModal.submit (function () {
    gModalMenu.close ("submit");
  });
};

/* Event handler for the user clicking cancel in the modal menu.
Closes the confirm modal and opens the submit modal. */
gModalMenu.submitModal.clickConfirmCancelBtn = function () {
  gModalMenu.close ("confirm");
  gModalMenu.open ("submit");
  gModalMenu.submitModal.setSubmitButton ("Submit");
};

/* Actually submits the automaton to the server. There are error checks in place
to confirm that the user doesn't submit an automaton of the wrong type.
@param (done : function) callback that's passed no arguments
No return value. */
gModalMenu.submitModal.submit = function (done) {
  var automata = JSON.stringify (gGraph.save ());
  var pset = gModalMenu.submitModal.getPsetNumber();
  var problem = gModalMenu.submitModal.getProblemNumber();

  var indexed_problem = psets[pset].problems[problem].id;
  var indexed_pset = psets[pset].id;
  
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
  if (psets[pset].problems[problem].charSet != gGraph.charSet.split (" ").join ("")) { // charSet with spaces removed
    gErrorMenu.displayModalError ("submit", "The alphabet for this automaton doesn't match the alphabet for that problem.");
    gModalMenu.submitModal.setSubmitButton ("Submit");

    return;
  }
  /*
 if (gGraph.mode === "tm" && psets[pset].problems[problem].tapeSet != gGraph.tapeSet.split (" ").join ("")) { // tapeSet with spaces removed
    gErrorMenu.displayModalError ("submit", "WARNING: The tape alphabet for this turing machine doesn't match the tape alphabet for that problem, but we'll still let you submit.");
    gModalMenu.submitModal.setSubmitButton ("Submit");

    // return;
  }
  */
  
  gServer.submit (automata, indexed_pset, indexed_problem,
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

/*--- Helper functions ---*/

/* Updates the problem numbers based on the currently selected pset. Selected index
is set to 0.
No return value. */
gModalMenu.submitModal.changenumbers = function () {
  var psetNum = d3.select ('.pset').node ().selectedIndex;
  var problemSelect = d3.select (".problem").selectAll ("option").data (psets[psetNum].problems);
  problemSelect.enter ().append ("option");
    
  problemSelect.attr ("value", function (problem) { return problem.charSet; })
    .text (function (problem) { return problem.name; });
    
  problemSelect.exit ().remove ();
  d3.select ('.problem').node ().selectedIndex = 0;
};

/*  */
gModalMenu.submitModal.getProblemNumber = function () {
  return d3.select (".problem").node ().selectedIndex;
};

/* */
gModalMenu.submitModal.getPsetNumber = function () {
  return d3.select (".pset").node ().selectedIndex;
};

/* */
gModalMenu.submitModal.setProblemNumber = function (index) {
  d3.select (".problem").node ().selectedIndex = index;
};

/* */
gModalMenu.submitModal.setPsetNumber = function (index) {
  d3.select (".pset").node ().selectedIndex = index;
  gModalMenu.submitModal.changenumbers ();
};

/* */
gModalMenu.submitModal.setSubmitButton = function (text) {
  d3.select (".submitButton").text (text);
};
