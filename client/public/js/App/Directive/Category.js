directives.directive("category", function(){
    return {
        restrict: "A",

        link: function(scope, element, args){
            element.bind('mouseenter', function() {
                element.addClass("hover");
                element.children('.category-add-bookmark').show();

            })

            element.bind('mouseleave', function() {
                element.removeClass("hover");
                element.children('.category-add-bookmark').hide();

            })
        }
    };
});
