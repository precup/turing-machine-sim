/*
FILE: menu/modal/saveas.js

handles save as functionality, most of which are event handlers for
modal buttons.

-- elements:
Static message for user ("Saving does not submit")
Text box to enter name
Cancel button
Confirmation button (that says "Save")

-- events:
open
clickSaveBtn
clickCancelBtn
clickConfirmBtn
clickConfirmCancelBtn
*/

/* Put any constants into the object */
gModalMenu.saveas = {};

/* Opens the Save As modal and sets the textbox's name to 
gServer.name.
No return value. */
gModalMenu.saveas.open = function () {
  gModalMenu.saveas.setSaveName (gServer.name);
  gModalMenu.open ("saveas");
};

/* Event handler for when the "Save" button is clicked. If the
user has a automaton of the same name in the database, the 
Confirm modal is opened.
No return value. */
gModalMenu.saveas.clickSaveBtn = function () {
  gModalMenu.confirm.flag = "saveas";

  gModalMenu.saveas.setSaveButton ("Saving...");
  var rawName = gModalMenu.saveas.getSaveName ();
  if (gModalMenu.saveas.isInvalidName (rawName)) {
    gErrorMenu.displayModalError ("saveas", "Automaton name cannot be blank");
    gModalMenu.saveas.setSaveButton ("Save");
    return;
  }

  var name = encodeURIComponent(rawName); // Escape the URL
  
  gServer.listSaved (function (err, data) {
    function isPreviouslySaved (list, name) {
      var isPreviouslySaved = false;
      return list.some (function (elem, index, arr) {
        return elem["name"] === name;
      });
    }
    if (err) {
      gErrorMenu.displayModalError ("saveas", "Save failed: couldn't connect to server.");
      gModalMenu.saveas.setSaveButton ("Save");
      return;
    }

    if (isPreviouslySaved (data, name)) { // If previously saved, oven confirm modal
      gModalMenu.close ("saveas");
      gModalMenu.confirm.open ();
    } else {
      gModalMenu.saveas.save (function () { // Otherwise, go ahead and save
        gModalMenu.close ("saveas");
      });
    }
  })
};

/* Event handler for cancel button click. Clears modal errors and closes
the modal menu.
No return value. */
gModalMenu.saveas.clickCancelBtn = function () {
  gErrorMenu.clearModalErrors ();
  gModalMenu.close ("saveas");
};

/* Event handler for the confirm button in the confirm modal being clicked.
Goes ahead and saves the automaton.
No return value. */
gModalMenu.saveas.clickConfirmBtn = function () {
  gModalMenu.close ("confirm");
  gModalMenu.open ("saveas");
  gModalMenu.saveas.save (function () {
    gModalMenu.close ("saveas");
  });
};

/* Event handler for the cancel button in the confirm modal being clicked.
Closes both the Confirm modal and Save As modal. 
No return value. */
gModalMenu.saveas.clickConfirmCancelBtn = function () {
  gModalMenu.close ("saveas");
  gModalMenu.close ("confirm");
  gModalMenu.saveas.setSaveButton ("Save");
};

/* Actually submits a request to the database to save the automaton.
No return value. */
gModalMenu.saveas.save = function () {
  var name = gModalMenu.saveas.getSaveName ();
  gServer.save (name, function (err, data) {
    if (err) {
      gErrorMenu.displayModalError ("saveas", "Save failed: couldn't connect to server.");
      gModalMenu.saveas.setSaveButton ("Save");
      return;
    }
    gServer.changeName (name);
    gModalMenu.saveas.setSaveButton ("Saved!");
    window.setTimeout (function () {
      gModalMenu.saveas.setSaveButton ("Save"); // return to original
      gModalMenu.close("saveas");
    }, 1000);
  });
};

/*--- helper functions ---*/
/* Checks if the name is made of only spaces or no characters. */
gModalMenu.saveas.isInvalidName = function (name) {
  return name.replace (/\s/g, "").length === 0
}

/* Returns the name in the Save As modal's textbox. */
gModalMenu.saveas.getSaveName = function () {
  return d3.select (".saveText").node ().value;
};

/* Set the Save As modal's textbox value. */
gModalMenu.saveas.setSaveName = function (name) {
  d3.select (".saveText").node ().value = decodeURIComponent (name);
};

/* Set the string in the "Save" button (next to the "Cancel" button). */
gModalMenu.saveas.setSaveButton = function (text) {
  d3.select (".saveButton").text (text);
};