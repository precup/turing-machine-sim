# API

Directory: /api

Contains all the server code for the program, written in PHP. Though the purpose of most of the code in this directory is to act as services for the client, some have different use cases. These files can be categorized into three types:

* API code
* Database layer
* Setup scripts

## API code

Files:

* listSaved.php
* listSubmissions.php
* loadPsets.php
* save.php
* getSunetid.php
* loadFromSaved.php
* mail.php
* submit.php
* loadFromSubmissions.php
* TAGetStudentSubmissions.php

As stated previously, these files are consumed as services by the client.TAGetStudentSubmissions.php is used for the TA grading interface. The remaining files are used for the main Automaton designer application. Most of the files follow the following pattern: 

* Parse client request for parameter values
* Offload a database call using functions in db.php
* Respond to the client with the returned value.

## Database layer

File: db.php

Contains a number of abstractions for the database. This file has responsibility for escaping user parameters and handling database errors. The documentation in db.php file goes into greater detail.

## Setup Scripts

Files:

* addTAs.php
* TAs.json

The addTAs.php script is used to initialize the database with the TAs listed in TAs.json. The remaining database setup scripts are in the sql/ directory.