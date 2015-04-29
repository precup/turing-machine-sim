<?php

/*
/api/listSubmissions.php
GET request
No parameters required

Sample client-side code:

var url_prefix = "/class/cs103/cgi-bin/restricted";
var listSubmissions_url = "/api/listSubmissions.php";

d3.xhr (url_prefix + listSubmissions_url)
  .header ("Content-Type", "application/json")
  .get (
    function (err, rawData) {
      if (err) {
        console.log(err);
      } else { 
        console.log(rawData);

        var data = JSON.parse(rawData.response);

        // example of accessing values
        console.log(data[0]['pset_id']);
        console.log(data[0]['problem_id']);
      }
    });

*/

require_once("./db.php");

$db = new DB();

$user = $_ENV['WEBAUTH_USER'];

if (!$db->checkUserExists($user)) {
  $db->addUser($user);
}

$result = $db->getSubmissionsOfUser($user);

echo json_encode($result);
