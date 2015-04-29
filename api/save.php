<?php

/*
/api/save.php
POST request
body should contain JSON:
{
  "automata": <String represention of JSON graph>,
  "name": <String, name of automata, length < 30>,
}

Sample client-side code:

var url_prefix = "/class/cs103/cgi-bin/restricted";
var save_url = "/api/save.php";
var name = "name";
var stringGraph = JSON.stringify (gGraph.save ());

var pack = {
  automata: stringGraph,
  name: name
};

d3.xhr (url_prefix + save_url)
  .header ("Content-Type", "application/json")
  .post (
    JSON.stringify (pack),
    function (err, rawData) {
      if (err) {
        console.log(err);
      } else { 
        console.log(rawData);
      }
    }
  );

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
