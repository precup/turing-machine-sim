var gModalMenu =
  {
    MAX_HEIGHT_PERCENT: 0.62
  };

gModalMenu.open = function (type) {
  gModalMenu.currentType = type;
  d3.select ("." + type).style ('display', 'inline');
  d3.select ('.overlay').style ('display', 'inline');
};

gModalMenu.close = function (type) {
  gErrorMenu.clearModalErrors ();
  d3.select ("." + type).style ('display', 'none');
  d3.select ('.overlay').style ('display', 'none');
};

gModalMenu.closeCurrent = function () {
  gModalMenu.cancel (gModalMenu.currentType);
};

gModalMenu.submitOnEnter = function (type) {
  if (!isFirefox && event.keyCode == 13) {
    gModalMenu.submit (type);
  }
};

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