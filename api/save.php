<?php

/*
/api/save.php
POST request
body should contain JSON:
{
  "automata": <String represention of JSON graph>,
  "name": <String, name of automata, length < 30>,
}
*/

require_once("./db.php");

$db = new DB();

$data = json_decode(file_get_contents('php://input'), True);

$user = $_ENV['WEBAUTH_USER'];
$name = $data['name'];
if (strlen($name) > 30) {
  echo "Your name is too long. Please keep it under 30 characters.\n";
  exit();
}
$automataStr = $data['automata'];

if(!$db->checkUserExists($user)) {
  $db->addUser($user);
}

$db->addAutomata($user, $automataStr, $name);

?>
