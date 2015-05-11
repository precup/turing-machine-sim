var gModalMenu =
  {
    confirmFlag: "",
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
  if (event.keyCode == 13) {
    gModalMenu.submit (type);
  }
};

gModalMenu.submit = function (type) {
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
    case "save":
      gModalMenu.initSave ();
      break;
    case "load":
      gModalMenu.load.onClickLoadBtn ();
      break;
    case "submit":
      gModalMenu.initSubmitToServer ();
      break;
    case "confirm":
      gModalMenu.confirm ();
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
      gModalMenu.confirmCancelled ();
      break;
    default:
      gModalMenu.close (type);
      break;
  }
};

gModalMenu.confirm = function () {
  if (gModalMenu.confirmFlag === "submit") {
    gModalMenu.close ("confirm");
    gModalMenu.open ("submit");
    gModalMenu.submitToServer (function () {
      gModalMenu.close ("submit");
    });
  } else if (gModalMenu.confirmFlag === "save") {
    gModalMenu.close ("confirm");
    gModalMenu.open ("save");
    gModalMenu.save (function () {
      gModalMenu.close ("save");
    })
  }
};

gModalMenu.confirmCancelled = function () {
  if (gModalMenu.confirmFlag === "submit") {
    gModalMenu.close ("confirm");
    gModalMenu.close ("submit");
    gModalMenu.setSubmitButton ("Submit");
  } else if (gModalMenu.confirmFlag === "save") {
    gModalMenu.close ("save");
    gModalMenu.close ("confirm");
    gModalMenu.setSaveButton ("Save");
  }
};