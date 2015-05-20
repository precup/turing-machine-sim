<?php

require_once("./db.php");

$json = json_decode ('
  [
    {
      "id": 7,
      "name": "Problem Set 6",
      "problems": [
        { "id": 1, "name": "Problem One: Binary Sorting", "charSet": "01", "type": "tm"},
        { "id": 2, "name": "Problem Two i: The Collatz Conjecture", "charSet": "1", "type": "tm" },
        { "id": 3, "name": "Problem Two ii: The Collatz Conjection", "charSet": "1", "type": "tm" },
        { "id": 4, "name": "Problem Two iii: The Collatz Conjection", "charSet": "1", "type": "tm" }
      ]
    }
  ]
  ');
echo json_encode ($json);
$db = new DB();
foreach ($json as $pset) {
  echo $pset->id;
  $db->addPset ($pset->id);
  foreach ($pset->problems as $problem) {
    echo $problem->id;
    $db->addProblem ($pset->id, $problem->id);
  }
}
