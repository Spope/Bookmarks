#Personal bookmarks manager

Build on top of Angular / Node.

##Specification

####Server Side
* NodeJS
* ExpressJS
* Less compiled with Grunt
* MySQL with [Node-MySQL](https://github.com/felixge/node-mysql)

####Client Side 
* AngularJS
* Bower


##Installation

###Server
Go into server/ and run

    npm install
  
   
Import the database schema in server/db/bookmarksv2.sql

###Client
Go into client/ and run

    bower install

##Configuration
The only thing to configure right now is the MySQL connection.

* Duplicate the server/db/connection.js.dist and rename it to connection.js
* Set your parameters into that file

The CSS is written with Less and compiled with grunt. To compile the Less, got to server/ and run

    grunt less

This will compile client/public/less/main.less to client/public/css/main.css.
Less files can also been compiled and browser refreshed each time a less file is updated by running

    grunt watch
