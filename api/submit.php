<?php
/*
/api/submit.php
POST request
{
  "automata": <String>,
  "problem": <Integer, problem number>
  "pset": <Integer, pset>
}
Adds an automata to the "submissions" table, which is the table of submitted
automata. The automata is associated with the WebAuth sunetID, problem, and
pset. Note that this API accepts the problem number, not the problem ID. Once
the submission is complete, the client sends an email to the sunetID and 
cs103.submit@gmail.com.

Sample client-side code:
var gServer.url_prefix = "/class/cs103/cgi-bin/restricted";
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
d3.xhr (gServer.url_prefix + submit_url)
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

require_once("./db.php");
ini_set('display_errors', 'On');
error_reporting(E_ALL);
$db = new DB();
$contents = file_get_contents('php://input');
$data = json_decode($contents);
$automata = $data->automata;
$pset = intval($data->pset);
$problem = intval($data->problem);
$user = $_ENV['WEBAUTH_USER'];
if (!$db->checkUserExists($user)) {
  $db->addUser($user, False);
}
$db->addSubmission($user, $automata, $pset, $problem);

mail ("cs103.submit@gmail.com, $user@stanford.edu",
  $user + " submission",
  "Congrats! You submit on $date_time for problem set #$pset, problem #$problem. You submit with SunetID $user. Your submission data is: $contents. Note that you may resubmit any time for the deadline and overwrite your previous submission.",
  "From: maxwang7@stanford.edu");