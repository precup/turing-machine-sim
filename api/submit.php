<?php

/*
/api/submit.php
POST request
{
  "automata": <String>,
  "problem": <Integer, problem number>
  "pset": <Integer, pset>
}

Sample client-side code:

var url_prefix = "/class/cs103/cgi-bin/restricted";
var submit_url = "/api/submit.php";

var automata = JSON.stringify (gGraph.save ());
var pset = 1;
var problem = 1;

var pack = {
  automata: automata,
  pset: pset,
  problem: problem
};

console.log(pack);

d3.xhr (url_prefix + submit_url)
  .header ("Content-Type", "application/json")
  .post (
    JSON.stringify (pack),
    function (err, rawData) {
      if (err) {
        console.log(err);
      } else { 
        console.log(rawData);
      }
    });

*/

// ini_set('display_errors', 'On');
// error_reporting(E_ALL);

require_once("./db.php");

$db = new DB();

$data = json_decode(file_get_contents('php://input'));

$automata = $data->automata;
$pset = intval($data->pset);
$problem = intval($data->problem);
$team_members = $data->team;
$webauth_user = $_ENV['WEBAUTH_USER'];

// Check that the WEBAUTH_USER is in the list of team members
$webauth_user_is_present = false;
foreach ($team_members as &$user)
{
  if (!$db->checkUserExists($user))
  {
    $db->addUser($user);
  }
  if ($webauth_user === $user)
  {
    $webauth_user_is_present = true;
  }
}

if ($webauth_user_is_present)
{
  $db->addSubmission($team_members, $automata, $pset, $problem);
}
else
{
  echo "You are not listed as a team member";
  exit ();
}