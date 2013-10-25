services.factory('LocalCategoryService', [ function() {

    var service = {
        categories: false,

        getCategories: function() {

            return this.categories;
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
        }

    }

    return service;

}]);
