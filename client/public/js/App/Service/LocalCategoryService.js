services.factory('LocalCategoryService', [ function() {

    var service = {
        categories: false,

        getCategories: function() {

            return this.categories;
        },






        //Setter
        setCategories: function (categories) {

            this.categories = categories;
        }

    }

    return service;

}]);
