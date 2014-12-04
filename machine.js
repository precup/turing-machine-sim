var buildMachine = function (dataArg) {
  var nodeNum = 0;
  dataArg.start = null;
  dataArg.nodes.forEach(function (d) { 
    d.index = nodeNum++; 
    d.name = "n" + d.index;
  });
  dataArg.links.forEach(function (d) { 
    d.source = dataArg.nodes[d.source]; 
    d.target = dataArg.nodes[d.target]; 
    d.transitions = [
      { fromChar: "1", toChar: "0", direction: true },
      { fromChar: "1", toChar: "0", direction: true },
      { fromChar: "0", toChar: "0", direction: true }
    ];
  });
  
  var machine = {
    data: dataArg,
    setState: function (accept, reject) {
      machine.data.nodes.filter(function(d) { return d.selected; })
        .forEach(function(d) {
          d.reject = reject;
          d.accept = accept;
        });
    },
    setStart: function () {
      var allSelected = machine.data.nodes.filter(function(d) { return d.selected; });
      machine.data.start = allSelected.length == 0 ? null : allSelected[0];
    },
    findNode: function (index) {
      for(var i = 0; i < machine.data.nodes.length; i++) {
        if(machine.data.nodes[i].index == index) {
          return i;
        }
      }
      return -1;
    },
    areLinked: function (index1, index2) {
      for(var i = 0; i < machine.data.links.length; i++) {
        if(machine.data.links[i].source.index == index1 && machine.data.links[i].target.index == index2) {
          return true;
        }
      }
      return false;
    },
    setData: function(newData) { 
      machine.data = newData; 
      machine.data.links.forEach(function (d) { 
        d.source = machine.data.nodes[machine.findNode(d.source)]; 
        d.target = machine.data.nodes[machine.findNode(d.target)]; 
      });
      machine.data.start = machine.data.start == -1 ? null : machine.data.nodes[machine.findNode(machine.data.start)];
      nodeNum = 0;
      machine.data.nodes.forEach(function (d) { 
        nodeNum = Math.max(nodeNum, d.index + 1);
      });
    },
    getSaveData: function() {
      var saveData = JSON.parse(JSON.stringify(machine.data));
      saveData.links.forEach(function(link){
        link.source = link.source.index;
        link.target = link.target.index;
      });
      saveData.start = saveData.start != null ? saveData.start.index : -1;
      return saveData;
    },
    getData: function() {
      return machine.data;
    },
    addNode: function(node) {
      node.transitions = [];
      node.index = nodeNum++;
      node.name = "n" + node.index;
      machine.data.nodes.push(node);
    },
    addLink: function(startNode, endNode) {
        var link = {
          source: machine.data.nodes[machine.findNode(startNode)],
          target: machine.data.nodes[machine.findNode(endNode)],
          transitions: []
        };
        machine.data.links.push(link);
        openEdge({
          fromChar: BLANK,
          toChar: BLANK,
          fromNode: link.source.name,
          toNode: link.target.name,
          direction: true
        });
    },
    toggleLink: function(startNode, endNode) {
      if(machine.areLinked(startNode, endNode)) {
        for(var i = 0; i < machine.data.links.length; i++) {
          if(machine.data.links[i].source.index == startNode && machine.data.links[i].target.index == endNode) {
            machine.data.links.splice(i, 1);
            i--;
          }
        }
      } else {
        this.addLink(startNode, endNode);
      }
    },
    deleteNode: function(num) {
      for(var i = 0; i < machine.data.links.length; i++) {
        if(machine.data.links[i].source.index == num || machine.data.links[i].target.index == num) {
          machine.data.links.splice(i, 1);
          i--;
        }
      }
      for(var i = 0; i < machine.data.nodes.length; i++) {
        if(machine.data.nodes[i].index == num) {
          machine.data.nodes.splice(i, 1);
          i--;
        }
      }
    },
    removeTransition: function(node, transition) {
      var link = machine.data.links.filter(function (link) {
        return link.source.name == node && link.target.name == transition.toNode;
      });
      var i;
      for(i = 0; i < link[0].transitions.length; i++){
        if(link[0].transitions[i].fromChar == transition.fromChar) break;
      }
      link[0].transitions.splice(i, 1);
      if(link[0].transitions.length == 0) 
        machine.toggleLink(machine.data.nodes.filter(function (node) { return node.name == transition.fromNode; })[0].index,
                           machine.data.nodes.filter(function (node) { return node.name == transition.toNode; })[0].index);
    },
    addTransition: function(node, transition) {
      var link = machine.data.links.filter(function (link) {
        return link.source.name == node && link.target.name == transition.toNode;
      });
      if(link.length == 0) {
        machine.toggleLink(machine.data.nodes.filter(function (node) { return node.name == transition.fromNode; })[0].index,
                   machine.data.nodes.filter(function (node) { return node.name == transition.toNode; })[0].index);
        link = machine.data.links.filter(function (link) {
            return link.source.name == node && link.target.name == transition.toNode;
          });
      }
      link[0].transitions.push(transition);
    }
  }
  
  return machine;
}
