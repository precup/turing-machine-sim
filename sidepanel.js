function buildSidePanel(element) {
  var root = d3.select(element);
  function _update(machine) {
    var graph = machine.getData();
    var divs = root.selectAll("div.sideEntryDiv").data(graph.nodes, function(d) { return d.name; });
    var newDivs = divs.enter()
      .append("div")
      .classed("sideEntryDiv", true);
    newDivs.append("div")
      .classed("nameDiv", true);
    newDivs.append("div")
      .classed("edgeDiv", true)
      .append("button")
      .text("+");
      
    divs.select("div.nameDiv")
      .text(function (d) { return d.name; });
    
    var edgeDiv = divs.select("div.edgeDiv").selectAll("div.transitionDiv")
      .data(function (d, i) { 
        var transitions = [];
        graph.links.filter(function (e) {
            return e.source.index == graph.nodes[i].index;
          }).forEach(function (e) {
            e.transitions.forEach(function (t) {
              var transition = JSON.parse(JSON.stringify(t));
              transition.fromNode = e.source.name;
              transition.toNode = e.target.name;
              transitions.push(transition);
            });
          });
        return transitions;
      });
    
    var edgeDivEnter = edgeDiv.enter()
      .append("div")
      .classed("transitionDiv", true);
      
    edgeDivEnter.append("button").text(function(d) { 
        return d.fromChar + " -> " + d.toChar + ", " + (d.direction ? "R" : "L");
      });
    
    edgeDiv.exit().remove();
    
    divs.exit().remove();
  }
  return {
    update: function(machine) { return _update(machine); }
  };
}
