<?php

/*
/api/list.php
GET request

responds with a JSON array of arrays. Ex:
[["id", "name"], ["1", "awesome_automata"]]
*/

$DB_CONFIG_FILE = './db_config.secret';

$db = json_decode(file_get_contents($DB_CONFIG_FILE), True);

$mysqli = new mysqli($db['url'], $db['user'], $db['password'], $db['name']);

if (mysqli_connect_errno($mysqli)) {
  echo "Oops! Something weird happened on our server. Try again?\n";
  // echo "Failed to connect to MySQL: " . mysqli_connect_error();  exit();
}

$automatas = mysqli_query($mysqli, "select * from automatas;");

$jsonlist = array();
while ($row = $automatas->fetch_assoc()) {
  $cur = array(); 
  $cur[0] = $row['id'];
  $cur[1] = $row['name'];
  array_push ($jsonlist, $cur);
}
echo json_encode($jsonlist);
?>
