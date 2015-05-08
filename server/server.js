var gServer = {};

gServer.url_prefix = "/class/cs103/cgi-bin/restricted_copy";

gServer.name = "";

// callback (err, data)
gServer.save = function (name, callback) {
  if (name.replace (/\s/g, "").length === 0) {
    callback ("Automaton name cannot be blank", null);
    return;
  }
  gServer.name = name;
  var save_url = "/api/save.php";
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
        if (err) callback (err, null);
        else callback (err, rawData);
      }
    );
};

// whileRunning (), error (err), done ()
gServer.load = function (selected, whileRunning, error_callback, success, done) {
  if (typeof whileRunning === "function") whileRunning ();

  var get_url = "/api/loadFromSaved.php" + "?name=" + selected;
  d3.xhr (gServer.url_prefix + get_url)
    .header ("Content-Type", "application/json")
    .get (function (err, res) {
        if (err) {
          if (typeof error_callback === "function") error_callback (err);
          return;
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

// callback (err)
gServer.submit = function (automata, pset, problem, callback) {
  var submit_url = "/api/submit.php";

  var pack = {
    automata: automata,
    pset: pset,
    problem: problem
  };


  var packed = JSON.stringify (pack);

  d3.xhr (gServer.url_prefix + submit_url)
    .header ("Content-Type", "application/json")
    .post (
      packed,
      function (err, rawData) {
        callback (err);
      }
    );
};

// callback (data, err)
gServer.listSubmissions = function (callback) {
  var listSubmissions_url = "/api/listSubmissions.php";
  try {
    d3.xhr (gServer.url_prefix + listSubmissions_url)
      .header ("Content-Type", "application/json")
      .get (
        function (err, rawData) {
          var data = rawData ? JSON.parse (rawData.response) : null;
          callback (data, err);

          // example of accessing values in data:
          // console.log (data[0]['pset_id']);
          // console.log (data[0]['problem_id']);
        });
  } catch (err) {
    console.error ("Could not connect to server");
  }
};

// callback (err, data)
gServer.loadSubmission = function (pset, problem, callback) {
  var loadFromSubmissions_url = "/api/loadFromSubmissions.php";
  var full_url = gServer.url_prefix + loadFromSubmissions_url + "?problem=" + problem + "&pset=" + pset;
  
  d3.xhr (full_url)
    .header ("Content-Type", "application/json")
    .get (
      function (err, rawData) {
        if (err) callback (err, null);
        else callback (err, JSON.parse (rawData.response));
    });
};

// callback (err, data)
gServer.listSaved = function (callback) {
  var listSaved_url = "/api/listSaved.php";
  try {
  d3.xhr (gServer.url_prefix + listSaved_url)
    .header ("Content-Type", "application/json")
    .get (function (err, data) {
      if (err) callback (err, null);
      else callback (err, JSON.parse (data.response));
    });
  } catch (err) {
    console.error ("Could not connect to server");
  }
}

// callback (sunetid)
gServer.getSunetid = function (callback) {
  var getSunetid_url = "/api/getSunetid.php";
  try {
  d3.xhr (gServer.url_prefix + getSunetid_url)
    .header ("Content-Type", "application/json")
    .get (function (err, data) {
      if (err) callback (null)
      else callback (data.response);
    });
  } catch (err) {
    console.error ("Could not connect to server");
  }
};