services.factory('LocalBookmarkService', [ function() {

    var service = {
        bookmarks: new Array(),
        /**
         * bookmarks = [
         *      idCategory = [
         *          idParent = [
         *              book1, book2...
         *          ],
         *          'root' = []
         *      ]
         *  ]
         */

        get: function(id) {
            for(var cat in this.bookmarks) {
                for(var parent in this.bookmarks[cat]) {
                    for(var book in this.bookmarks[cat][parent]) {
                        if(this.bookmarks[cat][parent][book].id == id) {
                            return this.bookmarks[cat][parent][book];
                        }
                    }
                }
            }

            return false;
        },

        getByCategory: function(idCategory, parent) {

            if(!parent) {
                parent = 'root';
            } else {
                parent = parent.id;
            }

            if(this.bookmarks[idCategory] && this.bookmarks[idCategory][parent]) {

                return this.bookmarks[idCategory][parent];
            } else {

                return false;
            }
        },

        getParent: function(bookmark) {
            for(var cat in this.bookmarks) {
                for(var parent in this.bookmarks[cat]) {
                    for(var book in this.bookmarks[cat][parent]) {
                        if(this.bookmarks[cat][parent][book].id == bookmark.id) {

                            if(!this.bookmarks[cat][parent][book].parent) {
                                return parent;
                            } else {
                                return this.get(this.bookmarks[cat][parent][book].parent);
                            }
                        }
                    }
                }
            }

            return null;
        },





        //Setter
        setBookmark: function (bookmark) {

            for(var cat in this.bookmarks) {
                for(var parent in this.bookmarks[cat]) {
                    for(var book in this.bookmarks[cat][parent]) {
                        if(this.bookmarks[cat][parent][book].id == bookmark.id) {
                            this.bookmarks[cat][parent][book] = bookmark;
                            
                            return true;
                        }
                    }
                }
            }

            return false;
        },

        setByCategory: function (idCategory, parent, bookmarks) {

            if(!parent) {
                parent = 'root';
            } else {
                parent = parent.id;
            }

            if(!this.bookmarks[idCategory]) {
                this.bookmarks[idCategory] = new Array();
            }
            this.bookmarks[idCategory][parent] = bookmarks;
        },

        addBookmark: function (bookmark) {

            var idCategory = bookmark.category_id;
            var parent = bookmark.parent;
            if(!parent) {
                parent = 'root';
            } else {
                parent = parent;
            }

            if(this.bookmarks[idCategory][parent]) {

                this.bookmarks[idCategory][parent].push(bookmark);
            } else {
                return false;
            }

            return true;
        }

    }

    return service;

}]);
