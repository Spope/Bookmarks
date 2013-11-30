directives.directive("bookmarkel", ['$compile', function($compile){
    return {
        restrict: "A",
        link: function(scope, element, attrs){

            var template = "";
            if(scope.bookmark.bookmark_type_id == 1) {
                template += '<a class="url-bookmark" ng-href="{{bookmark.url}}" target="_blank" title="{{bookmark.name}}">';
                //template += '<img ng-src="http://placehold.it/16x16" height="16" width="16" />';
                template += '<img ng-src="http://www.google.com/s2/favicons?domain={{bookmark.url|removeHTTP}}" height="16" width="16" />';
                template += '{{bookmark.name|truncate:24}}';
                template += '</a>';
            }
            if(scope.bookmark.bookmark_type_id == 2) {
                template += '<a class="url-bookmark" href="" title="{{bookmark.name}}" ng-click="setParent(bookmark)">';
                template += '<img src="/img/bookmark/folder.png" />';
                template += '{{bookmark.name|truncate:24}}';
                template += '</a>';
            }

            element.append($compile(template)(scope));

            if(attrs.bookmarkel == ""){

                var editBtn = '<a class="btn-edit-bookmark pointer" ng-click="editBookmark(bookmark)">';
                editBtn += '<img src="/img/bookmark/pen.png" width="16" height="16" />';
                editBtn += '</a>';

                

                
                element.bind('mouseenter', function(e) {
                    element.children('.url-bookmark').stop().animate({
                        paddingLeft: 20
                    }, 200, function () {
                        //append editButton
                        element.find('.url-bookmark').before($compile(editBtn)(scope));
                        element.children('.url-bookmark').css('padding-left', '0px');
                    })
                });

                element.bind('mouseleave', function(e) {

                    if(element.find('.btn-edit-bookmark')[0]) {
                        element.find('.btn-edit-bookmark').remove();

                        element.children('.url-bookmark').css('padding-left', '20px');
                    }

                    element.children('.url-bookmark').stop().animate({
                        paddingLeft: 0
                    }, 200)
                });

                //Hack to trigger mouse leave when clicking on a folder
                element.bind('mouseup', function(e) {
                    //$(this).trigger('mouseleave');
                });
            }
        }
    }
}]);
