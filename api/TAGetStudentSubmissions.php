<?php

/*
TAs-only page.

/api/TAGetStudentSubmissions.php
POST request
body should be array of SunetIDs:
[
  "maxwang7",
  "mprecup"
]
Responds with a JSON array of submissions.
[
  {
    user_id: <sunetid>,
    problem_id: <db problem id>,
    problem_number: <problem number>,
    pset_id: <pset number>,
    automata: <automata as string>
  }
] 
*/

require_once("./db.php");

$db = new DB();

/* Check that user is TA */
$user = $_ENV['WEBAUTH_USER'];
if (!$db->userIsTA($user)) {
  header("HTTP/1.1 401 Unauthorized");
  echo "Unauthorized";
  exit;
}
$students = json_decode(file_get_contents("php://input"), True);
$result = $db->getStudentSubmissions ($students);
echo json_encode ($result);