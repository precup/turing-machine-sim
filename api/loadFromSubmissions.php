<?php

/*
/api/loadFromSubmissions.php
GET request
Params: "pset", "problem"

var pset = 1;
var problem = 1;

var url_prefix = "/class/cs103/cgi-bin/restricted";
var loadFromSubmissions_url = "/api/loadFromSubmissions.php";
var full_url = url_prefix + loadFromSubmissions_url + "?problem=" + problem + "&pset=" + pset;

d3.xhr (full_url)
  .header ("Content-Type", "application/json")
  .get (
    function (err, rawData) {
      if (err) {
        console.log(err);
      } else { 
        console.log(rawData);

        var data = JSON.parse(rawData.response);

        var automata = JSON.parse(data[0].automata);
      }
    });
*/

require_once('./db.php');

$db = new DB();

$pset = intval($_GET["pset"]);
$problem = intval($_GET["problem"]);
$user = $_ENV['WEBAUTH_USER'];

if (!$db->checkUserExists($user)) {
  $db->addUser($user);
}

$result = $db->getAutomataOfSubmission($user, $pset, $problem);

if ($result === False) {
  echo "You have not submit that problem yet";
  exit();
}

echo json_encode($result);
