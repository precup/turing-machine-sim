<?php

/*
/api/list.php
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
*/

require_once("./db.php");

$db = new DB();

$user = $_ENV['WEBAUTH_USER'];
if(!$db->checkUserExists($user)) {
  $db->addUser($user);
}

$result = $db->getAllAutomataOfUser($user);
echo json_encode($result);

