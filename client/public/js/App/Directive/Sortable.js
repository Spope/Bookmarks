directives.directive("sortable", ['BookmarkService', 'modalService', function(BookmarkService, modalService){
    return {
        restrict: "A",
        link: function(scope, element, attrs) {
            element.sortable({
                items:"li:not(.bookmark-back)",
                connectWith: "."+attrs.sortable,
                helper: 'clone',
                zIndex: 999999,
                containment: '.categories-list-general',
                cursorAt: {left:50, top:10},
                sort: function(event, ui){
                    var userAgent = navigator.userAgent.toLowerCase();
                    if(userAgent.match(/chrome/)) {
                        ui.helper.css('top', ( ui.position.top + jQuery(window).scrollTop() ) + 'px');
                    }
                },
                start: function(e, ui) {
                    $('.bin, .favoritesEmpty').addClass("visible");
                    scope.sorting = true;
                    //Hack to force dragged Book to be over other categories
                    $('.category-li').css('z-index', 1);
                    $(e.target).closest('.category-li').css("z-index", 2);

                    //If the fav cat is empty, 20px will be added to the dom. Helper position is recalculated;
                    element.sortable('refreshPositions');
                },
                stop: function (e, ui) {
                    //Avoid sort when book has changed of category
                    if (this === ui.item.parent()[0]) {
                        var id = ui.item.data('bookmark');
                        scope.bookmark = BookmarkService.get(id);
                        var oldPosition = scope.bookmark.position;
                        setNewOrder(ui);
                        //Avoid an update if postion isn't changed
                        if(scope.bookmark.position != oldPosition) {
                            scope.$apply(attrs.save).then(function(data) {
                                var parent = BookmarkService.getParent(scope.bookmark);
                                BookmarkService.getByCategory(scope.bookmark.category_id, parent, false);
                            });
                        }
                    }

                    $('.bin, .favoritesEmpty').removeClass("visible");
                    scope.sorting = false;
                    $('.category-li').css('z-index', 1);
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
                        //If dropped a folder into the favorite category > undo
                        if(scope.category.id == scope.favorite.id && scope.bookmark.bookmark_type_id != 1) {
                            $(ui.sender).sortable('cancel');
                            return false;
                        }
                        scope.bookmark.category_id = scope.category.id;
                        var parent;
                        if(scope.currentParent) {
                            parent = scope.currentParent.id;
                        }
                        scope.bookmark.parent = parent;
                        setNewOrder(ui);

                        scope.$apply(attrs.save).then(function(test) {
                            //reload bookmarks into the category that lose a bookmarks
                            //(needed for folder)
                            ui.sender.scope().loadBookmarks(false);
                        });

                    }
                },
                over:function(e, ui){
                    if($(e.target).hasClass('bin')) {
                        $('.bin').addClass("opened");
                    }else{
                        $('.bin').removeClass("opened");
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
