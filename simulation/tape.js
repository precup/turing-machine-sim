var gTape =
  {
    CELL_SIZE: 100,
    BOTTOM_OFFSET: 120,
    SELECT_RADIUS: 50,
  };

gTape.init = function () {
  d3.select (".tape")
    .append ("circle")
    .style ("fill", "none")
    .style ("stroke", "blue")
    .attr ("r", gTape.SELECT_RADIUS);
  gTape.hide ();
};

gTape.run = function (input) {
  d3.select (".tape")
    .select ("circle")
    .style ("stroke", "blue");
    
  gTape.input = input.split ("");
  gTape.index = 0;
  gTape.follow = gTape.current = gNodes.initial;
  var gs = d3.select (".tape").selectAll ("g").data (gTape.input);
  
  var newG = gs.enter ()
    .append ("g");
  newG.append ("rect")
    .attr ("width", gTape.CELL_SIZE)
    .attr ("height", gTape.CELL_SIZE)
    .classed ("tapeRect", true);
    
  gs.select ("rect")
    .attr ("x", function (input, i) {
      return i * gTape.CELL_SIZE + gGraph.width / 2 -  gTape.input.length * gTape.CELL_SIZE / 2;
    })
    .attr ("y", gGraph.height - gTape.CELL_SIZE - gTape.BOTTOM_OFFSET);
    
  gs.exit ().remove ();
  gTape.draw ();
};

gTape.draw = function () {
  if (gTape.follow) {
    d3.select (".tape")
      .select ("circle")
      .attr ("cx", gTape.follow.x)
      .attr ("cy", gTape.follow.y);
    if (typeof gTape.current == "undefined" || (gTape.index == gTape.input.length && !gTape.current.accept)) {
      d3.select (".tape")
        .select ("circle")
        .style ("stroke", "red");
    }
    else if (gTape.index == gTape.input.length) {
      d3.select (".tape")
        .select ("circle")
        .style ("stroke", "green");
    }
  }
};

gTape.show = function () {
  d3.select (".tape").style ("opacity", 1);
};

gTape.hide = function () {
  d3.select (".tape").style ("opacity", 0);
};

gTape.step = function () {
  if (typeof gTape.current != "undefined" && gTape.index != gTape.input.length) {
    var next = gDFASimulator.step (gGraph.save (), gTape.current.id,  gTape.input,  gTape.index++);
    gTape.current = gNodes.nodes[gNodes.getNodeIndex (next)];
    if (typeof gTape.current != "undefined") {
      gTape.follow = gTape.current;
    }
  }
  gTape.draw ();
};