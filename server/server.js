var gServer = {};

gServer.url_prefix = "/class/cs103/cgi-bin/restricted";

gServer.name = "automata";

gServer.save = function () {
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
          gModalMenu.close("save");
        }, 1000);
      }
    );
};

// whileRunning (), error (err), done ()
gServer.load = function (selected, whileRunning, error_callback, success, done) {
  if (typeof whileRunning === "function") whileRunning ();
  console.log ("loading", selected);

  var get_url = "/api/loadFromSaved.php" + "?name=" + selected;
  d3.xhr (gServer.url_prefix + get_url)
    .header ("Content-Type", "application/json")
    .get (function(err, res) {
        if (err) {
          if (typeof error_callback === "function") error (err);
        } else {
          if (success) {
            gServer.name = selected;
            var json_data = JSON.parse (res.response);
            success (JSON.parse (json_data[0]["automata"]));
          }
        }
        if (done) done ();
      });
};

gServer.submit = function () {
  var submit_url = "/api/submit.php";
  gModalMenu.setSubmitButton ("Submitting...");

  var automata = JSON.stringify (gGraph.save ());
  var pset = gModalMenu.getPsetNumber();
  var problem = gModalMenu.getProblemNumber();

  var pack = {
    automata: automata,
    pset: pset,
    problem: problem
  };
  
  gServer.listSubmissions(function (data) {
    var isOverwrite = false;
    data.forEach (function (elem, index, arr) {
      if (parseInt(elem ["pset_id"]) === pset && parseInt(elem["problem_id"]) === problem) {
        isOverwrite = true;
      }
    });

    if (isOverwrite) {
      // Check if the user wants to overwrite previous submission.
    }

    function continueSubmit () {
      d3.xhr (gServer.url_prefix + submit_url)
        .header ("Content-Type", "application/json")
        .post (
          JSON.stringify (pack),
          function (err, rawData) {
            if (err) {
              gModalMenu.setSubmitButton ("Failed");
              console.log (err);
            } else {
              console.log (rawData);
              gModalMenu.setSubmitButton ("Success!");
              setTimeout(function () {
                gModalMenu.setSubmitButton ("Submit");
                gModalMenu.close ("submit");
              }, 1000);
            }
          });
    }
  });
};

// callback (data)
gServer.listSubmissions = function (callback) {
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
          callback (data);

          // example of accessing values in data:
          // console.log(data[0]['pset_id']);
          // console.log(data[0]['problem_id']);
        }
      });
};

gServer.loadSubmission = function () {
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
gServer.listSaved = function (callback) {
  var listSaved_url = "/api/listSaved.php";
  d3.xhr(gServer.url_prefix + listSaved_url)
    .header("Content-Type", "application/json")
    .get(function(err, data) {
      var json_data = JSON.parse(data.response);
      callback(json_data);
    });
}

// callback(sunetid)
gServer.getSunetid = function (callback) {
  var getSunetid_url = "/api/getSunetid.php";
  d3.xhr(gServer.url_prefix + getSunetid_url)
    .header("Content-Type", "application/json")
    .get(function(err, data) {
      callback(data.response);
    });
};