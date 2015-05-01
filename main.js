function run () {
  var saved = getURLParam ("saved");
  var pset = getURLParam ("pset");
  var problem = getURLParam ("problem");
  var charSet = getURLParam ("charset");
  var mode = getURLParam ("type");
  if (saved == null) {
    buildGraph (pset, problem, charSet, mode);
  } else {
    gServer.load (
      saved,
      null, null,
      function (automata) {
        var loadedCharSet = automata.meta.charSet;
        var loadedPset = automata.meta.pset;
        var loadedProblem = automata.meta.problem;
        var loadedMode = automata.meta.mode;
        buildGraph (loadedPset, loadedProblem, loadedCharSet, loadedMode);
        gGraph.load (automata);
        gGraph.draw ();
      }, null);
  }
}

function buildGraph (pset, problem, charSet, mode) {
  gBehaviors.init ();
  gGraph.init (pset, problem, charSet, mode);
}
