directives.directive("sortable", ['BookmarkService', function(BookmarkService){
    return {
        restrict: "A",
        link: function(scope, element, attrs) {
            element.sortable({
                connectWith: "."+attrs.sortable,
                stop: function (e, ui) {
                    var id = ui.item.attr('bookmark');

                    var bookmark = BookmarkService.get(id);
                    var list = ui.item.parent().children("li").toArray();
                    for(var index in list) {
                        if(list[index].getAttribute('bookmark') == id) {
                            bookmark.position = index;
                        }
                    }

                    BookmarkService.update(bookmark);

                }
            });
        }
    }
}]);
