var gBrush = 
  {
  };
  
gBrush.init = function () {
  var brushG = d3.select ("g.brush");
  var brush = d3.svg.brush ()
    .x (d3.scale.identity ().domain([0, gGraph.width]))
    .y (d3.scale.identity ().domain([0, gGraph.height]))
    // A kludge needed to deal with d3 contexts
    // This should be dealt with with gBehaviors
    // TODO: Unkludge this
    .on ("brushend", function () { 
      d3.event.target.clear ();
      d3.select (this).call (d3.event.target);
    });
    
  gBehaviors.apply ("brush", brush);
  brushG.call (brush);
  
  brushG.select(".background").style("cursor", "default");
  brushG.select(".extent").style("cursor", "default");
};