<?php
// TODO: Not sure if this code works yet

/*
/api/submit.php
POST request
{
  "automata": <String>,
  "problem": <Integer, problem id>
}

*/

require_once("./db.php");

$db = new DB();

$data = json_decode(file_get_contents('php://input'));
$automata = $data['automata'];
$problem = $data['problem'];
$user = $_ENV['WEBAUTH_USER'];

if (!$db->checkUserExists($user)) {
  $db->addUser($user);
}

$db->addSubmission($sunetid, $automata, $problem);

