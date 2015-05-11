/* 

confirm modal

Appears after clicking "save" or "submit" when either
of those actions will cause an overwrite.

-- elements:

-- events:
open
clickConfirmBtn
clickCancelBtn

*/

gModalMenu.confirm = {};

gModalMenu.confirm.flag = "";

gModalMenu.confirm.open = function () {
  gModalMenu.open ("confirm");
};

gModalMenu.confirm.clickConfirmBtn = function () {
  if (gModalMenu.confirm.flag === "submit") {
    gModalMenu.submitModal.clickConfirmBtn ();
  } else if (gModalMenu.confirm.flag === "saveas") {
    gModalMenu.saveas.clickConfirmBtn ();
  }
};

gModalMenu.confirm.clickCancelBtn = function () {
  if (gModalMenu.confirm.flag === "submit") {
    gModalMenu.submitModal.clickConfirmCancelBtn ();
  } else if (gModalMenu.confirm.flag === "saveas") {
    gModalMenu.saveas.clickConfirmCancelBtn ();
  }
};