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
      var data = JSON.parse (data.response);
      data.forEach (function (elem, idx, arr) {
        elem.pset_id = parseInt (elem.pset_id);
        elem.problem_id = parseInt (elem.problem_id);
        elem.problem_number = parseInt (elem.problem_number);
      });
      callback (err, data);
    });
}

if (gradingMock) {
  gServer.getStudentSubmissions = function (students, callback) {
    var problems = [
    {
          problem_number: 1,
          pset_id: 7,
          automata: "{\"nodes\":{\"nodes\":[{\"y\":301.6520597553689,\"x\":384,\"id\":0,\"name\":\"n0\",\"accept\":false,\"reject\":false,\"selected\":false,\"previouslySelected\":false},{\"y\":100,\"x\":625,\"id\":3,\"name\":\"n3\",\"accept\":false,\"reject\":false,\"selected\":false,\"previouslySelected\":false},{\"y\":103.39863022059609,\"x\":836,\"id\":4,\"name\":\"n4\",\"accept\":false,\"reject\":false,\"selected\":false,\"previouslySelected\":false},{\"y\":596.2000122070312,\"x\":712,\"id\":5,\"name\":\"n5\",\"accept\":true,\"reject\":false,\"selected\":false,\"previouslySelected\":false},{\"y\":299.38630627497145,\"x\":627,\"id\":1,\"name\":\"n1\",\"accept\":false,\"reject\":false,\"selected\":false,\"previouslySelected\":false},{\"y\":497.6397358097442,\"x\":389,\"id\":2,\"name\":\"n2\",\"accept\":false,\"reject\":false,\"selected\":false,\"previouslySelected\":false}],\"initial\":0},\"edges\":{\"edgeMap\":{\"0\":[],\"1\":[3],\"2\":[1],\"3\":[],\"4\":[],\"5\":[]},\"edges\":[{\"source\":0,\"target\":1,\"transitions\":[[{\"direction\":1,\"from\":\"1\",\"to\":\"1\"}]],\"selected\":false},{\"source\":0,\"target\":2,\"transitions\":[[{\"direction\":1,\"from\":\"0\",\"to\":\"0\"}]],\"selected\":false},{\"source\":1,\"target\":3,\"transitions\":[[{\"direction\":-1,\"from\":\"0\",\"to\":\"1\"}]],\"selected\":false},{\"source\":3,\"target\":4,\"transitions\":[[{\"direction\":-1,\"from\":\"1\",\"to\":\"0\"}]],\"selected\":false},{\"source\":2,\"target\":1,\"transitions\":[[{\"direction\":1,\"from\":\"1\",\"to\":\"1\"}]],\"selected\":false},{\"source\":2,\"target\":2,\"transitions\":[[{\"direction\":1,\"from\":\"0\",\"to\":\"0\"}]],\"selected\":false},{\"source\":1,\"target\":1,\"transitions\":[[{\"direction\":1,\"from\":\"1\",\"to\":\"1\"}]],\"selected\":false},{\"source\":4,\"target\":4,\"transitions\":[[{\"direction\":1,\"from\":\"0\",\"to\":\"0\"},{\"direction\":1,\"from\":\" \",\"to\":\" \"}]],\"selected\":false},{\"source\":4,\"target\":1,\"transitions\":[[{\"direction\":1,\"from\":\"1\",\"to\":\"1\"}]],\"selected\":false},{\"source\":1,\"target\":5,\"transitions\":[[{\"direction\":1,\"from\":\" \",\"to\":\" \"}]],\"selected\":false},{\"source\":2,\"target\":5,\"transitions\":[[{\"direction\":1,\"from\":\" \",\"to\":\" \"}]],\"selected\":false}]},\"meta\":{\"charSet\":\" 01 \",\"pset\":\"0\",\"problem\":\"0\",\"mode\":\"tm\",\"tapeSet\":\" 01\"}}"
        },
        {
          problem_number: 2,
          pset_id: 7,
          automata: "{\"nodes\":{\"nodes\":[{\"y\":339.22063746402137,\"x\":230,\"id\":0,\"name\":\"n0\",\"accept\":false,\"reject\":false,\"selected\":0,\"previouslySelected\":false},{\"y\":341.30990067331413,\"x\":504,\"id\":1,\"name\":\"n1\",\"accept\":false,\"reject\":false,\"selected\":0,\"previouslySelected\":false},{\"y\":103.49936986019736,\"x\":500.99999999999994,\"id\":2,\"name\":\"n2\",\"accept\":false,\"reject\":false,\"selected\":0,\"previouslySelected\":false},{\"y\":100,\"x\":231,\"id\":3,\"name\":\"n3\",\"accept\":false,\"reject\":false,\"selected\":0,\"previouslySelected\":false},{\"y\":476.0673776726974,\"x\":231,\"id\":4,\"name\":\"n4\",\"accept\":false,\"reject\":false,\"selected\":0,\"previouslySelected\":false},{\"y\":596.2000122070312,\"x\":233,\"id\":5,\"name\":\"n5\",\"accept\":true,\"reject\":false,\"selected\":0,\"previouslySelected\":false}],\"initial\":0},\"edges\":{\"edgeMap\":{\"0\":[1,4],\"1\":[1,2],\"2\":[3],\"3\":[3,0],\"4\":[5,4],\"5\":[]},\"edges\":[{\"source\":0,\"target\":1,\"transitions\":[[{\"direction\":1,\"from\":\"1\",\"to\":\" \"}]],\"selected\":false},{\"source\":2,\"target\":3,\"transitions\":[[{\"direction\":-1,\"from\":\"1\",\"to\":\" \"}]],\"selected\":false},{\"source\":3,\"target\":3,\"transitions\":[[{\"direction\":-1,\"from\":\"1\",\"to\":\"1\"}]],\"selected\":false},{\"source\":3,\"target\":0,\"transitions\":[[{\"direction\":1,\"from\":\" \",\"to\":\"1\"}]],\"selected\":false},{\"source\":1,\"target\":1,\"transitions\":[[{\"direction\":1,\"from\":\"1\",\"to\":\"1\"}]],\"selected\":false},{\"source\":0,\"target\":4,\"transitions\":[[{\"direction\":-1,\"from\":\" \",\"to\":\" \"}]],\"selected\":false},{\"source\":4,\"target\":5,\"transitions\":[[{\"direction\":1,\"from\":\" \",\"to\":\" \"}]],\"selected\":false},{\"source\":4,\"target\":4,\"transitions\":[[{\"direction\":-1,\"from\":\"1\",\"to\":\"1\"}]],\"selected\":false},{\"source\":1,\"target\":2,\"transitions\":[[{\"direction\":-1,\"from\":\" \",\"to\":\" \"}]],\"selected\":false}]},\"meta\":{\"charSet\":\" 1 \",\"pset\":\"0\",\"problem\":\"1\",\"mode\":\"tm\",\"tapeSet\":\" 1\"}}"
        },
        {
          problem_number: 3,
          pset_id: 7,
          automata: "{\"nodes\":{\"nodes\":[{\"y\":282.3689788810665,\"x\":465.3546333171178,\"id\":0,\"name\":\"n0\",\"accept\":false,\"reject\":false,\"selected\":false,\"previouslySelected\":false},{\"y\":287.2360134386272,\"x\":907.2958621340613,\"id\":1,\"name\":\"n1\",\"accept\":false,\"reject\":false,\"selected\":false,\"previouslySelected\":false},{\"y\":136.49846623375166,\"x\":912.199951171875,\"id\":2,\"name\":\"n2\",\"accept\":false,\"reject\":false,\"selected\":false,\"previouslySelected\":false},{\"y\":135.71011364338477,\"x\":791.9270986110305,\"id\":3,\"name\":\"n3\",\"accept\":false,\"reject\":false,\"selected\":false,\"previouslySelected\":false},{\"y\":135.71011364338477,\"x\":667.8460679745585,\"id\":4,\"name\":\"n4\",\"accept\":false,\"reject\":false,\"selected\":false,\"previouslySelected\":false},{\"y\":134.7993896790959,\"x\":561.573215413714,\"id\":5,\"name\":\"n5\",\"accept\":false,\"reject\":false,\"selected\":false,\"previouslySelected\":false},{\"y\":100,\"x\":469.8349382478508,\"id\":6,\"name\":\"n6\",\"accept\":false,\"reject\":false,\"selected\":false,\"previouslySelected\":false},{\"y\":224.96940551607938,\"x\":467,\"id\":7,\"name\":\"n7\",\"accept\":false,\"reject\":false,\"selected\":false,\"previouslySelected\":false},{\"y\":350.58880615234375,\"x\":465.90258879821096,\"id\":8,\"name\":\"n8\",\"accept\":false,\"reject\":false,\"selected\":false,\"previouslySelected\":false},{\"y\":352,\"x\":595,\"id\":9,\"name\":\"n9\",\"accept\":true,\"reject\":false,\"selected\":true}],\"initial\":0},\"edges\":{\"edgeMap\":{\"0\":[8],\"1\":[1],\"2\":[2],\"3\":[],\"4\":[],\"5\":[],\"6\":[6],\"7\":[0],\"8\":[9],\"9\":[]},\"edges\":[{\"source\":0,\"target\":1,\"transitions\":[[{\"from\":\"1\",\"to\":\" \",\"direction\":1}]],\"selected\":false},{\"source\":1,\"target\":1,\"transitions\":[[{\"from\":\"1\",\"to\":\"1\",\"direction\":1}]],\"selected\":false},{\"source\":1,\"target\":2,\"transitions\":[[{\"from\":\" \",\"to\":\" \",\"direction\":1}]],\"selected\":false},{\"source\":2,\"target\":2,\"transitions\":[[{\"from\":\"1\",\"to\":\"1\",\"direction\":1}]],\"selected\":false},{\"source\":2,\"target\":3,\"transitions\":[[{\"from\":\" \",\"to\":\"1\",\"direction\":1}]],\"selected\":false},{\"source\":3,\"target\":4,\"transitions\":[[{\"from\":\" \",\"to\":\"1\",\"direction\":1}]],\"selected\":false},{\"source\":4,\"target\":5,\"transitions\":[[{\"from\":\" \",\"to\":\"1\",\"direction\":1}]],\"selected\":false},{\"source\":5,\"target\":6,\"transitions\":[[{\"from\":\" \",\"to\":\" \",\"direction\":-1}]],\"selected\":false},{\"source\":6,\"target\":6,\"transitions\":[[{\"from\":\"1\",\"to\":\"1\",\"direction\":-1}]],\"selected\":false},{\"source\":6,\"target\":7,\"transitions\":[[{\"from\":\" \",\"to\":\" \",\"direction\":-1}]],\"selected\":false},{\"source\":7,\"target\":0,\"transitions\":[[{\"from\":\" \",\"to\":\" \",\"direction\":1}]],\"selected\":false},{\"source\":7,\"target\":7,\"transitions\":[[{\"from\":\"1\",\"to\":\"1\",\"direction\":-1}]],\"selected\":false},{\"source\":0,\"target\":8,\"transitions\":[[{\"direction\":1,\"from\":\" \",\"to\":\"1\"}]],\"selected\":false},{\"source\":8,\"target\":9,\"transitions\":[[{\"direction\":-1,\"from\":\"1\",\"to\":\"1\"}]],\"selected\":false}]},\"meta\":{\"charSet\":\" 1 \",\"pset\":\"0\",\"problem\":\"1\",\"mode\":\"tm\",\"tapeSet\":\" 1\"}}"
        },
        {
          problem_number: 4,
          pset_id: 7,
          automata: "{\"nodes\":{\"nodes\":[{\"y\":100,\"x\":343,\"id\":0,\"name\":\"n0\",\"accept\":false,\"reject\":false,\"selected\":0,\"previouslySelected\":false},{\"y\":183.79181497594533,\"x\":341,\"id\":1,\"name\":\"n1\",\"accept\":false,\"reject\":false,\"selected\":0,\"previouslySelected\":false},{\"y\":183.07906842923308,\"x\":485,\"id\":2,\"name\":\"n2\",\"accept\":true,\"reject\":false,\"selected\":0,\"previouslySelected\":false},{\"y\":262.90668166098794,\"x\":339,\"id\":3,\"name\":\"n3\",\"accept\":false,\"reject\":false,\"selected\":0,\"previouslySelected\":false},{\"y\":351.2872534532879,\"x\":338,\"id\":4,\"name\":\"n4\",\"accept\":false,\"reject\":false,\"selected\":0,\"previouslySelected\":false},{\"y\":264.3321747544121,\"x\":495,\"id\":5,\"name\":\"n5\",\"accept\":false,\"reject\":false,\"selected\":0,\"previouslySelected\":false},{\"y\":352,\"x\":490,\"id\":6,\"name\":\"n6\",\"accept\":false,\"reject\":false,\"selected\":0,\"previouslySelected\":false},{\"y\":101.25225781401073,\"x\":677.0000000000001,\"id\":7,\"name\":\"half_\",\"accept\":false,\"reject\":false,\"selected\":0,\"previouslySelected\":false},{\"y\":191.0129316599595,\"x\":797.9999999999999,\"id\":8,\"name\":\"trip_\",\"accept\":false,\"reject\":false,\"selected\":0,\"previouslySelected\":false},{\"y\":200.4986976550769,\"x\":678,\"id\":9,\"name\":\"half\",\"accept\":false,\"reject\":false,\"selected\":0,\"previouslySelected\":false},{\"y\":251.54266821102416,\"x\":799,\"id\":10,\"name\":\"trip\",\"accept\":false,\"reject\":false,\"selected\":0,\"previouslySelected\":false}],\"initial\":0},\"edges\":{\"edgeMap\":{\"0\":[],\"1\":[2],\"2\":[],\"3\":[4],\"4\":[3],\"5\":[9],\"6\":[10],\"7\":[7,0],\"8\":[8,0],\"9\":[],\"10\":[]},\"edges\":[{\"source\":0,\"target\":1,\"transitions\":[[{\"direction\":1,\"from\":\"1\",\"to\":\"1\"}]],\"selected\":false},{\"source\":1,\"target\":2,\"transitions\":[[{\"direction\":1,\"from\":\" \",\"to\":\" \"}]],\"selected\":false},{\"source\":1,\"target\":3,\"transitions\":[[{\"direction\":1,\"from\":\"1\",\"to\":\"1\"}]],\"selected\":false},{\"source\":3,\"target\":4,\"transitions\":[[{\"direction\":1,\"from\":\"1\",\"to\":\"1\"}]],\"selected\":false},{\"source\":4,\"target\":3,\"transitions\":[[{\"direction\":1,\"from\":\"1\",\"to\":\"1\"}]],\"selected\":false},{\"source\":3,\"target\":5,\"transitions\":[[{\"direction\":-1,\"from\":\" \",\"to\":\" \"}]],\"selected\":false},{\"source\":5,\"target\":5,\"transitions\":[[{\"direction\":-1,\"from\":\"1\",\"to\":\"1\"}]],\"selected\":false},{\"source\":4,\"target\":6,\"transitions\":[[{\"direction\":-1,\"from\":\" \",\"to\":\" \"}]],\"selected\":false},{\"source\":6,\"target\":6,\"transitions\":[[{\"direction\":-1,\"from\":\"1\",\"to\":\"1\"}]],\"selected\":false},{\"source\":5,\"target\":9,\"transitions\":[[{\"direction\":1,\"from\":\" \",\"to\":\" \"}]],\"selected\":false},{\"source\":6,\"target\":10,\"transitions\":[[{\"direction\":1,\"from\":\" \",\"to\":\" \"}]],\"selected\":false},{\"source\":7,\"target\":7,\"transitions\":[[{\"direction\":-1,\"from\":\"1\",\"to\":\"1\"}]],\"selected\":false},{\"source\":7,\"target\":0,\"transitions\":[[{\"direction\":1,\"from\":\" \",\"to\":\" \"}]],\"selected\":false},{\"source\":8,\"target\":8,\"transitions\":[[{\"direction\":-1,\"from\":\"1\",\"to\":\"1\"}]],\"selected\":false},{\"source\":8,\"target\":0,\"transitions\":[[{\"direction\":1,\"from\":\" \",\"to\":\" \"}]],\"selected\":false}]},\"meta\":{\"charSet\":\" 1 \",\"pset\":\"0\",\"problem\":\"3\",\"mode\":\"tm\",\"tapeSet\":\" 1\"}}"
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