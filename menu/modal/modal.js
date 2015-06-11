/*
FILE: menu/modal/modal.js

Handles the logic for propogating calls to the appropriate event handlers and for
convenience functions, such as submitOnEnter.
*/

var gModalMenu =
  {
    MAX_HEIGHT_PERCENT: 0.62
  };

/* Opens modal "type", saving "type" to gModalMenu.currentType.
@param (type : string) modal to open
No return value. */
gModalMenu.open = function (type) {
  gModalMenu.currentType = type;
  d3.select ("." + type).style ('display', 'inline');
  d3.select ('.overlay').style ('display', 'inline');
};

/* Closes modal "type", clearing all modal errors in the process.
@param (type : string) modal to close
No return value. */
gModalMenu.close = function (type) {
  gErrorMenu.clearModalErrors ();
  d3.select ("." + type).style ('display', 'none');
  d3.select ('.overlay').style ('display', 'none');
};

/* Closes the currently open modal.
No return value.
*/
gModalMenu.closeCurrent = function () {
  gModalMenu.cancel (gModalMenu.currentType);
};

/* Sets an event listener for the enter key on "type", calls gModalMenu.submit 
when event is fired.
@param (type : string) modal on which to call submit
No return value.
*/
gModalMenu.submitOnEnter = function (type) {
  if (!isFirefox && event.keyCode == 13) {
    gModalMenu.submit (type);
  }
};

/* Responds to the submit key being pressed on modals. Clears error messages, 
then calls the appropriate event handler.
@param (type : string) modal on which submit occurred
No return value.
*/
gModalMenu.submit = function (type) {
  gErrorMenu.clearModalErrors ();
  switch (type) {
    case "tmEdgeEntry":
      gEdges.tmEditComplete ();
      break;
    case "edgeEntry":
      gEdges.editComplete ();
      break;
    case "nodeEntry":
      gNodes.editComplete ();
      break;
    case "testing":
      gSimulator.runTests ();
      break;
    case "saveas":
      gModalMenu.saveas.clickSaveBtn ();
      break;
    case "load":
      gModalMenu.load.onClickLoadBtn ();
      break;
    case "submit":
      gModalMenu.submitModal.clickSubmitBtn ();
      break;
    case "confirm":
      gModalMenu.confirm.clickConfirmBtn ();
      break;
    case "tape-set":
      gModalMenu.tapeSet.clickConfirmBtn ();
      break;
    default:
      break;
  }
};

/* The default behavior is to close the modal menu for "type". Behavior for
each "type" can be specified and forwarding to the appropriate event handler.
@param (type : string) modal to cancel
No return value.
*/
gModalMenu.cancel = function (type) {
  switch (type) {
    case "edgeEntry":
      gEdges.editCancelled ();
      break;
    case "confirm":
      gModalMenu.confirm.clickCancelBtn ();
      break;
    case "saveas": 
      gModalMenu.saveas.clickCancelBtn ();
      break;
    case "load":
      gModalMenu.load.clickCancelBtn ();
      break;
    default:
      gModalMenu.close (type);
      break;
  }
};