directives.directive("sortable", ['BookmarkService', function(BookmarkService){
    return {
        restrict: "A",
        link: function(scope, element, attrs) {

            element.sortable({
                connectWith: "."+attrs.sortable,
                stop: function (e, ui) {
                    //Avoid sort when book has changed of category
                    if (this === ui.item.parent()[0]) {
                        var id = ui.item.data('bookmark');

                        scope.bookmark = BookmarkService.get(id);
                        setNewOrder(ui);

                        scope.$apply(attrs.save).then(function(data) {
                            BookmarkService.getByCategory(scope.bookmark.category_id, scope.bookmark.parent, false);
                        });
                    }

                },
                remove: function(e, ui) {
                    e.stopPropagation();
                },
                receive: function(e, ui) {
                    e.stopPropagation();
                    console.log(scope.category);
                    var id = ui.item.data('bookmark');
                    scope.bookmark = BookmarkService.get(id);
                    scope.bookmark.category_id = scope.category.id;
                    setNewOrder(ui);

                    scope.$apply(attrs.save).then(function(data) {
                        BookmarkService.getByCategory(scope.bookmark.category_id, scope.bookmark.parent, false);
                    });
                }
            });

            var setNewOrder = function(ui) {
                var list = ui.item.parent().children("li").toArray();
                var id = ui.item.data('bookmark');
                for(var index in list) {
                    if(list[index].getAttribute('data-bookmark') == id) {
                        scope.bookmark.position = parseInt(index);
                    }
                }
            }

        }
    }
}]);
