/* Removes all data from the database. BE CAREFUL WITH THESE COMMANDS. Because they are destructive,
these SQL commands are not packaged as a PHP script. Copy-paste them into the MySQL interface at
https://tools.stanford.edu/phpmyadmin/index.php?db=c_cs103_db&table=submissions. */
drop table submissions;
drop table problems;
drop table psets;
drop table automatas;
drop table users;
