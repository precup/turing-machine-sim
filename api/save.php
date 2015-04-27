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

$DB_CONFIG_FILE = './db_config.secret';

$dataStr = file_get_contents('php://input');

$data = json_decode($dataStr, True);

$db = json_decode(file_get_contents($DB_CONFIG_FILE), True);

$mysqli = new mysqli($db['url'], $db['user'], $db['password'], $db['name']);
if (mysqli_connect_errno($mysqli)) {
  echo "Oops! Something weird happened on our server. Try again?\n";
  // echo "Failed to connect to MySQL: " . mysqli_connect_error();
  exit();
}

$name = $data['name'];
if (strlen($name) > 30) {
  echo "Your name is too long. Please keep it under 30 characters.\n";
  exit();
}
$automataStr = mysqli_real_escape_string($mysqli, $data['automata']);

$query_string = "insert into automatas (automata, name) values(\"$automataStr\", \"$name\");";
$val = mysqli_query($mysqli, $query_string);

if ($val === False) {
  echo "Oops! Something weird happened on our server. Try again?\n";
  exit();
}

?>
