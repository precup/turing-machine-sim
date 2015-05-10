function run () {
  var saved = getURLParam ("saved");
  var submit_pset = getURLParam ("submit_pset");
  var submit_problem = getURLParam ("submit_problem");
  var pset = getURLParam ("pset");
  var problem = getURLParam ("problem");
  var charSet = getURLParam ("charset");
  var mode = getURLParam ("type");
  if (submit_pset && submit_pset) {
    // load previous submission
    var submit_pset = parseInt (submit_pset);
    var submit_problem = parseInt (submit_problem);
    gServer.loadSubmission (submit_pset, submit_problem, function (err, data) {
      if (err) {
        gErrorMenu.displayError ("Could not connect to server; load failed", true);
      } else {
        var automata = JSON.parse(data[0]["automata"]);
        reload (automata);
      }
    });
  }
  else if (saved == null) {
    buildGraph (pset, problem, charSet, mode);
  } else {
    gServer.load (
      saved,
      null,
      function (err, automata) {
        if (err) {
          gErrorMenu.displayError ("Could not connect to server; load failed", true);
          return;
        }
        reload (automata);
      });
  }
}

// automata should be a JSON automata as produced by gGraph.save()
function reload (automata) {
  var loadedCharSet = automata.meta.charSet;
  var loadedPset = automata.meta.pset;
  var loadedProblem = automata.meta.problem;
  var loadedMode = automata.meta.mode;
  buildGraph (loadedPset, loadedProblem, loadedCharSet, loadedMode);
  gGraph.load (automata);
  gGraph.draw ();
}

function buildGraph (pset, problem, charSet, mode) {
  gBehaviors.init ();
  gGraph.init (pset, problem, charSet, mode);
}
