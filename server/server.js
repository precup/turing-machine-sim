var gServer = {};

gServer.url_prefix = "/class/cs103/cgi-bin/turing";

gServer.name = "";

gServer.changeName = function (name) {
  var new_url = setURLParam ("saved", name, window.location.href);
  window.history.pushState ({}, "", new_url);
  gServer.name = name;
};

// callback (err, data)
gServer.save = function (name, callback) {
  // gServer.changeName (name);
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

// selected is the name of the automaton to load
// callback (err, res)
gServer.load = function (selected, callback) {

  var get_url = "/api/loadFromSaved.php" + "?name=" + selected;
  d3.xhr (gServer.url_prefix + get_url)
    .header ("Content-Type", "application/json")
    .get (function (err, res) {
      var json_data = null;
      if (!err && res.response) {
        json_data = JSON.parse (res.response);
      }
      callback (err, json_data ? JSON.parse (json_data[0]["automata"]) : null);
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
  }
};

/*
students is an array of sunetIDs: ["maxwang7", "mprecup"]
callback (err, data), where data has the format:
[
  {
    user_id: <sunetid>,
    problem_id: <database problem id, probably not used>,
    problem_number: <problem number in the pset, matches to "id" in the problems array in psets>,
    pset_id: <pset id, matches to "id" in psets>,
    automata: <automata as JSON string>
  }
]
*/
gServer.getStudentSubmissions = function (students, callback) {
  var getStudentSubmissions_url = "api/TAGetStudentSubmissions.php";
  d3.xhr(getStudentSubmissions_url)
    .post(JSON.stringify(students), function (err, data) {
      callback (err, data.response);
    });
}

if (gradingMock) {
  gServer.getStudentSubmissions = function (students, callback) {
    var problems = [
        {
          problem_number: 1,
          pset_id: 7,
          automata: "{\"nodes\":{\"nodes\":[{\"y\":301.6520597553689,\"x\":384,\"id\":0,\"name\":\"n0\",\"accept\":false,\"reject\":false,\"selected\":false,\"previouslySelected\":false},{\"y\":100,\"x\":625,\"id\":3,\"name\":\"n3\",\"accept\":false,\"reject\":false,\"selected\":false,\"previouslySelected\":false},{\"y\":103.39863022059609,\"x\":836,\"id\":4,\"name\":\"n4\",\"accept\":false,\"reject\":false,\"selected\":false,\"previouslySelected\":false},{\"y\":596.2000122070312,\"x\":712,\"id\":5,\"name\":\"n5\",\"accept\":true,\"reject\":false,\"selected\":false,\"previouslySelected\":false},{\"y\":299.38630627497145,\"x\":627,\"id\":1,\"name\":\"n1\",\"accept\":false,\"reject\":false,\"selected\":false,\"previouslySelected\":false},{\"y\":497.6397358097442,\"x\":389,\"id\":2,\"name\":\"n2\",\"accept\":false,\"reject\":false,\"selected\":false,\"previouslySelected\":false}],\"initial\":0},\"edges\":{\"edgeMap\":{\"0\":[],\"1\":[3],\"2\":[1],\"3\":[],\"4\":[],\"5\":[]},\"edges\":[{\"source\":0,\"target\":1,\"transitions\":[[{\"direction\":1,\"from\":\"1\",\"to\":\"1\"}]],\"selected\":false},{\"source\":0,\"target\":2,\"transitions\":[[{\"direction\":1,\"from\":\"0\",\"to\":\"0\"}]],\"selected\":false},{\"source\":1,\"target\":3,\"transitions\":[[{\"direction\":-1,\"from\":\"0\",\"to\":\"1\"}]],\"selected\":false},{\"source\":3,\"target\":4,\"transitions\":[[{\"direction\":-1,\"from\":\"1\",\"to\":\"0\"}]],\"selected\":false},{\"source\":2,\"target\":1,\"transitions\":[[{\"direction\":1,\"from\":\"1\",\"to\":\"1\"}]],\"selected\":false},{\"source\":2,\"target\":2,\"transitions\":[[{\"direction\":1,\"from\":\"0\",\"to\":\"0\"}]],\"selected\":false},{\"source\":1,\"target\":1,\"transitions\":[[{\"direction\":1,\"from\":\"1\",\"to\":\"1\"}]],\"selected\":false},{\"source\":4,\"target\":4,\"transitions\":[[{\"direction\":1,\"from\":\"0\",\"to\":\"0\"},{\"direction\":1,\"from\":\" \",\"to\":\" \"}]],\"selected\":false},{\"source\":4,\"target\":1,\"transitions\":[[{\"direction\":1,\"from\":\"1\",\"to\":\"1\"}]],\"selected\":false},{\"source\":1,\"target\":5,\"transitions\":[[{\"direction\":1,\"from\":\" \",\"to\":\" \"}]],\"selected\":false},{\"source\":2,\"target\":5,\"transitions\":[[{\"direction\":1,\"from\":\" \",\"to\":\" \"}]],\"selected\":false}]},\"meta\":{\"charSet\":\" 01 \",\"pset\":\"0\",\"problem\":\"0\",\"mode\":\"tm\",\"tapeSet\":\" 01\"}}"
        }
      ];
    var data = [];
    for (var i = 0; i < students.length; i++) {
      for (var j = 0; j < problems.length; j++) {
        var submission = JSON.parse (JSON.stringify (problems[j]));
        submission.user_id = students[i];
        data.push (submission);
      }        
    }
    callback (null, data);
  }
}