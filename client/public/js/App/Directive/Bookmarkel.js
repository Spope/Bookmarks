directives.directive("bookmarkel", function(){
    return {
        restrict: "A",
        link: function(scope, element, attrs){

            element.bind('mouseenter', function(e) {
                
                element.children().children().children('.url-bookmark').stop().animate({
                    paddingLeft: 20
                }, 200, function () {
                    //append editButton
                    scope.bookmark.showEditBtn = true;
                    element.children().children().children('.url-bookmark').css('padding-left', '3px');
                    scope.$apply();
                })
                
            });

            element.bind('mouseleave', function(e) {
                
                if(scope.bookmark.showEditBtn) {
                    scope.bookmark.showEditBtn = false;
                    scope.$apply();

                    element.children().children().children('.url-bookmark').css('padding-left', '20px');
                }

                element.children().children().children('.url-bookmark').stop().animate({
                    paddingLeft: 0
                }, 200)
                
            });
        }
    }
});
