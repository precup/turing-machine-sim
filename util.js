/* Gets a URL parameter by the name of @name from @url.
 * @url defaults to the current page url. Returns null
 * if the parameter isn't present. */
function getURLParam (name, url) {
  if (!url) url = location.href;
  name = name.replace (/[\[]/,"\\\[").replace (/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp (regexS);
  var results = regex.exec (url);
  return results == null ? null : results[1];
}

/* Sets the URL parameter @key to @value in @url and
 * returns the result. */
function setURLParam (key, value, url) {
  var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
  var separator = url.indexOf('?') !== -1 ? "&" : "?";
  if (url.match(re)) {
    return url.replace(re, '$1' + key + "=" + value + '$2');
  }
  else {
    return url + separator + key + "=" + value;
  }
}

/* Computes the value between @min and @max, inclusive,
 * that has the same modulus_(@max - @min) as @value, relative to @min.
 * Extremely inefficient. Do not call for anything not close to the bounds. */
Math.bound = function (value, min, max) {
  var mod = max - min;
  while (value < min) value += mod;
  while (value > max) value -= mod;
  return value;
};

/* Strips all the characters from @str1 that are not 
 * present in @str2 and returns the result. Does not
 * remove duplicates or sort. */
function intersection (str1, str2) {
  var result = "";
  for (var i = 0; i < str1.length; i++) {
    if (str2.indexOf (str1[i]) != -1) {
      result += str1[i];
    }
  }
  return result;
}

/* Returns @str sorted in lexicographical order. */
function sortString (str) {
  return str.split ("").sort ().join ("");
}

/* Removes any duplicate characters from @str
 * and returns the result. The first instance
 * of a duplicate character is preserved. */
function removeDuplicates (str) {
  var result = "";
  for (var i = 0; i < str.length; i++) {
    if (result.indexOf (str[i]) == -1) {
      result += str[i];
    }
  }
  return result;
}

/* Gets the parent directory of the current URL. 
 * If the current URL has no parent, returns the
 * current URL. */
function getURLParent () {
  var url = window.location.href;
  var loc = url.lastIndexOf ("/") + 1;
  if (loc <= 8) {
    url += "/";
  } else {
    url = url.substring (0, loc);
  }
  return url;
}

/* Returns the distance between the points (@x1, @y1) and (@x2, @y2). */
function dist (x1, y1, x2, y2) {
  return Math.sqrt (Math.pow (x2 - x1, 2) + Math.pow (y2 - y1, 2));
}

/* isIE stores whether or not the browser is IE. detectIE is called to 
 * obtain this value, but there really isn't much reason to call it again. */
var isIE = function detectIE () {
    var ua = window.navigator.userAgent;

    var msie = ua.indexOf ('MSIE ');
    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt (ua.substring (msie + 5, ua.indexOf ('.', msie)), 10);
    }

    var trident = ua.indexOf ('Trident/');
    if (trident > 0) {
        // IE 11 => return version number
        var rv = ua.indexOf ('rv:');
        return parseInt (ua.substring(rv + 3, ua.indexOf ('.', rv)), 10);
    }

    var edge = ua.indexOf ('Edge/');
    if (edge > 0) {
       // IE 12 => return version number
       return parseInt (ua.substring (edge + 5, ua.indexOf ('.', edge)), 10);
    }

    // other browser
    return false;
} ();

/* isSafari stores whether or not the browser is Safari. detectSafari is called to 
 * obtain this value, but there really isn't much reason to call it again. */
var isSafari = function detectSafari () {
  var uagent = navigator.userAgent.toLowerCase();
  return /safari/.test(uagent) && !/chrome/.test(uagent);
} ();

/* isFirefox stores whether or not the browser is Firefox. detectFirefox is called to 
 * obtain this value, but there really isn't much reason to call it again. */
var isFirefox = function detectFirefox () {
  return navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
} ();