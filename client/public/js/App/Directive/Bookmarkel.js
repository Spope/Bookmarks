directives.directive("bookmarkel", ['$compile', function($compile){
    return {
        restrict: "A",
        link: function(scope, element, attrs){

            var elems = '<a class="btn-edit-bookmark pointer" ng-click="editBookmark(bookmark)">';
            elems += '<img src="/img/bookmark/pen.png" />';
            elems += '</a>';

            element.bind('mouseenter', function(e) {
                
                element.children().children().children('.url-bookmark').stop().animate({
                    paddingLeft: 20
                }, 200, function () {
                    //append editButton
                    element.find('.url-bookmark').before($compile(elems)(scope));
                    element.children().children().children('.url-bookmark').css('padding-left', '3px');
                    scope.$apply();
                })
            });

            element.bind('mouseleave', function(e) {

                if(element.find('.btn-edit-bookmark')[0]) {
                    element.find('.btn-edit-bookmark').remove();

                    element.children().children().children('.url-bookmark').css('padding-left', '20px');
                }

                element.children().children().children('.url-bookmark').stop().animate({
                    paddingLeft: 0
                }, 200)
            });

            //Hack to trigger mouse leave when clicking on a folder
            element.bind('mouseup', function(e) {
                //$(this).trigger('mouseleave');
            });
        }
    }
}]);
