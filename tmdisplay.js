var setupGUI = function (width, height, element, machine, sidePanel, updateSelected) {
  var nodeRadius = 30, innerRadius = 24, shiftKey, ctrlKey, linkStart, mouseData, BIDIRECTIONAL_OFFSET = 8;
    
  d3.select("body")
      .on("keydown.brush", keydown)
      .on("keyup.brush", keyup)
      .each(function() { this.focus(); });
      
  var svg = d3.select(element).append("svg")
      .attr("id", "vis")
      .attr("width", width)
      .attr("height", height);
      
  buildMarker('end-arrow', 36, 'black');
  buildMarker('light-arrow', 36, '#999')
    .classed("double", true);
  buildMarker('mouse-arrow', 13, 'black');

  var link = svg.append("g")
      .attr("class", "link");
      
  var mouseLine = svg.append("path").classed("hidden", true)
        .style('marker-end', function() { 
            return machine.areLinked(linkStart, linkStart) ? 'url(#light-arrow)' : 'url(#end-arrow)';
          })
        .attr("fill", "none")
        .classed('double', machine.areLinked(linkStart, linkStart));
  var mouseBiLine = svg.append("path").classed("hidden", true)
        .style('marker-end', 'url(#end-arrow)')
        .attr("fill", "none");
  
  var startLine = svg.append("path").classed("hidden", true)
        .style('marker-end', 'url(#end-arrow)')
        .attr("fill", "none");

  var brush = buildBrush();
  brush.on("mouseup", function () {
      mouseLine.classed("hidden", true);
    })
    .on("mousemove", function (d) {
      if(!mouseLine.classed("hidden")) {
        mouseData[1].x = d3.mouse(svg[0][0])[0];
        mouseData[1].y = d3.mouse(svg[0][0])[1];
        mouseLine.attr("d", lineFunction(mouseData))
          .style('marker-end', 'url(#mouse-arrow)')
          .classed('double', false);
      }
    });

  var node = svg.append("g")
      .attr("class", "node");
      
  var transitions = svg.append("g")
      .attr("class", "transitions");

  var graph = machine.getData();
  
  var straightLineFunction = d3.svg.line()
      .x(function(d) { return d.x; })
      .y(function(d) { return d.y; })
      .interpolate("linear");
  var curvedLineFunction = d3.svg.line()
      .x(function(d) { return d.x; })
      .y(function(d) { return d.y; })
      .interpolate("basis");
  var lineFunction = function(data) {
    if(data[0].x == data[1].x && data[0].y == data[1].y) {
      return curvedLineFunction([
        { x: data[0].x, y: data[0].y },
        { x: data[0].x + 50, y: data[0].y - 40 },
        { x: data[0].x + 70, y: data[0].y },
        { x: data[0].x + 50, y: data[0].y + 40 },
        { x: data[0].x, y: data[0].y },
      ]);
    } else {
      return straightLineFunction(data);
    }
  }
      
  _update();
  
  function getTextPos(source, target, bbox) {
    var midpoint = { x : (source.x + target.x) / 2, y : (source.y + target.y) / 2 };
    var theta = Math.atan2(target.y - source.y, target.x - source.x);
    var dist = Math.sqrt(Math.pow(bbox.height / 2, 2) + Math.pow(bbox.width / 2, 2));
    var q = Math.cos(Math.atan2(bbox.height / 2, bbox.width / 2) - theta);
    q = Math.min(q, Math.cos(Math.atan2(bbox.height / 2, -bbox.width / 2) - theta));
    q = Math.min(q, Math.cos(Math.atan2(-bbox.height / 2, bbox.width / 2) - theta));
    q = Math.min(q, Math.cos(Math.atan2(-bbox.height / 2, -bbox.width / 2) - theta));
    q *= dist;
    q -= 5;
    return {
      x: midpoint.x + Math.cos(theta + Math.PI / 2) * q,
      y: midpoint.y - bbox.height / 2 + Math.sin(theta + Math.PI / 2) * q
    };
  }

  function _update() {
    sidePanel.update(machine);
    graph = machine.getData();
    
    startLine.attr("d", function(d) { 
        if(graph.start == null) return "";
        return lineFunction([
          { x: graph.start.x - 60, y: graph.start.y },
          { x: graph.start.x, y: graph.start.y }
        ])})
      .classed("hidden", graph.start == null);
      
    var transitionGroup = transitions.selectAll("text")
      .data(graph.links, function(d) { return d.source.index + " " + d.target.index; });
      
    transitionGroup.enter().append("text");
    
    transitionGroup.attr("x", function(d) { return getTextPos(d.source, d.target, {width:60,height:60}).x; })
      .attr("y", function(d) { return getTextPos(d.source, d.target, {width:60,height:60}).y; });
    
    var tspans = transitionGroup.selectAll("tspan").data(function(d) { return d.transitions; });
    
    tspans.enter().append("tspan");
    
    tspans.text(function(d) { 
        return d.fromChar + " → " + d.toChar + ", " + (d.direction ? "R" : "L");
      })
      .attr("x", function(d, i2, i1) { return getTextPos(graph.links[i1].source, graph.links[i1].target, {width:60,height:60}).x; })
      .attr("dy", 20);
    
    tspans.exit().remove();
    
    transitionGroup.exit().remove();
    
    var links = link.selectAll("path")
      .data(graph.links, function(d) { return d.source.index + " " + d.target.index; });
    
    links.enter().append("path")
        .style('marker-end', 'url(#end-arrow)')
        .attr("fill", "none");
        
    links.attr("d", function(d) {
        var startPoint = { x: d.source.x, y: d.source.y };
        var endPoint = { x: d.target.x, y: d.target.y };
        if(d.target.index != d.source.index && machine.areLinked(d.target.index, d.source.index)) {
          startPoint = offsetPoint(startPoint, d.source, d.target, BIDIRECTIONAL_OFFSET);
          endPoint = offsetPoint(endPoint, d.source, d.target, BIDIRECTIONAL_OFFSET);
        }
        return lineFunction([startPoint, endPoint]);
      })
        
    links.exit().remove();

    var nodes = node.selectAll("g").data(graph.nodes, function(d) { return d.index; });
    var nodeGroup = nodes.enter().append("g");
    
    applyNodeListeners(
      nodeGroup.append("circle")
        .classed("outer", true)
        .attr("r", nodeRadius)
    );
    
    applyNodeListeners(
      nodeGroup.append("circle")
        .classed("inner", true)
        .attr("r", innerRadius)
    );
      
    nodeGroup.append("text");
          
    nodes.classed("selected", function(d) { return d.selected; })
      .classed("accept", function(d) { return d.accept; })
      .classed("reject", function(d) { return d.reject; })
      .select("circle.inner")
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
      
    nodes.select("circle.outer")
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })
      
    nodes.select("text")
      .html(function (d) { return d.name; })
      .attr("x", function(d) { return d.x; })
      .attr("y", function(d) { return d.y; })
          
    nodes.exit().remove();
  }
    
  function applyNodeListeners(d) {
    d.on("mousedown", function(d) {
        if(ctrlKey) {
          linkStart = d.index;
          mouseData = [
              { x: d.x, y: d.y },
              { x: d.x, y: d.y }
            ];
          mouseLine.classed("hidden", false)
            .attr("d", function(d) { 
            return lineFunction(mouseData)})
            .style('marker-end', function() { 
              return machine.areLinked(linkStart, d.index) ? 'url(#light-arrow)' : 'url(#end-arrow)';
            })
            .classed('double', machine.areLinked(linkStart, d.index));
        } else {
          if (!d.selected) {
            if (!shiftKey) node.selectAll("g").classed("selected", function(p) { return p.selected = d === p; });
            else d3.select(this.parentNode).classed("selected", d.selected = true);
            updateSelected(node.selectAll("g").filter(function(d) { return d.selected; }));
          }
        }
      })
      .on("mouseover", function(d) {
        if(!mouseLine.classed("hidden")) {
          mouseData[1].x = d.x;
          mouseData[1].y = d.y;
          var startPoint = mouseData[0];
          var endPoint = mouseData[1];
          if(linkStart != d.index && machine.areLinked(d.index, linkStart)) {
            var biStartPoint = offsetPoint(endPoint, d, graph.nodes[machine.findNode(linkStart)], BIDIRECTIONAL_OFFSET);
            var biEndPoint = offsetPoint(startPoint, d, graph.nodes[machine.findNode(linkStart)], BIDIRECTIONAL_OFFSET);
            link.selectAll("path").filter(function (link) { 
              return link.target.index == linkStart && link.source.index == d.index;
            }).classed("hidden edge", true);
            mouseBiLine.classed("hidden", false)
              .attr("d", lineFunction([biStartPoint, biEndPoint]));
            startPoint = offsetPoint(startPoint, graph.nodes[machine.findNode(linkStart)], d, BIDIRECTIONAL_OFFSET);
            endPoint = offsetPoint(endPoint, graph.nodes[machine.findNode(linkStart)], d, BIDIRECTIONAL_OFFSET);
          }
          mouseLine.attr("d", lineFunction([startPoint, endPoint]))
            .style('marker-end', function() { 
              return machine.areLinked(linkStart, d.index) ? 'url(#light-arrow)' : 'url(#end-arrow)';
            })
            .classed('double', machine.areLinked(linkStart, d.index));
        }
      })
      .on("mouseout", function(d) {
        mouseBiLine.classed("hidden", true);
        link.selectAll("path").filter(function (link) { 
          return link.target.index == linkStart && link.source.index == d.index;
        }).classed("hidden edge", false);
      })
      .on("mouseup", function(d) {
        if(ctrlKey && !mouseLine.classed("hidden")) {
          mouseLine.classed("hidden", true);
          machine.toggleLink(linkStart, d.index);
          _update();
        }
      })
      .call(d3.behavior.drag()
        .on("drag", function(d) { 
        if(!ctrlKey) {
          moveSelected(d3.event.dx, d3.event.dy); 
        }
      }));
  }

  function moveSelected(dx, dy) {
    node.selectAll("g").select("text").filter(function(d) { return d.selected; })
        .attr("x", function(d) { return d.x += dx; })
        .attr("y", function(d) { return d.y += dy; })
        
    node.selectAll("g").selectAll("circle").filter(function(d) { return d.selected; })
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })

    link.selectAll("path").filter(function(d) { return d.source.selected || d.target.selected; })
        .attr("d", function(d) { 
          var startPoint = { x: d.source.x, y: d.source.y };
          var endPoint = { x: d.target.x, y: d.target.y };
          if(d.target.index != d.source.index && machine.areLinked(d.target.index, d.source.index)) {
            startPoint = offsetPoint(startPoint, d.source, d.target, BIDIRECTIONAL_OFFSET);
            endPoint = offsetPoint(endPoint, d.source, d.target, BIDIRECTIONAL_OFFSET);
          }
          return lineFunction([startPoint, endPoint]);
        });
        
    transitions.selectAll("text").filter(function(d) { return d.source.selected || d.target.selected; })
      .attr("x", function(d) { return getTextPos(d.source, d.target, {width:60,height:60}).x; })
      .attr("y", function(d) { return getTextPos(d.source, d.target, {width:60,height:60}).y; })
      .selectAll("tspan")
      .attr("x", function(d, i2, i1) { return getTextPos(graph.links[i1].source, graph.links[i1].target, {width:60,height:60}).x; });
    
    startLine.attr("d", function(d) { 
        if(graph.start == null) return "";
        return lineFunction([
          { x: graph.start.x - 60, y: graph.start.y },
          { x: graph.start.x, y: graph.start.y }
        ])})
      .classed("hidden", graph.start == null);
  }

  function keydown() {
    shiftKey = d3.event.shiftKey || d3.event.metaKey;
    ctrlKey = d3.event.ctrlKey;
  }

  function keyup() {
    shiftKey = d3.event.shiftKey || d3.event.metaKey;
    ctrlKey = d3.event.ctrlKey;
    if (!ctrlKey) {
      mouseLine.classed("hidden", true);
      mouseBiLine.classed("hidden", true);
      link.selectAll("path.edge").classed("hidden edge", false);
    }
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
            node.selectAll("g").classed("selected", function(d) {
              return d.selected = d.previouslySelected ^
                  (extent[0][0] <= d.x && d.x < extent[1][0]
                  && extent[0][1] <= d.y && d.y < extent[1][1]);
            });
            updateSelected(node.selectAll("g").filter(function(d) { return d.selected; }));
          })
          .on("brushend", function() {
            d3.event.target.clear();
            d3.select(this).call(d3.event.target);
          }));

    brush.select(".background").style("cursor", "auto");
    return brush;
  }
  
  function buildMarker(id, refX, fill) {
    return svg.append('svg:defs').append('svg:marker')
        .attr('id', id)
        .attr('viewBox', '0 -50 100 100')
        .attr('refX', refX)
        .attr('markerWidth', 30)
        .attr('markerHeight', 30)
        .attr('orient', 'auto')
      .append('svg:path')
        .attr('d', 'M 0,-5 L 10,0 L 0,5 z')
        .attr('fill', fill);
  }
  
  function offsetPoint(point, orig, perp, distance) {
    var angle = Math.atan2(orig.y - perp.y, orig.x - perp.x);
    var rotatedAngle = angle + Math.PI / 2;
    return {
      x: point.x + Math.cos(rotatedAngle) * distance,
      y: point.y + Math.sin(rotatedAngle) * distance
    };
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
    },  
    selectedChanged: function () {
      updateSelected(node.selectAll("g").filter(function(d) { return d.selected; }));
    }
  }
}
