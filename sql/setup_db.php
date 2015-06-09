<?php
/*
Sets up the database tables, using the prefix in db_prefix.php.

Visit https://web.stanford.edu/class/cs103/cgi-bin/turing/sql/setup_db.php
to run this script.
*/

require_once ("db_prefix.php");

echo "
use c_cs103_db;

create table ${prefix}users (
  sunetid char(30) not null,
  isTA boolean not null,
  primary key (sunetid)
);

create table ${prefix}automatas (
  id integer not null auto_increment,
  user_id char(30) not null,
  automata mediumtext,
  name char(30) not null,
  primary key (id),
  foreign key (user_id) references users(sunetid),
  unique (name, user_id)
);

create table ${prefix}psets (
  id integer not null,
  primary key (id)
);

create table ${prefix}problems (
  id integer not null auto_increment,
  pset_id integer not null,
  problem_number integer not null,
  primary key (id),
  foreign key (pset_id) references psets(id),
  unique (pset_id, problem_number)
);

create table ${prefix}submissions (
  id integer not null auto_increment,
  user_id char(30) not null,
  problem_id integer not null,
  automata mediumtext,
  primary key (id),
  foreign key (problem_id) references problems(id),
  foreign key (user_id) references users(sunetid),
  unique (problem_id, user_id)
);
";
