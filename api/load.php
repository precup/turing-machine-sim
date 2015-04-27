<?php


/* 
/api/load.php
GET request
should contain the parameter "id"
*/

$id = intval($_GET["id"]);

$DB_CONFIG_FILE = './db_config.secret';
$db = json_decode(file_get_contents($DB_CONFIG_FILE), True);

$mysqli = new mysqli($db['url'], $db['user'], $db['password'], $db['name']);
if (mysqli_connect_errno($mysqli)) {
  echo "Oops! Something weird happened on our server. Try again?\n";
  // echo "Failed to connect to MySQL: " . mysqli_connect_error();
  exit();
}

$query_string = "select * from automatas where id=$id;";
$automaton = mysqli_query($mysqli, $query_string);

$jsonlist = array();
while ($row = $automaton->fetch_assoc()) {
  $cur = array(); 
  $cur[0] = $row['id'];
  $cur[1] = $row['automata'];
  array_push ($jsonlist, $cur);
}

echo json_encode($jsonlist);

?>
