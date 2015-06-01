<?php

/*
Parses TAs.json for a list of TAs and
makes each user a TA. If the SunetID isn't
yet present in the DB, adds a new user
that's a TA. If the SunetID is already a
TA, does nothing.
*/

require_once ("./db.php");

$user = $_ENV['WEBAUTH_USER'];
if ($user !== "maxwang7") {
  exit ();
}

$db = new DB();

$TAs = json_decode (file_get_contents ("./TAs.json"));
foreach ($TAs as $TA) {
  $db->addTA ($TA);
}
