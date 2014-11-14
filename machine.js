var buildMachine = function (data) {
  var nodeNum = 0;
  data.nodes.forEach(function (d) { 
    d.index = nodeNum++; 
    d.name = "" + d.index;
  });
  data.links.forEach(function (d) { 
    d.source = data.nodes[d.source]; 
    d.target = data.nodes[d.target]; 
  });
  
  function findNode(index) {
    for(var i = 0; i < data.nodes.length; i++) {
      if(data.nodes[i].index == index) {
        return i;
      }
    }
    return -1;
  }
  
  function areLinked(index1, index2) {
    for(var i = 0; i < data.links.length; i++) {
      if(data.links[i].source.index == index1 || data.links[i].target.index == index2) {
        return true;
      }
    }
    return false;
  }
  
  return {
    getData: function() {
      return data;
    },
    addNode: function(node) {
      node.index = nodeNum++;
      data.nodes.push(node);
    },
    addLink: function(startNode, endNode) {
      var link = {
        source: data.nodes[findNode(startNode)],
        target: data.nodes[findNode(endNode)]
      };
      data.links.push(link);
    },
    deleteNode: function(num) {
      for(var i = 0; i < data.links.length; i++) {
        if(data.links[i].source.index == num || data.links[i].target.index == num) {
          data.links.splice(i, 1);
          i--;
        }
      }
      for(var i = 0; i < data.nodes.length; i++) {
        if(data.nodes[i].index == num) {
          data.nodes.splice(i, 1);
          i--;
        }
      }
    }
  }
}