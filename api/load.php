<?php


/* 
/api/load.php
GET request
should contain the parameter "id"
*/


ini_set('display_errors', 'On');
error_reporting(E_ALL);
require_once("./db.php");

$db = new DB();

$user = $_ENV["WEBAUTH_USER"];
$automata_id = intval($_GET["id"]);

$result = $db->getAutomataOfUser($user, $automata_id);
echo json_encode($result);

