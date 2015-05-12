gGraph.initCookie = function () {
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