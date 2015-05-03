function getURLParam (name, url) {
  if (!url) url = location.href;
  name = name.replace (/[\[]/,"\\\[").replace (/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp (regexS);
  var results = regex.exec (url);
  return results == null ? null : results[1];
}

Math.bound = function (value, min, max) {
  var mod = max - min;
  while (value < min) value += mod;
  while (value > max) value -= mod;
  return value;
};

function intersection (str1, str2) {
  var result = "";
  for (var i = 0; i < str1.length; i++) {
    if (str2.indexOf (str1[i]) != -1) {
      result += str1[i];
    }
  }
  return result;
}

function sortString (str) {
  return str.split ("").sort ().join ("");
}

function removeDuplicates (str) {
  var result = "";
  for (var i = 0; i < str.length; i++) {
    if (result.indexOf (str[i]) == -1) {
      result += str[i];
    }
  }
  return result;
}

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

function dist (x1, y1, x2, y2) {
  return Math.sqrt (Math.pow (x2 - x1, 2) + Math.pow (y2 - y1, 2));
}