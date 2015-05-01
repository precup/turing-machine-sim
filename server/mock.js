var gServerMock = {};

gServerMock.url_prefix = "/class/cs103/cgi-bin/restricted";

gServerMock.name = "automata";

gServerMock.save = function save () {
  var name = gModalMenu.getSaveName();
  if (name.replace (/\s/g, "").length == 0) {
    gErrorMenu.displayError ("Automata name cannot be blank");
    return;
  }
  gServer.name = name;
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
      function (err, rawData) {
        if (err) {
          gModalMenu.setSaveButton ("Failed");
        } else {
          gModalMenu.setSaveButton ("Saved!");
        }
        window.setTimeout(function () {
          gModalMenu.setSaveButton ("Save"); // return to original
          gModalMenu.close("save");
        }, 1000);
      }
    );
};

gServerMock.load = function load () {
  var selected = gModalMenu.getLoadName();
  var get_url = "/api/loadFromSaved.php" + "?name=" + selected;
  d3.xhr (gServer.url_prefix + get_url)
    .header ("Content-Type", "application/json")
    .get (function(err, data) {
        if (err) console.log(err);

        var json_data = JSON.parse (data.response);

        gGraph.load (JSON.parse (json_data[0]["automata"]));
        gGraph.draw ();

        gModalMenu.close("load");
      });
};

gServerMock.submit = function submit () {
  var submit_url = "/api/submit.php";

  var automata = JSON.stringify (gGraph.save ());
  var pset = 1; // TODO
  var problem = 1; // TODO

  var pack = {
    automata: automata,
    pset: pset,
    problem: problem
  };

  d3.xhr (gServer.url_prefix + submit_url)
    .header ("Content-Type", "application/json")
    .post (
      JSON.stringify (pack),
      function (err, rawData) {
        if (err) {
          console.log (err);
        } else { 
          console.log (rawData);
        }
      });
};

gServerMock.listSubmissions = function listSubmissions () {
  var listSubmissions_url = "/api/listSubmissions.php";

  d3.xhr (gServer.url_prefix + listSubmissions_url)
    .header ("Content-Type", "application/json")
    .get (
      function (err, rawData) {
        if (err) {
          console.log (err);
        } else { 
          console.log (rawData);

          var data = JSON.parse (rawData.response);

          // example of accessing values in data:
          // console.log(data[0]['pset_id']);
          // console.log(data[0]['problem_id']);
        }
      });
};

gServerMock.loadSubmission = function loadSubmission () {
  var pset = 1; // TODO
  var problem = 1; // TODO

  var loadFromSubmissions_url = "/api/loadFromSubmissions.php";
  var full_url = gServer.url_prefix + loadFromSubmissions_url + "?problem=" + problem + "&pset=" + pset;

  d3.xhr (full_url)
    .header ("Content-Type", "application/json")
    .get (
      function (err, rawData) {
        if (err) {
          console.log(err);
        } else { 
          console.log(rawData);

          var data = JSON.parse(rawData.response);

          var automata = JSON.parse(data[0].automata);

          gGraph.load (automata);
          gGraph.draw ();
        }
    });
};

// callback(data)
gServerMock.listSaved = function listSaved (callback) {
  callback ([{ name: "test1" }, { name: "test2" }]);
}

// callback(sunetid)
gServerMock.getSunetid = function getSunetid (callback) {
  callback ("mprecup");
};

if (getURLParam ("mock") != null) {
  gServer = gServerMock;
}