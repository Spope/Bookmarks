directives.directive("category", function(){
    return {
        restrict: "A",
        link: function(scope, element, args){
            scope.bookmark = {};
            element.bind('mouseenter', function() {
                element.addClass("hover");
                element.find('.category-add-bookmark').stop();
                element.find('.category-add-bookmark').slideDown(100);

            })

            element.bind('mouseleave', function() {
                element.removeClass("hover");
                element.find('.category-add-bookmark').stop();
                element.find('.category-add-bookmark').slideUp(100);

            })

            var firstStep = function() {
                if(scope.bookmark.url != "" && element.find('.add-bookmark-url').hasClass('ng-valid')) {
                    element.find('.add-bookmark-url, .btn-add-bookmark-url').hide();
                    element.find('.add-bookmark-name, .btn-add-bookmark-name').show();
                    element.find('.add-bookmark-name').focus();
                }
            }

            var lastStep = function() {
                element.find('.add-bookmark-url, .btn-add-bookmark-url').show();
                element.find('.add-bookmark-name, .btn-add-bookmark-name').hide();
                console.log(scope.bookmark.url, scope.bookmark.name);
            }

            element.find('.btn-add-bookmark-url').bind('click', function(event) {
                firstStep();
            })
            element.find('.add-bookmark-url').bind('keypress', function(e) {
                if(e.keyCode == 13) {
                    firstStep();
                    //trigger the html5 validation
                    e.target.blur();
                    e.target.focus();
                    e.preventDefault();

                    return false;
                }
            })

            element.find('.btn-add-bookmark-name').bind('click', function(event) {
                lastStep();
            })

        }
    };
});
