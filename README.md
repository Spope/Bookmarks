**Warning, this project is under heavy development and is not usable for now.**

#Personal bookmarks manager

Build on top of Angular / Node.

##Specification

####Server Side
* NodeJS
* ExpressJS
* MySQL with [Node-MySQL](https://github.com/felixge/node-mysql)
* Grunt
* Less

####Client Side
* AngularJS
* Bower


##Installation

###Server
Go into **server/** and run

    npm install

Import the database schema in **server/db/bookmarksv2.sql**

Node has to be started from the project folder:

    node server/app.js


###Client
Go into **client/** and run

    bower install

If bower ask which version of Angular you want, pick the 1.0.8.

##Configuration
The only thing to configure is the MySQL connection.

* Duplicate the **server/config/config.js.dist** and rename it to **config.js**
* Set your parameters into that file

The CSS is written with Less and compiled with grunt. To compile the Less, go to **server/** and run

    grunt less

This will compile **client/public/less/main.less** to **client/public/css/main.css**.
Less files can also be compiled and browser refreshed each time a less file is updated by running

    grunt watch

To build the app, you need to run :

	grunt compile

This will concatenate the .js files and compress them into **client/public/build/js**. It also cache the AngularsJS tempaltes into a templates.js file. This tempaltes.js file will only be used on producton.

This can be automaticaly done using git hooks. Example on pre-commit :

    #!/bin/sh
    cd ~/public_html/bookmarks/server/
    grunt compile
    cd ../
    git add ~/public_html/bookmarks/client/public/build/
    exit 0

###Debug Mode

The **config.js** file allow to switch debug mode.
When activated, debug mode will load raw .js files separately and uncompressed. Livereload will also be included (to allow less refresh).
If debug is set to false, compiled js files will be used.

##Contributors
* [Spope](https://github.com/Spope) Front end / Back end.
* [Pilikouk](http://pilikouk.fr/) Less / Design

