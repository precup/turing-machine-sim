var gServer = {};

gServer.url_prefix = "/class/cs103/cgi-bin/restricted";


gServer.save = function save (name) {
  var save_url = "/api/save.php";
  gModelMenu.setSaveButton("Saving...");
  var stringGraph = JSON.stringify(gGraph.save());

  var pack = {
    automata: stringGraph,
    name: name
  };

  d3.xhr(url_prefix + save_url)
    .header("Content-Type", "application/json")
    .post(
      JSON.stringify(pack),
      function(err, rawData) {
        if (err) {
          gModelMenu.setSaveButton("Failed");
        } else { 
          gModelMenu.setSaveButton("Saved!");
        }
        window.setTimeout(function() {
          gModelMenu.setSaveButton("Save"); // return to original
        }, 1000);
      }
    );
}

gServer.load = function load () {

}