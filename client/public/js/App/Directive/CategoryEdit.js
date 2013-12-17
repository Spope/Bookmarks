directives.directive('categoryedit', function() {
    return {
        restrict: "A",
        link: function(scope, elm, attrs) {
            
            elm.bind('dblclick', function(e) {
                elm.attr('contentEditable', true);
                elm.addClass('editing');
                elm.focus();
                elm.blur(function(e){cancelEdit(e, scope.category)});
                elm.bind('keypress', function(e) {
                    if(e.keyCode === 27) {
                        elm.blur();

                        return true;
                    }

                    if(e.keyCode === 13) {
                        var name = elm.text();
                        if(name != "") {
                            scope.category.name = name;
                            scope.saveCategory(scope.category).then(function(data) {
                                elm.blur();
                            });
                        }

                        return false;
                    }
                });
            });


            cancelEdit = function(event, category) {
                event.target.contentEditable = false;
                $(event.target).removeClass('editing');
                $(event.target).unbind('blur keypress');
                $(event.target).html(category.name);
            }

        }
    };
});
