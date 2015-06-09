/* This file is meant for debugging purposes only. When gCookiesActive is
 * set to false, it does nothing. If set to true, it listens for presses
 * to 's' and 'l', which respectively save and load the current automata to/from
 * a cookie.
 */

var gCookiesActive = false;

gGraph.initCookie = function () {
  if (!gCookiesActive) {
    return;
  }
  
  // Loading
  gBehaviors.addBehavior ("page", "keydown",
    function () {
      return d3.event.keyCode == 76 && d3.select (".overlay").style ("display") === "none";
    },
    function () {
      var nameEQ = "automata=";
      var ca = document.cookie.split (';');
      for (var i=0; i < ca.length;i++) {
          var c = ca[i];
          while (c.charAt (0) == ' ') c = c.substring (1, c.length);
          if (c.indexOf (nameEQ) == 0) gGraph.load (JSON.parse (c.substring (nameEQ.length, c.length)));
      }
      gGraph.draw ();
    });
    
  // Saving
  gBehaviors.addBehavior ("page", "keydown",
    function () {
      return d3.event.keyCode == 83 && d3.select (".overlay").style ("display") === "none";
    },
    function () {
      var name = "automata";
      var value = JSON.stringify (gGraph.save ());
      var date = new Date ();
      date.setTime (date.getTime () + (365*24*60*60*1000));
      var expires = "; expires=" + date.toGMTString ();
      document.cookie = name + "=" + value+expires + "; path=/";
    });
};