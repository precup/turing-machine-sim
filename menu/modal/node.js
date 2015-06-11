/* 
FILE: menu/modal/node.js

Handles the node editing modal menu.

-- Elements:
Name (textbox)
Start state (checkbox)
Accept or reject (buttons)
Delete
Cancel
Update
-- Events:
check or uncheck start state (handled by UI)
accept or reject button (handled by UI)
Delete the node
Cancel editing (handled by modal.js)
Update node based on edits (handled by modal.js)
*/

/*--- Event Handlers ---*/
/* Deletes the selected node. 
No return value. */
gModalMenu.deleteNode = function () {
  gNodes.deleteEdited ();
};

/*--- Helper functions ---*/
/* Returns the current node's name. */
gModalMenu.getNodeName = function () {
  return d3.select (".nodeName").node ().value;
};

/* Sets the current node's name.
No return value. */
gModalMenu.setNodeName = function (name) {
  d3.select (".nodeName").node ().value = name;
};

/* If initial is true, checks the checkbox. Otherwise,
unchecks the checkbox.
@param (initial : boolean)
No return value. */
gModalMenu.setInitial = function (initial) {
  d3.select (".nodeInitialCheckbox").node ().checked = initial;
};

/* Returns whether the modal is set as the intial state. */
gModalMenu.getInitial = function () {
  return d3.select (".nodeInitialCheckbox").node ().checked;
};

/* Sets the current state of the modal as either rejecting or accepting.
@param (accept : boolean) 
@param (reject : boolean)
No return value. */
gModalMenu.setState = function (accept, reject) {
  d3.selectAll (".modalAcceptButton").classed ("marked", accept);
  d3.selectAll (".modalNeitherButton").classed ("marked", !accept && !reject);
  d3.selectAll (".modalRejectButton").classed ("marked", reject);
};

/* Returns whether the current node is marked as accepting. */
gModalMenu.getAccepting = function () {
  return d3.select (".modalAcceptButton").classed ("marked");
};

/* Returns whether the current node is marked as rejecting.*/
gModalMenu.getRejecting = function () {
  return d3.select (".modalRejectButton").classed ("marked");
};