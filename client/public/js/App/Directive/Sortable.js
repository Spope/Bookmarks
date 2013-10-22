directives.directive("sortable", ['BookmarkService', 'modalService', function(BookmarkService, modalService){
    return {
        restrict: "A",
        link: function(scope, element, attrs) {
            element.sortable({
                items:"li:not(.bookmark-back)",
                connectWith: "."+attrs.sortable,
                start: function(e, ui) {
                    $('.bin').css('visibility', 'visible');
                },
                stop: function (e, ui) {
                    //Avoid sort when book has changed of category
                    if (this === ui.item.parent()[0]) {
                        var id = ui.item.data('bookmark');

                        scope.bookmark = BookmarkService.get(id);
                        setNewOrder(ui);

                        scope.$apply(attrs.save).then(function(data) {
                            var parent = BookmarkService.getParent(scope.bookmark);
                            BookmarkService.getByCategory(scope.bookmark.category_id, parent, false);
                        });
                    }

                    $('.bin').css('visibility', 'hidden');

                },
                remove: function(e, ui) {
                    e.stopPropagation();
                },
                receive: function(e, ui) {
                    e.stopPropagation();
                    var id = ui.item.data('bookmark');

                    if($(ui.item).parent().hasClass('bin')) {

                        //removing a book
                        var bookmark = BookmarkService.get(id);
                        scope.deleteBookmark = bookmark;
                        scope.$apply(attrs.remove);
                        

                    } else {
                        //Sorting bookmarks
                        scope.bookmark = BookmarkService.get(id);
                        scope.bookmark.category_id = scope.category.id;
                        setNewOrder(ui);

                        scope.$apply(attrs.save).then(function(data) {
                            BookmarkService.getByCategory(scope.bookmark.category_id, scope.bookmark.parent, false);
                        });
                    }
                }
            });

            var setNewOrder = function(ui) {
                var list = ui.item.parent().children("li:not(.bookmark-back)").toArray();
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
