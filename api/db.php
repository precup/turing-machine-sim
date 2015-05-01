<?php

/*
Handles all errors by exiting.
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

  public function addSubmission($sunetids, $automata, $pset, $problem) {
    // echo 1;
    $db = $this->db;
    $clean_sunetids = array();
    foreach ($sunetids as &$sunetid)
    {
      $clean_sunetids[] = $db->real_escape_string ($sunetid);
    }
    // echo 3;
    // echo json_encode($clean_sunetids);

    $automata = $db->real_escape_string($automata);

    $result = $db->autocommit(FALSE);

    // $result = $db->begin_transaction ();
    if ($result === false) {
      echo "Internal server error";
      exit ();
    }
    $query_string_insert_submission = 
      "insert into submissions (pset_id, problem_id, automata)
      values ($pset, $problem, \"$automata\");";
    $result = $db->query ($query_string_insert_submission);
    if ($result === false) {
      echo "Internal server error";
      exit ();
    }
    $query_string_set = "set @submission_id=last_insert_id();";
    $result = $db->query ($query_string_set);
    if ($result === false) {
      echo "Internal server error";
      exit ();
    }
    foreach ($clean_sunetids as &$sunetid)
    {
      $query_string_insert_user_submissions =
        "insert into user_submissions (user_id, submission_id)
        values (\"$sunetid\", @submission_id);";
      $result = $db->query ($query_string_insert_user_submissions);
      if ($result === false) {
        echo "Internal server error";
        exit ();
      }
    }
    $result = $db->commit ();
    if ($result === false) {
        echo "Internal server error";
        exit ();
      }

    // $query_string .= "set @submission_id=last_insert_id();";

    // foreach ($clean_sunetids as &$sunetid)
    // {
    //   $query_string .= "insert into user_submissions (user_id, submission_id) values (\"$sunetid\", @submission_id);";
    // }

    // $query_string .= "commit;";

    // echo $query_string;

    // $result = $db->query($query_string);
    // echo $db->error;
    // if ($result === False) exit();
  }

  public function getSubmissionsOfUser($sunetid) {
    $db = $this->db;
    $sunetid = $db->real_escape_string($sunetid);

    $query_string = "select pset_id, problem_id from submissions where user_id=\"$sunetid\";";
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
    $query_string = "select automata from submissions where user_id=\"$sunetid\" and pset_id=\"$pset\" and problem_id=\"$problem\";";
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
}
