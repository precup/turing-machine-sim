<?php


/* 
/api/load.php
GET request
Parameters:
- name = string that is the automaton's name
(sunetID is an implicit parameter of the logged in user)
*/

require_once("./db.php");

$db = new DB();

$user = $_ENV["WEBAUTH_USER"];
$automata_name = $_GET["name"];

$result = $db->getAutomataOfUser($user, $automata_name);
echo json_encode($result);