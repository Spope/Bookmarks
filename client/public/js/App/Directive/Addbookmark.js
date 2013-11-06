directives.directive("addbookmark", ['$window', function($window){
    return {
        restrict: "A",
        link: function(scope, element, attrs){
            $input = element.find('.input-add-bookmark');
            scope.newBookmark = {bookmark_type_id:1};
            scope.placeholder = "url";

            scope.$watch('showAdd', function() {
                if(scope.showAdd){

                    element.stop();
                    element.slideDown(100, function(){
                        $('.categories-list').isotope('shiftColumnOfItem', element.parent().parent().parent()[0] );
                    });

                    $($window).bind('keypress', function(e) {
                        if(e.keyCode === 27) {
                            scope.$apply(function() {scope.showAdd = false;});
                        }
                    });

                    element.find("input[name='bookmark_type_id']:radio").bind('click', function(e) {
                        
                        if(e.target.value == 1) {
                            scope.$apply(function() {
                                scope.placeholder = "url";
                                $input.attr('type', 'url');
                            });
                        }
                        if(e.target.value == 2) {
                            scope.$apply(function() {
                                scope.placeholder = "name";
                                $input.attr('type', 'text');
                            });
                        }
                    });

                    firstStep();

                } else {
                    element.stop();
                    element.slideUp(100, function(){
                        $('.categories-list').isotope('shiftColumnOfItem', element.parent().parent().parent()[0] );
                    });
                }
            });

            var firstStep = function() {
                $input.focus().bind('keypress', function(e) {
                    if(e.keyCode === 13) {
                        console.log('FirstStep');
                        e.preventDefault();

                        if(scope.newBookmark.bookmark_type_id == 1) {
                            lastStep();
                        }
                        if(scope.newBookmark.bookmark_type_id == 2) {
                            scope.newBookmark.name = scope.tmpValue;
                        }

                        return false;
                    }
                });
            }

            var lastStep = function() {

                scope.$apply(function(){
                    scope.newBookmark.url = scope.tmpValue;
                    scope.tmpValue = "a";
                    scope.placeholder = "name (optional)";
                    $input.attr('type', 'text');

                    $input.unbind('keypress');

                });

                $input.bind('keypress', function(e) {
                    if(e.keyCode === 13) {
                        console.log('LastStep');
                        e.preventDefault();

                        scope.newBookmark.name = scope.tmpValue;
                        console.log(scope.tmpValue);

                        //sendBook();

                        return false;
                    }
                });
            }

            var sendBook = function() {

                if(scope.currentParent) {
                    scope.newBookmark.parent = scope.currentParent.id;
                }

                scope.newBookmark.category_id = attrs.addbookmark;

                scope.postBookmark(scope.newBookmark, function() {
                    //bookmark is saved, I reset the form
                    scope.tmpValue = "";
                    scope.showAdd = false;
                });

                return false;
            }
        }
    };
}]);
