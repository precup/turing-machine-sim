use c_cs103_db;
create table users (
  sunetid char(30) not null,
  isTA boolean not null,
  primary key (sunetid)
);

create table automatas (
  id integer not null auto_increment,
  user_id char(30) not null,
  automata mediumtext,
  name char(30) not null,
  primary key (id),
  foreign key (user_id) references users(sunetid)
);

/* The tables below will be integrated later*/

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
  user_id integer,
  problem_id integer,
  automata mediumtext,
  primary key (id),
  foreign key (user_id) references users(id),
  foreign key (problem_id) references problems(id)
);
