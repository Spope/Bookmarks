directives.directive("addbookmark", ['$window', '$compile', function($window, $compile){
    return {
        restrict: "A",
        link: function(scope, element, attrs){
            var template = '';
            template += '<div class="category-add-bookmark">';
            template += '<form>';
            template += '<label>';
            template += '<input type="radio" name="bookmark_type_id" value="1" ng-model="newBookmark.bookmark_type_id" />Bookmark';
            template += '</label>';
            template += '<label>';
            template += '<input type="radio" name="bookmark_type_id" value="2" ng-model="newBookmark.bookmark_type_id" />Folder';
            template += '</label>';
            template += '<input class="input-add-bookmark input-add-bookmark-url" type="url" ng-required ng-model="newBookmark.url" placeholder="url" />';
            template += '<input class="input-add-bookmark input-add-bookmark-name" type="text" ng-required ng-model="newBookmark.name" placeholder="name" ng-show="false" />';
            template += '<button class="btn-add-bookmark btn-add-bookmark" type="button">Add</button>';
            template += '</form>';
            template += '<div class="clr"></div>';
            template += '</div>';

            scope.newBookmark = {bookmark_type_id:1, url:"", name:""};
            var $inputUrl;
            var $inputName;
            var $form;

            scope.$watch('showAdd', function() {
                if(scope.showAdd){

                    element.prepend($compile(template)(scope));

                    $inputUrl = element.find('.input-add-bookmark-url');
                    $inputName = element.find('.input-add-bookmark-name');
                    $form = element.find('.category-add-bookmark');

                    $form.stop();
                    $form.slideDown(100, function(){
                        $('.categories-list').isotope('shiftColumnOfItem', element.parent().parent()[0] );
                    });

                    $($window).bind('keypress', function(e) {
                        if(e.keyCode === 27) {
                            resetForm();
                        }
                    });

                    $form.find("input[name='bookmark_type_id']:radio").bind('click', function(e) {
                        
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
                    resetForm();
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
                
                scope.postBookmark(scope.newBookmark, function() {
                    //bookmark is saved, I reset the form
                    resetForm();
                });

                return false;
            }

            var resetForm = function() {
                if($form){
                    $form.stop();
                    $form.slideUp(100, function(){
                        $('.categories-list').isotope('shiftColumnOfItem', element.parent().parent()[0] );
                        $form.remove();
                        scope.showAdd = false;
                        scope.newBookmark = {bookmark_type_id:1, url:"", name:""};
                    });
                }
            }
        }
    };
}]);
