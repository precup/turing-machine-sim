<?php

/*
/api/listSaved.php
GET request

responds with a JSON array of objects. Ex:
[
  {
    "id": "15",
    "user_id": "maxwang7",
    "automata": "<string>",
    "name": "name"
  }
]

Client side code:

var listSaved_url = "/api/listSaved.php";
  d3.xhr(gServer.url_prefix + listSaved_url)
    .header("Content-Type", "application/json")
    .get(function(err, data) {
      var json_data = JSON.parse(data.response);

      // To make array of names
      var names = []; 
      json_data.forEach(function(elem, index, arr) {
        names.push(elem["name"]);
      });
      console.log(names);
    });

*/

require_once("./db.php");

$db = new DB();

$user = $_ENV['WEBAUTH_USER'];
if(!$db->checkUserExists($user)) {
  $db->addUser($user);
}

$result = $db->getAllAutomataOfUser($user);
echo json_encode($result);