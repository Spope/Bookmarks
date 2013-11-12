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
            template += '<button class="btn-add-bookmark btn-add-bookmark-url" type="button">Add</button>';
            template += '<button class="btn-add-bookmark btn-add-bookmark-name" type="button" ng-show="false">Add</button>';
            template += '</form>';
            template += '<div class="clr"></div>';
            template += '</div>';

            scope.newBookmark = {bookmark_type_id:1, url:"", name:""};
            var $inputUrl;
            var $inputName;
            var $btnUrl;
            var btnName;
            var $form;

            scope.$watch('showAdd', function() {
                if(scope.showAdd){

                    element.prepend($compile(template)(scope));

                    $inputUrl = element.find('.input-add-bookmark-url');
                    $inputName = element.find('.input-add-bookmark-name');
                    $btnUrl = element.find('.btn-add-bookmark-url');
                    $btnName = element.find('.btn-add-bookmark-name');
                    $form = element.find('.category-add-bookmark');

                    $form.stop();
                    $form.slideDown(100, function(){
                        $('.categories-list').isotope('shiftColumnOfItem', element.parent().parent()[0] );
                    });

                    $($window).bind('keydown', function(e) {
                        if(e.keyCode === 27) {
                            resetForm();
                        }
                    });

                    $form.find("input[name='bookmark_type_id']:radio").bind('click', function(e) {
                        
                        if(e.target.value == 1) {
                            scope.$apply(function() {
                                $inputUrl.show().focus();
                                $btnUrl.show();
                                $inputName.hide();
                                $btnName.hide();
                            });
                        }
                        if(e.target.value == 2) {
                            scope.$apply(function() {
                                scope.newBookmark.url = "";
                                $inputUrl.hide();
                                $btnUrl.hide();
                                $inputName.show().focus();
                                $btnName.show();
                            });
                        }
                    });

                    bindUrl();
                    bindName();
                }else{
                    resetForm(true);
                }
            });

            var bindUrl = function() {
                
                $inputUrl.focus().unbind('keypress').bind('keypress', function(e) {
                    if(e.keyCode === 13) {
                        if($inputUrl[0].checkValidity()) {
                            e.preventDefault();
                            $inputUrl.hide();
                            $btnUrl.hide();
                            $inputName.show().focus();
                            $btnName.show();
                        }
                    }
                });
                $inputUrl.bind('paste', function() {
                    var $el = $(this);
                    setTimeout(function() {
                        var val = $el.val();
                        if(
                            val.length > 6 && 
                            (val.substr(0,7) != 'http://' && val.substr(0,8) != 'https://')
                           
                        ) {
                            $el.val('http://' + val);
                        }

                        //Hack to force angular to update the model on paste
                        $el.trigger('input');
                    }, 100);
                    
                });
                $btnUrl.bind('click', function(e){
                    if($inputUrl[0].checkValidity()) {
                        $inputUrl.hide();
                        $btnUrl.hide();
                        $inputName.show().focus();
                        $btnName.show();
                    }
                });
            }

            var bindName = function() {

                $inputName.unbind('keypress').bind('keypress', function(e) {
                    if(e.keyCode === 13) {
                        e.preventDefault();
                        sendBook();
                        return false;
                    }
                });
                $btnName.bind('click', function(e){
                    sendBook();
                });
            }

            var sendBook = function() {

                scope.$apply();

                if(scope.currentParent) {
                    scope.newBookmark.parent = scope.currentParent.id;
                }

                scope.newBookmark.category_id = attrs.addbookmark;

                scope.postBookmark(scope.newBookmark, function() {
                    //bookmark is saved, I reset the form
                    resetForm();
                    scope.loadBookmarks();
                });

                return false;
            }

            var resetForm = function(apply) {
                if($form){
                    $form.stop();
                    $form.slideUp(100, function(){
                        $('.categories-list').isotope('shiftColumnOfItem', element.parent().parent()[0] );
                        $form.remove();
                        scope.showAdd = false;
                        scope.newBookmark = {bookmark_type_id:1, url:"", name:""};
                        if(!apply) {
                            $($window).unbind('keydown');
                            scope.$apply();
                        }
                    });
                }
            }
        }
    };
}]);
