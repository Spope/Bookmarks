var config = require('../config/config');

module.exports = {
    getMysql      : function(){
        if(!this.mysql){
            this.mysql = require('mysql');
        }

        return this.mysql;
    },

    getConnection : function(test){
        if(!this.connection){
            this.connection = require('../db/connection')(this.getMysql(), config.db, test);
        }

        return this.connection;
    },

    getDbEngine   : function(){
        if(!this.dbEngine){
            this.dbEngine = require('../db/engine')(this.getConnection());
        }

        return this.dbEngine;

    },

    getSecurity   : function(){
        if(!this.securiy){
            this.security = require('./security');
        }

        return this.security;

    },

    getPromise    : function(){
        if(!this.promise){
            this.promise = require('q');
        }

        return this.promise;
    }
}
