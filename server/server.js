var gServer = {};

gServer.url_prefix = "/class/cs103/cgi-bin/restricted";

gServer.name = "automata";

gServer.save = function save () {
  var name = gModalMenu.getSaveName();
  var save_url = "/api/save.php";
  gModalMenu.setSaveButton ("Saving...");
  var stringGraph = JSON.stringify (gGraph.save ());

  var pack = {
    automata: stringGraph,
    name: name
  };

  d3.xhr (url_prefix + save_url)
    .header ("Content-Type", "application/json")
    .post (
      JSON.stringify (pack),
      function(err, rawData) {
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

}