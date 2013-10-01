directives.directive("bookmark", function(){
    return {
        restrict: "A",
        link: function(scope, element, attrs){

            element.bind('mouseenter', function(e) {
                
                element.children('.url-bookmark').stop().animate({
                    paddingLeft: 20
                }, 200, function () {
                    //append editButton
                    scope.bookmark.showEditBtn = true;
                    element.children('.url-bookmark').css('padding-left', '6px');
                    scope.$apply();
                })
                
            });

            element.bind('mouseleave', function(e) {
                scope.bookmark.showEditBtn = false;
                scope.$apply();
                element.children('.url-bookmark').css('padding-left', '20px');

                element.children('.url-bookmark').stop().animate({
                    paddingLeft: 0
                }, 200)
                
            });
        }
    }
});
