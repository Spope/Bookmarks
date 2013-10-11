directives.directive("sortable", ['BookmarkService', function(BookmarkService){
    return {
        restrict: "A",
        link: function(scope, element, attrs) {
            element.sortable({
                connectWith: "."+attrs.sortable,
                stop: function (e, ui) {
                    var id = ui.item.attr('bookmark');
                    console.log(id);
                    var bookmark = BookmarkService.get(id);
                    console.log(bookmark);
                }
            });
        }
    }
}]);
