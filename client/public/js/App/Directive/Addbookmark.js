directives.directive("addbookmark", function(){
    return {
        restrict: "A",
        link: function(scope, element, attrs){
            scope.newBookmark = {};

            $(element).parent().bind({
                mouseenter: function () {
                
                    element.parent().parent().addClass("hover");
                    element.stop();
                    element.slideDown(200, function(){
                        $('.categories-list').isotope('shiftColumnOfItem', element.parent().parent().parent()[0] );
                    });
                },
                mouseleave: function() {
                    element.parent().parent().removeClass("hover");
                    element.stop();
                    element.slideUp(100, function(){
                        $('.categories-list').isotope('shiftColumnOfItem', element.parent().parent().parent()[0] );
                    });
                }
            });

            var firstStep = function() {
                if(scope.newBookmark.url != "" && element.find('.add-bookmark-url').hasClass('ng-valid')) {
                    element.find('.add-bookmark-url, .btn-add-bookmark-url').hide();
                    element.find('.add-bookmark-name, .btn-add-bookmark-name').show();
                    element.find('.add-bookmark-name').focus();
                }
            }

            var lastStep = function() {
                element.find('.add-bookmark-url, .btn-add-bookmark-url').show();
                element.find('.add-bookmark-name, .btn-add-bookmark-name').hide();
            }

            element.find('.btn-add-bookmark-url').bind('click', function(event) {
                firstStep();
            })
            element.find('.add-bookmark-url').bind('keypress', function(e) {
                if(e.keyCode == 13) {
                    firstStep();
                    //trigger the html5 validation
                    e.target.blur();
                    e.target.focus();
                    e.preventDefault();

                    return false;
                }
            })

            element.find('.btn-add-bookmark-name').bind('click', function(event) {
                lastStep();
            })

            scope.send = function() {

                if(scope.currentParent) {
                    scope.newBookmark.parent = scope.currentParent.id;
                }

                scope.newBookmark.category_id = attrs.addbookmark;
                scope.newBookmark.bookmark_type_id = 1;

                scope.postBookmark(scope.newBookmark, function() {
                    //bookmark is saved, I reset the form
                    scope.newBookmark.url = "";
                    scope.newBookmark.name = "";
                });

                return false;
            }
        }
    };
});
