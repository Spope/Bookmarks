var assert = require("assert");
var bootstrap = require('../../modules/bootstrap');
var connection = bootstrap.getConnection(true);
var Q = bootstrap.getPromise();
var fs = require('fs');
var bookmarkService = require('../../service/BookmarkService');

describe('BookmarkService', function() {

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
    
    describe('getBookmarks', function() {

        //Get Bookmarks from a category
        it('should return the 6 bookmarks from the category 1 without parent', function(done) {
            this.timeout(6000);
            bookmarkService.getBookmarks(1, 1).then(function(bookmarks) {

                assert.equal(6, bookmarks.length);
                done();
            }).done(null, done);
            
        });

        //Get bookmarks into a parent folder
        it('should return the 2 bookmarks from the category 1 with parent 29', function(done) {
            this.timeout(6000);
            bookmarkService.getBookmarks(1, 1, 29).then(function(bookmarks) {

                assert.equal(2, bookmarks.length);
                done();
            }).done(null, done);
            
        });
    });

    //////////////

    describe('getBookmark', function() {

        //get a single bookmark
        it('should return the bookmark id 4 from the category 1, and his name should be Thinkster', function(done) {
            this.timeout(6000);
            bookmarkService.getBookmark(1, 4).then(function(bookmark) {

                assert.equal(bookmark.id, 4);
                assert.equal(bookmark.name, "Thinkster");
                done();
            }).done(null, done);
            
        });

        //get a single bookmark into a parent folder
        it('should return the bookmark id 35 from the category 1 into parent 29, and his name should be Repo', function(done) {
            this.timeout(6000);
            bookmarkService.getBookmark(1, 35).then(function(bookmark) {

                assert.equal(bookmark.id, 35);
                assert.equal(bookmark.name, "Repo");
                done();
            }).done(null, done);
            
        });
    });

    //////////////
    
    describe('addBookmark', function() {

        it('should add a bookmark into the category 1 without parent', function(done) {

            //variables from POST
            var bookmark = {
                "url"              : "http://www.test.com/",
                "name"             : "Hello",
                "category_id"      : "1",
                "position"         : 6,
                "bookmark_type_id" : 1
            };
            //given by controller
            bookmark.user_id = 1;

            bookmarkService.addBookmark(bookmark).then(function(bookmark) {

                assert.equal(bookmark.id, 36);
                assert.equal(bookmark.parent, null);
                assert.equal(bookmark.position, 6);

                done();

            }).done(null, done);
        });

        //Adding a bookmark into a parent folder
        it('should add a bookmark into the category 1 with parent 29', function(done) {

            //variables from POST
            var bookmark = {
                "url"              : "http://www.test.com/",
                "name"             : "Hello",
                "category_id"      : "1",
                "position"         : 2,
                "parent"           : 29,
                "bookmark_type_id" : 1
            };
            //given by controller
            bookmark.user_id = 1;

            bookmarkService.addBookmark(bookmark).then(function(bookmark) {

                assert.equal(bookmark.id, 36);
                assert.equal(bookmark.parent, 29);
                assert.equal(bookmark.position, 2);

                done();

            }).done(null, done);
        });
    });

    ////////////
    
    describe('editBookmark', function() {

        it('should edit bookmark name and url', function(done) {

            var bookmark = {
                "id":4,
                "name":"Test",
                "url":"http://www.test.io",
                "position":1,
                "parent":null,
                "user_id":1,
                "category_id":1,
                "bookmark_type_id":1,
                "showEditBtn":false
            };

            bookmarkService.editBookmark(1, bookmark).then(function(bookmark) {

                bookmarkService.getBookmark(1, 4).then(function(response) {

                    assert.equal(response.id, 4);
                    assert.equal(response.parent, null);
                    assert.equal(response.position, 1);
                    assert.equal(response.name, 'Test');
                    assert.equal(response.url, 'http://www.test.io');
                    done();

                }).done(null, done);

            }).done(null, done);
        });

        it('should edit bookmark position', function(done) {

            var bookmark = {
                "id":4,
                "name":"Thinkster",
                "url":"http://www.thinkster.io",
                "position":3,
                "parent":null,
                "user_id":1,
                "category_id":1,
                "bookmark_type_id":1,
                "showEditBtn":true
            };

            var correctValue = [
                {id:1, position:0},
                {id:24, position:1},
                {id:2, position:2},
                {id:4, position:3},
                {id:5, position:4},
                {id:29, position:5},
            ];

            bookmarkService.editBookmark(1, bookmark).then(function(bookmark) {

                bookmarkService.getBookmarks(1, 1).then(function(response) {

                    for(var i in response) {
                        assert.equal(response[i].id, correctValue[i].id);
                        assert.equal(response[i].parent, null);
                        assert.equal(response[i].position, correctValue[i].position);
                    }
                    done();

                }).done(null, done);

            }).done(null, done);
        });

        describe('Change category of a bookmark', function() {
            beforeEach(function(done) {
                this.timeout(10000);
                var bookmark = {
                    "id":4,
                    "name":"Thinkster",
                    "url":"http://www.thinkster.io",
                    "position":2,
                    "parent":null,
                    "user_id":1,
                    "category_id":2,
                    "bookmark_type_id":1,
                    "showEditBtn":true
                };

                bookmarkService.editBookmark(1, bookmark).then(function(bookmark) {
                    done();
                });
            });

            it('should have moved a bookmark into another category', function(done) {

                bookmarkService.getBookmark(1, 4).then(function(bookmark) {

                    assert.equal(bookmark.category_id, 2);
                    done();

                }).done(null, done);
            });

            it('should have update correctly the bookmark position into its new category', function(done) {

                bookmarkService.getBookmarks(1, 2).then(function(response) {

                    var correctValue = [
                        {id:28, position:0},
                        {id:26, position:1},
                        {id:4, position:2},
                        {id:13, position:3},
                        {id:27, position:4},
                    ];

                    for(var i in response) {
                        assert.equal(response[i].id, correctValue[i].id);
                        assert.equal(response[i].parent, null);
                        assert.equal(response[i].position, correctValue[i].position);
                    }

                    done();

                }).done(null, done);
            });

            it('should have update correctly the bookmark position into its old category', function(done) {

                bookmarkService.getBookmarks(1, 1).then(function(response) {

                    var correctValue = [
                        {id:1, position:0},
                        {id:24, position:1},
                        {id:2, position:2},
                        {id:5, position:3},
                        {id:29, position:4},
                    ];

                    for(var i in response) {
                        assert.equal(response[i].id, correctValue[i].id);
                        assert.equal(response[i].parent, null);
                        assert.equal(response[i].position, correctValue[i].position);
                    }

                    done();

                }).done(null, done);
            });
        });

        describe('Change folder category', function() {

            beforeEach(function(done) {
                this.timeout(5000);
                var bookmark = {
                    "id":29,
                    "name":"Folder",
                    "url":"",
                    "position":2,
                    "parent":null,
                    "user_id":1,
                    "category_id":2,
                    "bookmark_type_id":2,
                    "showEditBtn":true
                };

                bookmarkService.editBookmark(1, bookmark).then(function(bookmark) {
                    done();

                }).done(null, done);
            });

            it('should have update the bookmark', function(done) {
                bookmarkService.getBookmark(1, 29).then(function(response) {

                    assert.equal(response.name, 'Folder');
                    assert.equal(response.position, 2);
                    assert.equal(response.category_id, 2);

                    done();

                }).done(null, done);
            });

            it('should have update the children bookmarks category', function(done) {
                bookmarkService.getBookmarks(1, 2, 29).then(function(bookmarks) {

                    assert.equal(bookmarks.length, 2);
                    console.log(bookmarks);

                    for(var i in bookmarks) {
                        assert.equal(bookmarks[i].category_id, 2);
                        console.log(bookmarks[i].name);
                    }

                    done();

                }).done(null, done);
            });
        });

        describe('Change bookmark infos, category, and name', function() {

            beforeEach(function(done) {
                this.timeout(5000);
                var bookmark = {
                    "id":4,
                    "name":"Test",
                    "url":"http://www.thinkster.io",
                    "position":2,
                    "parent":null,
                    "user_id":1,
                    "category_id":2,
                    "bookmark_type_id":1,
                    "showEditBtn":true
                };

                bookmarkService.editBookmark(1, bookmark).then(function(bookmark) {
                    done();

                }).done(null, done());
            });

            it('should have update the bookmark', function(done) {
                bookmarkService.getBookmark(1, 4).then(function(bookmark) {

                    assert.equal(bookmark.name, 'Test');
                    assert.equal(bookmark.position, 2);
                    assert.equal(bookmark.category_id, 2);

                    done();

                }).done(null, done);
            });
        });
    });

});
