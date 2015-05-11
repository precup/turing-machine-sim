/* handles save as functionality */

gModalMenu.initSave = function () {
  gModalMenu.confirmFlag = "save";

  var name = encodeURIComponent(gModalMenu.getSaveName ());
  gServer.listSaved (function (err, data) {
    function isPreviouslySaved (list, name) {
      var isPreviouslySaved = false;
      return list.some (function (elem, index, arr) {
        return elem["name"] === name;
      });
    }
    if (err) {
      gErrorMenu.displayModalError ("save", "Save failed");
      setTimeout (function () {
        gErrorMenu.clearModalErrors ();
        gModalMenu.setSubmitButton ("Submit");
      }, 3000);
      return;
    }

    if (isPreviouslySaved (data, name)) {
      gModalMenu.close ("save");
      gModalMenu.open ("confirm");
    } else {
      gModalMenu.save (function () {
        gModalMenu.close ("save");
      });
    }
  })
};

// done () - not used right now
gModalMenu.save = function (done) {
  var name = gModalMenu.getSaveName ();
  gModalMenu.setSaveButton ("Saving...");
  gServer.save (name, function (err, data) {
    if (err) {
      gErrorMenu.displayModalError ("save", "Failed to save");
      setTimeout (function () {
        gErrorMenu.clearModalErrors ();
      }, 3000);
      gModalMenu.setSaveButton ("Save");
      return;
    } else {
      gModalMenu.setSaveButton ("Saved!");
    }
    window.setTimeout(function () {
      gModalMenu.setSaveButton ("Save"); // return to original
      gModalMenu.close("save");
    }, 1000);
  });
};

gModalMenu.getSaveName = function () {
  return d3.select (".saveText").node ().value;
};

gModalMenu.setSaveName = function (name) {
  d3.select (".saveText").node ().value = decodeURIComponent (name);
};

gModalMenu.setSaveButton = function (text) {
  d3.select (".saveButton").text (text);
};