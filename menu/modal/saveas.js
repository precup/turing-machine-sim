/* handles save as functionality */

gModalMenu.saveas = {};

gModalMenu.saveas.open = function () {
  gModalMenu.saveas.setSaveName (gServer.name);
  gModalMenu.open ("saveas");
};

gModalMenu.saveas.clickSaveBtn = function () {
  gModalMenu.confirm.flag = "saveas";

  gModalMenu.saveas.setSaveButton ("Saving...");
  var rawName = gModalMenu.saveas.getSaveName ();
  if (rawName.replace (/\s/g, "").length === 0) {
    gErrorMenu.displayModalError ("saveas", "Automaton name cannot be blank");
    gModalMenu.saveas.setSaveButton ("Save");
    return;
  }

  var name = encodeURIComponent(rawName);
  
  gServer.listSaved (function (err, data) {
    function isPreviouslySaved (list, name) {
      var isPreviouslySaved = false;
      return list.some (function (elem, index, arr) {
        return elem["name"] === name;
      });
    }
    if (err) {
      gErrorMenu.displayModalError ("saveas", "Save failed: couldn't connect to server.");
      setTimeout (function () {
        gErrorMenu.clearModalErrors ();
      }, 3000);
      gModalMenu.saveas.setSaveButton ("Save");
      return;
    }

    if (isPreviouslySaved (data, name)) {
      gModalMenu.close ("saveas");
      gModalMenu.confirm.open ();
    } else {
      gModalMenu.saveas.save (function () {
        gModalMenu.close ("saveas");
      });
    }
  })
};

gModalMenu.saveas.clickCancelBtn = function () {
  gModalMenu.cancel ("saveas");
};

gModalMenu.saveas.clickConfirmBtn = function () {
  gModalMenu.close ("confirm");
  gModalMenu.open ("saveas");
  gModalMenu.saveas.save (function () {
    gModalMenu.close ("saveas");
  });
};

gModalMenu.saveas.clickConfirmCancelBtn = function () {
  gModalMenu.close ("saveas");
  gModalMenu.close ("confirm");
  gModalMenu.saveas.setSaveButton ("Save");
};

// done () - not used right now
gModalMenu.saveas.save = function (done) {
  var name = gModalMenu.saveas.getSaveName ();
  gServer.save (name, function (err, data) {
    if (err) {
      gErrorMenu.displayModalError ("saveas", "Save failed: couldn't connect to server.");
      setTimeout (function () {
        gErrorMenu.clearModalErrors ();
      }, 3000);
      gModalMenu.saveas.setSaveButton ("Save");
      return;
    } else {
      gServer.name = name;
      gModalMenu.saveas.setSaveButton ("Saved!");
    }
    window.setTimeout (function () {
      gModalMenu.saveas.setSaveButton ("Save"); // return to original
      gModalMenu.close("saveas");
    }, 1000);
  });
};

gModalMenu.saveas.getSaveName = function () {
  return d3.select (".saveText").node ().value;
};

gModalMenu.saveas.setSaveName = function (name) {
  d3.select (".saveText").node ().value = decodeURIComponent (name);
};

gModalMenu.saveas.setSaveButton = function (text) {
  d3.select (".saveButton").text (text);
};