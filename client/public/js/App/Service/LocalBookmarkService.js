services.factory('LocalBookmarkService', [ function() {

    var service = {
        bookmarks: new Array(),

        get: function(id) {
            for(var cat in this.bookmarks) {
                for(var book in this.bookmarks[cat]) {
                    if(this.bookmarks[cat][book].id == id) {
                        return this.bookmarks[cat][book];
                    }
                }
            }

            return false;
        },

        getByCategory: function(idCategory) {

            if(this.bookmarks[idCategory]) {

                return this.bookmarks[idCategory];
            } else {

                return false;
            }
        },





        //Setter
        setBookmark: function (bookmark) {

            for(var cat in this.bookmarks) {
                for(var book in this.bookmarks[cat]) {
                    if(this.bookmarks[cat][book].id == bookmark.id) {
                        this.bookmarks[cat][book] = bookmark;
                        
                        return true;
                    }
                }
            }

            return false;
        },

        setByCategory: function (idCategory, bookmarks) {

            this.bookmarks[idCategory] = bookmarks;
        },

        addBookmark: function (bookmark) {

            var idCategory = bookmark.category_id;
            if(this.bookmarks[idCategory]) {

                this.bookmarks[idCategory].push(bookmark);
            } else {
                return false;
            }

            return true;
        }

    }

    return service;

}]);
