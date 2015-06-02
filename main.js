function run () {
  var raw_saved = getURLParam ("saved");
  var saved = raw_saved ? decodeURIComponent (getURLParam ("saved")) : raw_saved;
  var student = getURLParam ("student");
  var submit_pset = getURLParam ("submit_pset");
  var submit_problem = getURLParam ("submit_problem");
  var pset = getURLParam ("pset");
  var problem = getURLParam ("problem");
  var charSet = getURLParam ("charset");
  var mode = getURLParam ("type");
  var tapeSet = getURLParam ("tapeSet");

  if (student) {
    var submit_pset = parseInt (submit_pset);
    var submit_problem = parseInt (submit_problem);
    var indexed_problem = psets[submit_pset].problems[submit_problem].id;
    var indexed_pset = psets[submit_pset].id;
    gServer.getStudentSubmissions ([student], function (err, data) {
      data.forEach (function (elem, idx, arr) {
        console.log (elem);
        console.log (submit_pset, submit_problem);
        console.log (indexed_pset, indexed_problem);
        if (elem.pset_id === indexed_pset && elem.problem_number === indexed_problem) {
          reload (JSON.parse (elem.automata));
        }
      });
    });
  } else if (submit_pset && submit_pset) {
    // load previous submission
    var submit_pset = parseInt (submit_pset);
    var submit_problem = parseInt (submit_problem);
    var indexed_problem = psets[submit_pset].problems[submit_problem].id;
    var indexed_pset = psets[submit_pset].id;
    gServer.loadSubmission (indexed_pset, indexed_problem, function (err, data) {
      if (err) {
        gErrorMenu.displayError ("Could not connect to server; load failed", true);
      } else {
        var automata = JSON.parse(data[0]["automata"]);
        reload (automata);
      }
    });
  } else if (saved == null) {
    buildGraph (pset, problem, charSet, mode, tapeSet);
  } else {
    gServer.listSaved (function (err, data) {
      var found = false;
      var automata;
      data.forEach (function (elem, index, arr) {
        if (elem["name"] === saved) {
          found = true;
          automata = JSON.parse (elem["automata"]);
        }
      });

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
  var loadedTapeSet = automata.meta.tapeSet;
  buildGraph (loadedPset, loadedProblem, loadedCharSet, loadedMode, loadedTapeSet);
  gGraph.load (automata);
  gGraph.draw ();
}

function buildGraph (pset, problem, charSet, mode, tapeSet) {
  gBehaviors.init ();
  gGraph.init (pset, problem, charSet, mode, tapeSet);
}
