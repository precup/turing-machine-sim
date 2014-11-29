var setupGUI = function (width, height, element, machine) {
  var nodeRadius = 30, innerRadius = 24, shiftKey, ctrlKey, linkStart, mouseData;
    
  d3.select("body")
      .on("keydown.brush", keydown)
      .on("keyup.brush", keyup)
      .each(function() { this.focus(); });
      
  var svg = d3.select(element).append("svg")
      .attr("id", "vis")
      .attr("width", width)
      .attr("height", height);
      
  svg.append('svg:defs').append('svg:marker')
      .attr('id', 'end-arrow')
      .attr('viewBox', '0 -50 100 100')
      .attr('refX', 36)
      .attr('markerWidth', 30)
      .attr('markerHeight', 30)
      .attr('orient', 'auto')
    .append('svg:path')
      .attr('d', 'M 0,-5 L 10,0 L 0,5 z')
      .attr('fill', 'black');
      
  svg.append('svg:defs').append('svg:marker')
      .attr('id', 'light-arrow')
      .attr('viewBox', '0 -50 100 100')
      .attr('refX', 36)
      .attr('markerWidth', 30)
      .attr('markerHeight', 30)
      .attr('orient', 'auto')
    .append('svg:path')
      .classed("double", true)
      .attr('d', 'M 0,-5 L 10,0 L 0,5 z')
      .attr('fill', '#999');
      
  svg.append('svg:defs').append('svg:marker')
      .attr('id', 'mouse-arrow')
      .attr('viewBox', '0 -50 100 100')
      .attr('refX', 13)
      .attr('markerWidth', 30)
      .attr('markerHeight', 30)
      .attr('orient', 'auto')
    .append('svg:path')
      .attr('d', 'M 0,-5 L 10,0 L 0,5 z')
      .attr('fill', 'black');

  var link = svg.append("g")
      .attr("class", "link");
      
  var mouseLine = svg.append("path").classed("hidden", true)
        .style('marker-end', function() { 
            return machine.areLinked(linkStart, linkStart) ? 'url(#light-arrow)' : 'url(#end-arrow)';
          })
        .attr("fill", "none")
        .classed('double', machine.areLinked(linkStart, linkStart));
  
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
        data[0],
        { x: data[0].x - 50, y: data[0].y + 30 },
        { x: data[0].x - 70, y: data[0].y },
        { x: data[0].x - 50, y: data[0].y - 30 },
        data[1]
      ]);
    } else {
      return straightLineFunction(data);
    }
  }
      
  _update();

  function _update() {
    graph = machine.getData();
    
    /*startLine.attr("d", function(d) { 
        return lineFunction(mouseData)})
      .classed("hidden", typeof myVar === 'undefined');*/
    
    var links = link.selectAll("path")
      .data(graph.links, function(d) { return d.source.index + " " + d.target.index; });
    
    links.enter().append("path")
        .style('marker-end', 'url(#end-arrow)')
        .attr("fill", "none");
        
    links.attr("d", function(d) { 
        return lineFunction([
          { x: d.source.x, y: d.source.y },
          { x: d.target.x, y: d.target.y }
        ])})
        
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
          }
        }
      })
      .on("mousemove", function(d) {
        if(!mouseLine.classed("hidden")) {
        mouseData[1].x = d.x;
        mouseData[1].y = d.y;
        mouseLine.attr("d", lineFunction(mouseData))
        .style('marker-end', function() { 
          return machine.areLinked(linkStart, d.index) ? 'url(#light-arrow)' : 'url(#end-arrow)';
          })
          .classed('double', machine.areLinked(linkStart, d.index));
        }
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

    link.selectAll("path").filter(function(d) { return d.source.selected; })
        .attr("d", function(d) { 
          return lineFunction([
            { x: d.source.x, y: d.source.y },
            { x: d.target.x, y: d.target.y }
          ])});

    link.selectAll("path").filter(function(d) { return d.target.selected; })
        .attr("d", function(d) { 
          return lineFunction([
            { x: d.source.x, y: d.source.y },
            { x: d.target.x, y: d.target.y }
          ])});
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
            node.selectAll("g").classed("selected", function(d) {
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
