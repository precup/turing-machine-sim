<?php

/*
file: api/db.php
class: DB

Used as an abstraction layer for all interaction with the database.
DB builds on top of the StanfordApp() class, which has the same interface
as provided by Mysqli.

Documentation for StanfordApp() can be found here:
https://web.stanford.edu/dept/its/communications/webservices/wiki/index.php/How_to_configure_and_access_MySQL_using_the_Stanford_Web_Application_Toolkit

Documentation for Mysqli can be found here: 
http://php.net/manual/en/book.mysqli.php

The pattern used in most functions is:
- escape user-variables
- perform a query
- check the $db object for errors
- If no errors, return. Otherwise, exit.

*/

require_once("stanford.app.php");

class DB
{
  private $db;

  public function __construct()
  {
    try {

      $app = new StanfordApp("/afs/ir.stanford.edu/class/cs103/db_config/prodconfig.yaml");
      $this->db = $app->db;
      $this->db->connect(); 

    } catch (Exception $e) {

      echo $e->getMessage();
      exit();

    }
  }

  public function fetchAll($result) 
  {
    $all = array();
    while ($row = $result->fetch_assoc()) {
      array_push($all, $row);
    }
    return $all;
  }

  public function checkUserExists($sunetid)
  {
    $db = $this->db;
    $sunetid = $db->real_escape_string($sunetid);
    $query_string = "select * from users where sunetid=\"$sunetid\"";
    $result = $db->query($query_string);
    return $result->num_rows > 0;
  }

  public function addUser($sunetid, $isTA)
  {
    $db = $this->db;
    $isTA = $isTA ? 1 : 0;
    $query_string = "insert into users (sunetid, isTA) values(\"$sunetid\",$isTA)";
    $result = $db->query($query_string);
    if ($result === False) exit(); 
  }

  public function addAutomata($sunetid, $automata, $name) {
    $db = $this->db;
    $automata = $db->real_escape_string($automata);
    $name = $db->real_escape_string($name);


    // TODO: test this line again
    $query_string = "insert into automatas (user_id, automata, name) values(\"$sunetid\", \"$automata\", \"$name\") on duplicate key update automata=\"$automata\";";
    $result = $db->query($query_string);
    if ($result === False) exit();
  }

  public function getAllAutomataOfUser($sunetid) {
    $db = $this->db;
    $sunetid = $db->real_escape_string($sunetid);

    $query_string = "select * from automatas where user_id = \"$sunetid\";";
    $result = $db->query($query_string);
    if ($result === False) exit();
    return $this->fetchAll($result);
  }

  public function getAutomataOfUser($sunetid, $automata_name) {
    $db = $this->db;
    $sunetid = $db->real_escape_string($sunetid);
    $automata_name = $db->real_escape_string($automata_name);

    $query_string = "select * from automatas where name=\"$automata_name\" and user_id=\"$sunetid\";";
    $result = $db->query($query_string);
    if ($result === False) exit();
    if ($result->num_rows === 0) {
      echo "Something is wrong with your automata...";
      exit();
    }
    return $this->fetchAll($result); 
  }

  public function addSubmission($sunetid, $automata, $pset, $problem) {
    echo $pset;
    echo $problem;
    $db = $this->db;
    $sunetid = $db->real_escape_string($sunetid);
    $automata = $db->real_escape_string($automata);
    # get the problem id which matches the pset and problem combination
    $query_string_prob_id = 
      "select id
      from problems
      where pset_id=$pset and problem_number = $problem;";
    $result = $db->query($query_string_prob_id);
    if ($result === False) exit();
    $problem_id = $this->fetchAll($result)[0]["id"];
    $query_string = 
      "insert into submissions (user_id, problem_id, automata)
      values (\"$sunetid\", $problem_id, \"$automata\")
      on duplicate key update automata=\"$automata\";";
    $result = $db->query($query_string);
    if ($result === False) {
      echo "exiting";
      exit();
    }
  }

  public function addPset($pset) {
    if(gettype($pset) !== "integer") {
      echo "pset not integer";
      exit();
    }
    $db = $this->db;
    $query_string = 
      "insert into psets (id)
      values ($pset);";
    $result = $db->query ($query_string);
    if ($result === False) exit();
  }

  public function addProblem($pset, $problem) {
    if(gettype($pset) !== "integer" || gettype($problem) !== "integer") {
      echo "pset or problem not integer";
      exit();
    }
    $db = $this->db;
    $query_string =
      "insert into problems (pset_id, problem_number)
      values ($pset, $problem);";
    $result = $db->query($query_string);
    if ($result === False) exit();
  }

  public function getSubmissionsOfUser($sunetid) {
    $db = $this->db;
    $sunetid = $db->real_escape_string($sunetid);

    $query_string =
      "select problems.pset_id, problems.problem_number
      from submissions
      join (problems) on (problems.id=submissions.problem_id)
      where submissions.user_id=\"$sunetid\";";
    $result = $db->query($query_string);
    if ($result === False) exit();
    return $this->fetchAll($result); 
  }

  public function getAutomataOfSubmission($sunetid, $pset, $problem) {
    $db = $this->db;
    $sunetid = $db->real_escape_string($sunetid);
    if(gettype($pset) !== "integer" || gettype($problem) !== "integer") {
      echo "pset or problem not integers";
      exit();
    }
    $query_string =
      "select submissions.automata
      from submissions
      join (problems) on (problems.id=submissions.problem_id)
      where submissions.user_id=\"$sunetid\" and 
        problems.pset_id=$pset and 
        problems.problem_number=$problem;";
    $result = $db->query($query_string);
    if ($result === False) {
      echo "Internal Server Error";
      exit();
    }
    if ($result->num_rows > 1) {
      echo "That shouldn't happen...";
      exit();
    }
    if ($result->num_rows === 0) {
      return False;
    }
    return $this->fetchAll($result); 
  }

  public function addTA($sunetid) {
    $db = $this->db;
    $sunetid = $db->real_escape_string($sunetid);
    $query_string = 
      "insert into users (sunetid, isTA)
      values (\"$sunetid\", 1)
      on duplicate key update isTA=1;
      ";
    $result = $db->query($query_string);
    if ($result === False) {
      echo "Internal Server Error";
      exit ();
    }
  }

  public function userIsTA($sunetid) {
    $db = $this->db;
    $sunetid = $db->real_escape_string($sunetid);
    $query_string =
      "
      select isTA
      from users
      where sunetid=\"$sunetid\";
      ";
    $result = $db->query($query_string);
    if ($result === False) {
      header("HTTP/1.1 500 Internal Server Error");
      echo "Internal Server Error";
      exit ();
    }
    return intval ($this->fetchAll($result) [0]["isTA"]) === 1
      ? True : False;
  }

  public function getStudentSubmissions($sunetids_) {
    $db = $this->db;
    $sunetids = []; // escaped sunetids
    foreach ($sunetids_ as $sunetid) {
      array_push ($sunetids, $db->real_escape_string($sunetid));
    }
    $sunetids_as_string = "";
    $first = True;
    foreach ($sunetids as $sunetid) {
      if ($first === True) {
        $sunetids_as_string .= "user_id=\"$sunetid\" ";
        $first = False;
        continue;
      }
      $sunetids_as_string .= " or user_id=\"$sunetid\" ";
    }
    $query_string =
      "
      select submissions.user_id, submissions.problem_id, 
        problems.problem_number, problems.pset_id, submissions.automata
      from submissions
      join (problems) on (problems.id=submissions.problem_id)
      where $sunetids_as_string;
      ";
    $result = $db->query ($query_string);
    if ($result === False) {
      header("HTTP/1.1 500 Internal Server Error");
      echo "Internal Server Error";
      exit ();
    }
    return $this->fetchAll($result);
  }

  public function userExists($sunetid) {
    $db = $this->db;
    $sunetid = $db->real_escape_string($sunetid);
    $query_string = 
    "
      select *
      from users
      where sunetid=\"$sunetid\";
    ";
    $result = $db->query ($query_string);
    if ($result === False) {
      header("HTTP/1.1 500 Internal Server Error");
      echo "Internal Server Error";
      exit ();
    }
    if ($result->num_rows === 0) {
      return False;
    }
    return True;
  }
}
