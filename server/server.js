var gServer = {};

gServer.url_prefix = "/class/cs103/cgi-bin/restricted";

gServer.name = "automata";

gServer.save = function save () {
  var name = gModalMenu.getSaveName();
  gServer.name = name;
  var save_url = "/api/save.php";
  gModalMenu.setSaveButton ("Saving...");
  var stringGraph = JSON.stringify (gGraph.save ());

  var pack = {
    automata: stringGraph,
    name: name
  };

  d3.xhr (gServer.url_prefix + save_url)
    .header ("Content-Type", "application/json")
    .post (
      JSON.stringify (pack),
      function (err, rawData) {
        if (err) {
          gModalMenu.setSaveButton ("Failed");
        } else { 
          gModalMenu.setSaveButton ("Saved!");
        }
        window.setTimeout(function () {
          gModalMenu.setSaveButton ("Save"); // return to original
        }, 1000);
      }
    );
}

gServer.load = function load () {
  var selected = gModalMenu.getLoadName();
  var get_url = "/api/load.php" + "?name=" + selected;
  d3.xhr (gServer.url_prefix + get_url)
    .header ("Content-Type", "application/json")
    .get (function(err, data) {
        if (err) console.log(err);

        var json_data = JSON.parse (data.response);

        gGraph.load (JSON.parse (json_data[0]["automata"]));
        gGraph.draw ();
      });
}

gServer.submit = function submit () {
  d3.xhr ()
  gGraph.problem
  gGraph.pset
}