gModalMenu.getNodeName = function () {
  return d3.select (".nodeName").node ().value;
};

gModalMenu.setNodeName = function (name) {
  d3.select (".nodeName").node ().value = name;
};

gModalMenu.setInitial = function (initial) {
  d3.select (".nodeInitialCheckbox").node ().checked = initial;
};

gModalMenu.getInitial = function () {
  return d3.select (".nodeInitialCheckbox").node ().checked;
};

gModalMenu.setState = function (accept, reject) {
  d3.select (".modalAcceptButton").classed ("marked", accept);
  d3.select (".modalNeitherButton").classed ("marked", !accept);
};

gModalMenu.getAccepting = function () {
  return d3.select (".modalAcceptButton").classed ("marked");
};

gModalMenu.getRejecting = function () {
  return d3.select (".modalNeitherButton").classed ("marked");
};