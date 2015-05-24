gModalMenu.tapeSet = {};

gModalMenu.tapeSet.clickConfirmBtn = function () {
  var curTapeSet = gGraph.tapeSet;
  var newChars = gModalMenu.tapeSet.getNewCharacters ();
  gGraph.tapeSet = sortString (removeDuplicates (curTapeSet + newChars));
  gTopMenu.draw ();
  gModalMenu.close ('tape-set');
};

gModalMenu.tapeSet.getNewCharacters = function () {
  return d3.select ('.tape-set-text').node ().value;
}