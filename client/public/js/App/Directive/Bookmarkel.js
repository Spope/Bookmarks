directives.directive("bookmarkel", ['$compile', '$templateCache', function($compile, $templateCache){
    return {
        restrict: "A",
        link: function(scope, element, attrs){

            var template = "";
            if(scope.bookmark.bookmark_type_id == 1) {
                template = $templateCache.get('js/App/View/Bookmarks/bookmark.html');
            }
            if(scope.bookmark.bookmark_type_id == 2) {
                
                template = $templateCache.get('js/App/View/Bookmarks/folder.html');
                element.addClass('folder');
            }

            element.append($compile(template)(scope));

            if(attrs.bookmarkel == ""){

                var editBtn = '<a class="btn-edit-bookmark pointer" ng-click="editBookmark(bookmark)">';
                editBtn += '<img src="/img/bookmark/pen.png" width="16" height="16" />';
                editBtn += '</a>';


                element.bind('mouseenter', function(e) {
                    element.find('.url-bookmark').stop().animate({
                        paddingLeft: 20
                    }, 200, function () {
                        //append editButton
                        element.find('.url-bookmark').before($compile(editBtn)(scope));
                        element.find('.url-bookmark').css('padding-left', '0px');
                    })
                });

                element.bind('mouseleave', function(e) {

                    if(element.find('.btn-edit-bookmark')[0]) {
                        element.find('.btn-edit-bookmark').remove();

                        element.find('.url-bookmark').css('padding-left', '20px');
                    }

                    element.find('.url-bookmark').stop().animate({
                        paddingLeft: 0
                    }, 200)
                });
            }
        }
    }
}]);
