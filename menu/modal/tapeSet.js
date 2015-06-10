/*
FILE: menu/modal/tapeSet.js

Handles the modal menu for editing the tape set alphabet.

-- elements
Textbox to enter new characters into the tape set alphabet
Save button
Cancel button

-- event
Add new characters
Cancel (handled implicitly by modal.js)

*/

/* Add constants in here. */
gModalMenu.tapeSet = {};

/* Event handler for confirm button clicking.
No return value. */
gModalMenu.tapeSet.clickConfirmBtn = function () {
  var curTapeSet = gGraph.tapeSet;
  var newChars = gModalMenu.tapeSet.getNewCharacters ();
  gGraph.tapeSet = sortString (removeDuplicates (curTapeSet + newChars));
  gTopMenu.draw ();
  gModalMenu.close ('tape-set');
};

/* Returns the new characters that have been added into the textbox. */
gModalMenu.tapeSet.getNewCharacters = function () {
  return d3.select ('.tape-set-text').node ().value;
}