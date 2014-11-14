var setupGUI = function (width, height, element, machine) {
  var nodeRadius = 30,
    shiftKey, ctrlKey, linkStart;
    
  d3.select("body")
      .on("keydown.brush", keydown)
      .on("keyup.brush", keyup)
      .each(function() { this.focus(); });
      
  var svg = d3.select(element).append("svg")
      .attr("width", width)
      .attr("height", height);

  var link = svg.append("g")
      .attr("class", "link");
      
  var mouseLine = svg.append("line").classed("link hidden", true);

  var brush = buildBrush();
  brush.on("mouseup", function () {
      mouseLine.classed("hidden", true);
    })
    .on("mousemove", function (d) {
      if(ctrlKey) {
        mouseLine.attr("x2", d3.mouse(svg[0][0])[0]).attr("y2", d3.mouse(svg[0][0])[1]);
      }
    });

  var node = svg.append("g")
      .attr("class", "node");

  var graph = machine.getData();
  
  _update();

  function _update() {
    graph = machine.getData();
    var links = link.selectAll("line").data(graph.links);
    
    links.enter().append("line")
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
        
    links
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; })
        
    links.exit().remove();

    var nodes = node.selectAll("g").data(graph.nodes);
    var nodeGroup = nodes.enter().append("g");
      
    nodeGroup.append("circle")
        .attr("r", nodeRadius)
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .on("mousedown", function(d) {
          if(ctrlKey) {
            linkStart = d.index;
            mouseLine.classed("hidden", false)
              .attr("x1", d.x)
              .attr("y1", d.y)
              .attr("x2", d.x)
              .attr("y2", d.y);
          } else {
            if (!d.selected) {
              if (!shiftKey) node.selectAll("g").select("circle").classed("selected", function(p) { return p.selected = d === p; });
              else d3.select(this).classed("selected", d.selected = true);
            }
          }
        })
        .on("mousemove", function(d) {
          if(ctrlKey) {
            mouseLine.attr("x2", d.x).attr("y2", d.y);
          }
        })
        .on("mouseup", function(d) {
          if(ctrlKey) {
            mouseLine.classed("hidden", true);
            machine.addLink(linkStart, d.index);
            _update();
          }
        })
        .call(d3.behavior.drag()
          .on("drag", function(d) { 
            if(!ctrlKey) {
              moveSelected(d3.event.dx, d3.event.dy); 
            }
          }));
          
    nodes.select("circle").attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .classed("selected", function(d) { return d.selected; });
          
    nodes.exit().remove();
  }

  function moveSelected(dx, dy) {
    node.selectAll("g").select("circle").filter(function(d) { return d.selected; })
        .attr("cx", function(d) { return d.x += dx; })
        .attr("cy", function(d) { return d.y += dy; })

    link.selectAll("line").filter(function(d) { return d.source.selected; })
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; });

    link.selectAll("line").filter(function(d) { return d.target.selected; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
  }

  function keydown() {
    shiftKey = d3.event.shiftKey || d3.event.metaKey;
    ctrlKey = d3.event.ctrlKey;
  }

  function keyup() {
    shiftKey = d3.event.shiftKey || d3.event.metaKey;
    ctrlKey = d3.event.ctrlKey;
    if (!ctrlKey)  mouseLine.classed("hidden", true);
  }
  
  function buildBrush() {
    var brush = svg.append("g")
      .datum(function() { return {selected: false, previouslySelected: false}; })
      .attr("class", "brush");

    brush.call(d3.svg.brush()
          .x(d3.scale.identity().domain([0, width]))
          .y(d3.scale.identity().domain([0, height]))
          .on("brushstart", function(d) {
            node.selectAll("g").select("circle").each(function(d) { d.previouslySelected = shiftKey && d.selected; });
          })
          .on("brush", function() {
            var extent = d3.event.target.extent();
            node.selectAll("g").select("circle").classed("selected", function(d) {
              return d.selected = d.previouslySelected ^
                  (extent[0][0] <= d.x && d.x < extent[1][0]
                  && extent[0][1] <= d.y && d.y < extent[1][1]);
            });
          })
          .on("brushend", function() {
            d3.event.target.clear();
            d3.select(this).call(d3.event.target);
          }));

    brush.select(".background").style("cursor", "auto");
    return brush;
  }
  
  return {
    svg: svg,
    updateGraph: function() {
      _update();
    },
    getSelected: function() {
      var selected = [];
      graph.nodes.forEach(function(d) {
        if(d.selected) selected.push(d.index);
      });
      return selected;
    }
  }
}