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
    $result;
    $query_string = "select sunetid from users where sunetid=?";
    if ($stmt = $db->prepare($query_string)) {
      $stmt->bind_param("s", $sunetid);
      $stmt->execute();
      $stmt->bind_result($result);
      $stmt->fetch();
      echo json_encode($result);
      return $result->num_rows > 0;
    } else {
      header("HTTP/1.1 500 Internal Server Error");
      echo "problems";
    }
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
}
