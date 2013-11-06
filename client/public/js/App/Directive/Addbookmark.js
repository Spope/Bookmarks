directives.directive("addbookmark", ['$window', function($window){
    return {
        restrict: "A",
        link: function(scope, element, attrs){
            $inputUrl = element.find('.input-add-bookmark-url');
            $inputName = element.find('.input-add-bookmark-name');
            scope.newBookmark = {bookmark_type_id:1};
            scope.tmpValue = "";

            scope.$watch('showAdd', function() {
                if(scope.showAdd){

                    element.stop();
                    element.slideDown(100, function(){
                        $('.categories-list').isotope('shiftColumnOfItem', element.parent().parent().parent()[0] );
                    });

                    $($window).bind('keypress', function(e) {
                        if(e.keyCode === 27) {
                            resetForm();
                        }
                    });

                    element.find("input[name='bookmark_type_id']:radio").bind('click', function(e) {
                        
                        if(e.target.value == 1) {
                            scope.$apply(function() {
                                $inputUrl.show().focus();
                                $inputName.hide();
                            });
                        }
                        if(e.target.value == 2) {
                            scope.$apply(function() {
                                $inputUrl.hide();
                                $inputName.show().focus();
                            });
                        }
                    });

                    bindUrl();
                    bindName();

                } else {
                    element.stop();
                    element.slideUp(100, function(){
                        $('.categories-list').isotope('shiftColumnOfItem', element.parent().parent().parent()[0] );
                    });
                }
            });

            var bindUrl = function() {
                
                $inputUrl.focus().unbind('keypress').bind('keypress', function(e) {
                    if(e.keyCode === 13) {
                        e.preventDefault();
                        $inputUrl.hide();
                        $inputName.show().focus();

                    }
                });
            }

            var bindName = function() {

                $inputName.unbind('keypress').bind('keypress', function(e) {
                    if(e.keyCode === 13) {
                        console.log('LastStep');
                        e.preventDefault();
                        console.log(scope.newBookmark);

                        sendBook();

                        return false;
                    }
                });
            }

            var sendBook = function() {

                if(scope.currentParent) {
                    scope.newBookmark.parent = scope.currentParent.id;
                }

                scope.newBookmark.category_id = attrs.addbookmark;
                resetForm();
/*
                scope.postBookmark(scope.newBookmark, function() {
                    //bookmark is saved, I reset the form
                    scope.tmpValue = "";
                    scope.showAdd = false;
                });
*/
                return false;
            }

            var resetForm = function() {
                
                scope.$apply(function() {
                    $inputName.unbind().hide();
                    $inputUrl.unbind().show();
                    scope.showAdd = false;
                    scope.newBookmark = {bookmark_type_id:1};
                    bindUrl();
                    bindName();
                });
            }
        }
    };
}]);
