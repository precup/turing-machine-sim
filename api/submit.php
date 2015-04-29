<?php
// TODO: Not sure if this code works yet

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
var save_url = "/api/submit.php";

var automata = JSON.stringify (gGraph.save ());
var pset = 1;
var problem = 1;

var pack = {
  automata: automata,
  pset: pset,
  problem: problem
};

console.log(pack);

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
    });

*/

ini_set('display_errors', 'On');
error_reporting(E_ALL);

require_once("./db.php");

$db = new DB();

$data = json_decode(file_get_contents('php://input'));

$automata = $data->automata;
$pset = intval($data->pset);
$problem = intval($data->problem);
$user = $_ENV['WEBAUTH_USER'];

if (!$db->checkUserExists($user)) {
  $db->addUser($user);
}

$db->addSubmission($user, $automata, $pset, $problem);
