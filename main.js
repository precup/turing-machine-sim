function run () {
  var saved = getURLParam ("saved");
  var pset = getURLParam ("pset");
  var problem = getURLParam ("problem");
  var charSet = getURLParam ("charset");
  var mode = getURLParam ("type");
  if (saved == null) {
    buildGraph (null, pset, problem, charSet, mode);
  }
}

function buildGraph (graph, pset, problem, charSet, mode) {
  gBehaviors.init ();
  gGraph.init (graph, pset, problem, charSet, mode);
}

url_prefix = "/class/cs103/cgi-bin/restricted";
