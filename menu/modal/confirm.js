/* 
FILE: menu/modal/confirm.js

The Confirm modal appears after clicking "save" or "submit" 
when either of those actions will cause an overwrite.

-- elements:
Static message for user
Cancel button
Confirmation button (that says "Yes, I'm sure.")

-- events:
open
clickConfirmBtn
clickCancelBtn

*/

gModalMenu.confirm = {};

/* set by whichever previous menu opened the confirm menu. There are two options: save and submit. */
gModalMenu.confirm.flag = "";

/* Opens the confirm modal. 
No return value. */
gModalMenu.confirm.open = function () {
  gModalMenu.open ("confirm");
};

/* Event handler for when the confirm button is clicked.
Fires an event in the modal that was previously opened (save or submit).
No return value.
*/
gModalMenu.confirm.clickConfirmBtn = function () {
  if (gModalMenu.confirm.flag === "submit") {
    gModalMenu.submitModal.clickConfirmBtn ();
  } else if (gModalMenu.confirm.flag === "saveas") {
    gModalMenu.saveas.clickConfirmBtn ();
  }
};
 
/* Event handler for when the cancel button is clicked.
Fires an event in the modal that was previously opened (save or submit). 
No return value.
*/
gModalMenu.confirm.clickCancelBtn = function () {
  if (gModalMenu.confirm.flag === "submit") {
    gModalMenu.submitModal.clickConfirmCancelBtn ();
  } else if (gModalMenu.confirm.flag === "saveas") {
    gModalMenu.saveas.clickConfirmCancelBtn ();
  }
};