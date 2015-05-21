var gTableMenu =
  {
  };

gTableMenu.updateAll = function () {
  var charSet = gGraph.charSet;
  if (gGraph.epsilonEnabled) {
    charSet += gEpsilon;
  }
  if (gGraph.mode == gGraph.TM) {
    charSet = gGraph.tapeSet;
  }
  charSet = charSet.split("");

  gEdges.edges = [];

  var map = [];
  gNodes.nodes.forEach (function (node) {
    gEdges.edgeMap[node.id] = [];
    var arr = [];
    gNodes.nodes.forEach (function () {
      arr.push (gGraph.mode == gGraph.TM ? {} : "");
    });
    map.push (arr);
  });

  var extraNames = false;
  var badNames = false;
  var badChars = false;
  d3.selectAll ("input.gridInput")
    .each (function (junk, i) {
      var isName = i % 2 == 0 || gGraph.mode != gGraph.TM;
      var character = this.character;
      var i1 = this.i1;
      
      if (isName) {
        var nodes = this.value.split(/[ \t\n\r,]/);
        var foundOne = false;
        nodes.forEach (function (nodeName) {
          var nodeIndex = gNodes.getNodeIndexFromName (nodeName);
          if (nodeIndex != -1) {
            if (!foundOne || gGraph.mode == gGraph.NFA) {
              if (gGraph.mode == gGraph.TM) {
                map[i1][nodeIndex][character] = {
                    from: character
                  };
              } else {
                map[i1][nodeIndex] += character;
              }
            } else {
              extraNames = true;
            }
            foundOne = true;
          } else if (nodeName != "") {
            badNames = true;
          }
        });
      } else {
        var to = this.value;
        if (intersection (to, gGraph.tapeSet).length != to.length) {
          this.value = intersection (to, gGraph.tapeSet);
          badChars = true;
          return;
        }
        var nodeIndex = -1;
        for (var prop in map[i1]) {
          if (map[i1][prop][character] != undefined) {
            nodeIndex = prop;
            break;
          }
        }
        if (nodeIndex != -1 && map[i1][nodeIndex][character] != undefined) {
          map[i1][nodeIndex][character].to = to == "" ? " " : to;
        }
      }
    });
  d3.selectAll (".moveRight")
    .each (function () {
      var character = this.character;
      var i1 = this.i1;
      var direction = this.checked ? 1 : -1;
      var nodeIndex = -1;
      for (var prop in map[i1]) {
        if (map[i1][prop][character] != undefined) {
          nodeIndex = prop;
          break;
        }
      }
      if (nodeIndex != -1 && map[i1][nodeIndex][character] != undefined) {
        map[i1][nodeIndex][character].direction = direction;
      }
    });
    
  if (extraNames) {
    gErrorMenu.displayError ("Multiple transitions defined for one character, ignoring extras");
  }
  if (badNames) {
    gErrorMenu.displayError ("Some states entered in the table could not be found, ignoring them");
  }
  if (badChars) {
    gErrorMenu.displayError ("Some characters were not in the tape language");
  }

  map.forEach (function (row, i1) {
    row.forEach (function (transitions, i2) {
      var transitionsArray = [];
      if (gGraph.mode == gGraph.TM) {
        for (var prop in transitions) {
          transitionsArray.push (transitions[prop]);
        }
      }
      if (transitions == "" || (gGraph.mode == gGraph.TM && transitionsArray.length == 0)) {
        return;
      }
      var edge = gEdges.getEdge (gNodes.nodes[i1], gNodes.nodes[i2]);
      if (edge == null) {
        gEdges.addEdge (gNodes.nodes[i1], gNodes.nodes[i2]);
        edge = gEdges.edges[gEdges.edges.length - 1];
      }
      if (gEdges.edgeMap[gNodes.nodes[i1].id].indexOf (gNodes.nodes[i2].id) == -1) {
        gEdges.edgeMap[gNodes.nodes[i1].id].push (gNodes.nodes[i2].id);
      }
      if (gGraph.mode == gGraph.TM) {
        edge.transitions[0] = transitionsArray;
      } else {
        edge.transitions[0] = transitions.split ("").sort ();
      }
    });
  });
};

gTableMenu.init = function () {
  var charSet = gGraph.charSet;
  if (gGraph.epsilonEnabled) {
    charSet += gEpsilon;
  }
  if (gGraph.mode == gGraph.TM) {
    charSet = gGraph.tapeSet;
  }
  charSet = charSet.split("");
  var header = d3.select (".tableEditor").insert("tr").selectAll ("td").data (charSet);

  header.enter ()
    .append ("td");

  header.text (function (inputChar) {
      return inputChar == " " && gGraph.mode == gGraph.TM ? gSquare : inputChar;
    });

  header.exit ().remove ();

  var headerTr = d3.select (".tableEditor").select("tr");
  headerTr.insert ("td", "td").text ("Rejects");
  headerTr.insert ("td", "td").text ("Accepts");
  headerTr.insert ("td", "td").text ("Initial");
  headerTr.insert ("td", "td").text ("");
  headerTr.append ("td").text ("Delete");
};

gTableMenu.draw = function () {
  if (!gTableTopMenu.active) {
    return;
  }
  var charSet = gGraph.charSet;
  if (gGraph.epsilonEnabled) {
    charSet += gEpsilon;
  }
  if (gGraph.mode == gGraph.TM) {
    charSet = gGraph.tapeSet;
  }
  charSet = charSet.split("");

  var table = d3.select (".tableEditor")
    .selectAll ("tr")
    .filter (function (junk, i) { return i != 0; })
    .data (gNodes.nodes);

  table.exit ().remove ();
  
  var newRows = table.enter ().append ("tr");

  newRows.append ("td")
    .text (function (node) {
      return node.name;
    });

  newRows.append ("td")
    .append ("input")
    .attr ("type", "radio")
    .classed ("initialBox", true)
    .each (function (node) {
      this.checked = gNodes.initial != null && gNodes.initial.id == node.id;
    })
    .on ("change", function (node, i) {
      if (this.checked) {
        gNodes.setInitialByIndex (i);
      } else {
        gNodes.clearInitial ();
      }
      gGraph.draw ();
    });

  newRows.append ("td")
    .append ("input")
    .attr ("type", "checkbox")
    .classed ("acceptBox", true)
    .on ("change", function (node, i) {
      gNodes.setAcceptByIndex (i, this.checked);
      if (this.checked) {
        gNodes.setRejectByIndex (i, false);
      }
      gGraph.draw ();
    });
    
  newRows.append ("td")
    .append ("input")
    .attr ("type", "checkbox")
    .classed ("rejectBox", true)
    .on ("change", function (node, i) {
      gNodes.setRejectByIndex (i, this.checked);
      if (this.checked) {
        gNodes.setAcceptByIndex (i, false);
      }
      gGraph.draw ();
    });
    
  d3.selectAll (".acceptBox")
    .each (function (junk, i) {
      this.checked = gNodes.nodes[i].accept;
    });
  d3.selectAll (".rejectBox")
    .each (function (junk, i) {
      this.checked = gNodes.nodes[i].reject;
    });
  
  table.select ("td")
    .text (function (node) {
      return node.name;
    });
    
  var rows = table.selectAll ("td")
    .filter (function () {
      return d3.select (this)
        .select ("input")
        .filter (function () { return this.type == "text"; })
        .node () != null;
    })
    .data (charSet);

  var td = rows.enter ()
    .append ("td")
    .classed ("tm-cell", gGraph.mode == gGraph.TM)
    .each (function () {
      if (gGraph.mode == gGraph.TM) {
        d3.select (this).style ("line-height", "30px");
      }
    });
  td.append ("input")
    .attr ("type", "text")
    .attr ("size", "10")
    .attr ("placeholder", "go to")
    .classed ("gridInput", true)
    .each (function (character, i2, i1) {
      this.character = character;
      this.i1 = i1;
    });
  td.append ("input")
    .attr ("type", "text")
    .attr ("size", "10")
    .attr ("maxlength", "1")
    .attr ("placeholder", "write")
    .classed ("gridInput", true)
    .each (function (character, i2, i1) {
      this.character = character;
      this.i1 = i1;
    });
  td.append ("br");
  var form = td.append ("form");
  form.append ("label")
    .text ("move:");
  form.append ("input")
    .attr ("type", "radio")
    .attr ("name", "move")
    .attr ("checked", true)
    .classed ("moveLeft", true)
    .each (function (character, i2, i1) {
      this.character = character;
      this.i1 = i1;
    });
  form.append ("label")
    .text ("L");
  form.append ("input")
    .attr ("type", "radio")
    .attr ("name", "move")
    .classed ("moveRight", true)
    .each (function (character, i2, i1) {
      this.character = character;
      this.i1 = i1;
    });
  form.append ("label")
    .text ("R");


  rows.selectAll ("input")
    .each (function (character, i2) {
      switch (i2) {
        case 0:
          this.value = gTableMenu.getConnections (gNodes.nodes[this.i1].id, character);
          break;
        case 1:
          var result = gTableMenu.getResult (gNodes.nodes[this.i1].id, character);
          if (result != null) {
            this.value = result;
          }
          break;
        case 2:
          var direction = gTableMenu.getDirection (gNodes.nodes[this.i1].id, character);
          if (direction != 0) {
            this.checked = direction == -1;
          }
          break;
        case 3:
          var direction = gTableMenu.getDirection (gNodes.nodes[this.i1].id, character);
          if (direction != 0) {
            this.checked = direction == 1;
          }
          break;
      }
    })
    .on ("blur", function () {
      gTableMenu.updateAll ();
      gTableMenu.draw ();
    });

  rows.exit ().remove ();

  newRows.append ("td")
    .append ("button")
    .on ("click", function (node, i) {
      gNodes.removeByIndex (i);
      gGraph.draw ();
    })
    .text ("X");
};

gTableMenu.getConnections = function (source, character) {
  var nodes = [];
  gEdges.edges.forEach (function (edge) {
    if (gGraph.mode == gGraph.TM) {
      edge.transitions[0].forEach (function (state) {
        if (edge.source.id == source && state.from == character) {
          nodes.push (edge.target.name);
        }
      });
    } else if (edge.source.id == source && edge.transitions[0].indexOf (character) != -1) {
      nodes.push (edge.target.name);
    }
  });
  return nodes.join (", ");
};


gTableMenu.getDirection = function (source, character) {
  var direction = 0;
  gEdges.edges.forEach (function (edge) {
    edge.transitions[0].forEach (function (state) {
      if (edge.source.id == source && state.from == character) {
        direction = state.direction;
      }
    });
  });
  return direction;
};


gTableMenu.getResult = function (source, character) {
  var result = null;
  gEdges.edges.forEach (function (edge) {
    edge.transitions[0].forEach (function (state) {
      if (edge.source.id == source && state.from == character) {
        result = state.to == " " ? "" : state.to;
      }
    });
  });
  return result;
};
