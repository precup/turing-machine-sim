create database automata;
use automata;
create table users (
  id integer not null  auto_increment,
  first_name char(30),
  last_name char(30),
  sunetid char(30),
  isTA boolean,
  primary key (id)
);

create table automatas (
  id integer not null auto_increment,
  user_id integer,
  automata mediumtext,
  name char(30),
  primary key (id),
  foreign key (user_id) references users(id)
);

create table psets (
  id integer not null auto_increment,
  primary key (id)
);

create table problems (
  id integer not null auto_increment,
  pset_id integer, 
  primary key (id),
  foreign key (pset_id) references psets(id)
);

create table submissions (
  id integer not null auto_increment,
  automata_id integer unique,
  problem_id integer,
  primary key (id),
  foreign key (automata_id) references automatas(id),
  foreign key (problem_id) references problems(id)
);
