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
  foreign key (user_id) references users(sunetid),
  unique (name, user_id)
);

create table submissions (
  id integer not null auto_increment,
  pset_id integer not null,
  problem_id integer not null,
  automata mediumtext,
  primary key (id)
);

create table user_submissions (
  user_id char(30) not null,
  submission_id integer not null,
  unique (user_id, submission_id),
  foreign key (user_id) references users(sunetid),
  foreign key (submission_id) references submissions(id)
);