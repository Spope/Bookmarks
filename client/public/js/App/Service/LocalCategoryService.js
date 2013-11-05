services.factory('LocalCategoryService', [ function() {

    var service = {
        categories: [],

        getCategories: function() {

            //wil break the reference
            return [].concat(this.categories);
        },

        get: function(id) {

            for(var i in this.categories) {
                if(this.categories[i].id == id) {

                    return this.categories[i];
                }
            }
        },






        //Setter
        setCategories: function (categories) {

            this.categories = categories;
        },

        setCategory: function (category) {

            for(var i in this.categories) {
                if(this.categories[i].id == category.id) {
                    this.categories[i] = category;
                }
            }
        },

        addCategory: function (category) {

            this.categories.push(category);

            return true;
        },

        remove: function(category) {
            for(var i in this.categories) {
                if(this.categories[i].id == category.id) {
                    this.categories.splice(i, 1);
                }
            }
        }

    }

    return service;

}]);
