var assert = require("assert");
var bootstrap = require('../../modules/bootstrap');
var connection = bootstrap.getConnection(true);
var Q = bootstrap.getPromise();
var fs = require('fs');
var searchEngineService = require('../../service/SearchEngineService');
var moment = require('moment');

describe('SearchEngineService', function() {

    //Configuration of test data
    beforeEach(function(done) {
        this.timeout(10000);
        if(connection.config.database.search('_test') == -1) {
            throw new Error("It seems that this is not a test database (and this will perform a massivre DROP...)");
        }

        //resetting the database
        fs.readFile('../../db/bookmarksv2.sql', 'utf8', function(err, data) {

            data = 'set foreign_key_checks = 0; '+data+' set foreign_key_checks = 1;';
            connection.query(data, done);
        });
    });

    //////////////
    
    describe('getSearchEngines', function() {

        //Get Bookmarks from a category
        it('should return the 3 search engines', function(done) {
            this.timeout(6000);
            searchEngineService.getSearchEngines().then(function(engines) {

                assert.equal(3, engines.length);
                done();
            }).done(null, done);
            
        });

    });

    describe('getUserSearchEngines', function() {

        //Get Bookmarks from a category
        it('should return the 3 search engines linked with user 1', function(done) {
            this.timeout(6000);
            searchEngineService.getUserSearchEngines(1).then(function(engines) {

                assert.equal(3, engines.length);
                for(var i in engines) {
                    var engine = engines[i];
                    if(engine.id == 1) {

                        assert.equal(engine.name, 'Google');
                        assert.equal(engine.default, 1);
                    }else{
                        assert.equal(engine.default, 0);
                    }
                }
                done();
            }).done(null, done);
            
        });

    });

    describe('initUser', function() {

        //Get Bookmarks from a category
        it('should insert the link of the 3 searh engine for the user id 2', function(done) {
            this.timeout(6000);

            //fake user to allow initUser
            var user = {
                username: "test",
                email: "test@mail.com",
                password: "azezaze"
            };
            connection.query("INSERT INTO user SET ?", user, function(err, rows) {
                if(err) {
                    console.log(err);
                }

                searchEngineService.initUser(2).then(function(data) {

                    

                    searchEngineService.getUserSearchEngines(1).then(function(engines) {

                        assert.equal(3, engines.length);
                        for(var i in engines) {
                            var engine = engines[i];
                            if(engine.id == 1) {

                                assert.equal(engine.name, 'Google');
                                assert.equal(engine.default, 1);
                            }else{
                                assert.equal(engine.default, 0);
                            }
                        }
                        done();
                    }).done(null, done);



                }).done(null, done);
            });
            
        });

    });

});
