var services     = angular.module('bookmarkApp.services', []);
var directives   = angular.module('bookmarkApp.directives', []);
var filters      = angular.module('bookmarkApp.filters', []);
var controllers  = angular.module('bookmarkApp.controllers', []);

var cacheModule = angular.module('bookmarkApp.cacheData',[]);


var bookmarkApp = angular.module('bookmarkApp', ['bookmarkApp.directives', 'bookmarkApp.controllers','bookmarkApp.services','bookmarkApp.filters', 'bookmarkApp.cacheData']);

cacheModule.factory('resourceCache',['$cacheFactory', function($cacheFactory) { 
    return $cacheFactory('resourceCache'); 
}]);
;directives.directive("addbookmark", ['$window', '$compile', function($window, $compile){
    return {
        restrict: "A",
        scope: {
            postbookmark: "&",
            loadbookmarks:"&",
            showadd:      "=",
            categoryid:   "=",
            parent:       "="
        },
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

            scope.$watch('showadd', function() {
                if(scope.showadd){

                    element.append($compile(template)(scope));

                    $inputUrl = element.find('.input-add-bookmark-url');
                    $inputName = element.find('.input-add-bookmark-name');
                    $btnUrl = element.find('.btn-add-bookmark-url');
                    $btnName = element.find('.btn-add-bookmark-name');
                    $form = element.find('.category-add-bookmark');

                    $form.stop();
                    $form.slideDown(100, function(){
                        $('.categories-list').isotope('shiftColumnOfItem', element.closest('.category-li')[0]);
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
                if(scope.parent) {
                    scope.newBookmark.parent = scope.parent.id;
                }

                scope.newBookmark.category_id = scope.categoryid;

                scope.postbookmark({
                    newBookmark: scope.newBookmark,
                    callback: function() {
                        //bookmark is saved, I reset the form
                        resetForm();
                        scope.loadbookmarks();
                    }
                });

                return false;
            }

            var resetForm = function(apply) {
                if($form){
                    $form.stop();
                    $form.slideUp(100, function(){
                        $('.categories-list').isotope('shiftColumnOfItem', element.closest('.category-li')[0] );
                        $form.remove();
                        scope.showadd = false;
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
;directives.directive("bookmarkel", ['$compile', function($compile){
    return {
        restrict: "A",
        link: function(scope, element, attrs){

            var template = "";
            if(scope.bookmark.bookmark_type_id == 1) {
                template += '<a class="url-bookmark" ng-href="{{bookmark.url}}" target="_blank" title="{{bookmark.name}}">';
                //template += '<img ng-src="http://placehold.it/16x16" height="16" width="16" />';
                template += '<img ng-src="http://www.google.com/s2/favicons?domain={{bookmark.url|removeHTTP}}" height="16" width="16" />';
                template += '{{bookmark.name|truncate:24}}';
                template += '</a>';
            }
            if(scope.bookmark.bookmark_type_id == 2) {
                template += '<a class="url-bookmark" href="" title="{{bookmark.name}}" ng-click="setParent(bookmark)">';
                template += '<img src="/img/bookmark/folder.png" />';
                template += '{{bookmark.name|truncate:24}}';
                template += '</a>';
            }

            element.append($compile(template)(scope));

            if(attrs.bookmarkel == ""){

                var editBtn = '<a class="btn-edit-bookmark pointer" ng-click="editBookmark(bookmark)">';
                editBtn += '<img src="/img/bookmark/pen.png" width="16" height="16" />';
                editBtn += '</a>';

                

                
                element.bind('mouseenter', function(e) {
                    element.children('.url-bookmark').stop().animate({
                        paddingLeft: 20
                    }, 200, function () {
                        //append editButton
                        element.find('.url-bookmark').before($compile(editBtn)(scope));
                        element.children('.url-bookmark').css('padding-left', '0px');
                    })
                });

                element.bind('mouseleave', function(e) {

                    if(element.find('.btn-edit-bookmark')[0]) {
                        element.find('.btn-edit-bookmark').remove();

                        element.children('.url-bookmark').css('padding-left', '20px');
                    }

                    element.children('.url-bookmark').stop().animate({
                        paddingLeft: 0
                    }, 200)
                });

                //Hack to trigger mouse leave when clicking on a folder
                element.bind('mouseup', function(e) {
                    //$(this).trigger('mouseleave');
                });
            }
        }
    }
}]);
;cacheModule.directive('preloadResource', ['resourceCache', function(resourceCache) {
    return {
        restrict: "A",
        link: function (scope, element, attrs) { 
            resourceCache.put(attrs.preloadResource, element.html()); 
        }
    };
}]);
;directives.directive('categoryedit', function() {
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
                        var name = elm.html();
                        if(name != "") {
                            scope.category.name = elm.html();
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
;directives.directive("mansory", [ '$timeout', function($timeout){
    return {
        restrict: "A",
        link: function(scope, element, attrs) {

            var options = {
                layoutMode: 'masonryColumnShift',
                masonry: {
                    gutterWidth: 10
                }
            };

            if(attrs.mansory) {
                options.masonry.columnWidth = parseInt(attrs.mansory)
            }

            scope.mansory = function() {
                //Hack to wait the render to finish
                $timeout(function(){
                    if(element.hasClass('isotope')){
                        element.isotope('reloadItems').isotope(options);
                    }else{
                        element.isotope(options);
                    }
                    
                });
            }
        }
    }
}]);
;directives.directive('pwCheck', [function () {
	return {
		require: 'ngModel',
		link: function (scope, elem, attrs, ctrl) {
			var firstPassword = '#' + attrs.pwCheck;
			elem.add(firstPassword).on('keyup', function () {
				scope.$apply(function () {
					var v = elem.val()===$(firstPassword).val();
					ctrl.$setValidity('pwmatch', v);
				});
			});
		}
	}
}]);
;directives.directive("searchengineshortcut", ['$document', '$timeout', function($document, $timeout){

    return {
        restrict: "E",
        scope: {
            searchengines: "=",
            hint: "=",
            submit: "&"
        },
        link: function(scope, element, attrs) {

            var corresp = {
                1: [49],
                2: [50],
                3: [51],
                4: [52],
                5: [53],
                6: [54],
                7: [55],
                8: [56],
                9: [57]
            }

            $document[0].onkeydown = function (e) {
                if(e.ctrlKey) {
                    for(var i in corresp) {
                        if(e.ctrlKey && corresp[i].indexOf(e.keyCode) > -1){
                            e.preventDefault();
                            if(scope.searchengines[i-1]){
                                scope.submit({searchEngine: scope.searchengines[i-1]});

                                $timeout(function() {
                                    $('.input-search:visible').focus();
                                });
                            }
                            return false;
                        }
                    }

                    if(e.keyCode == 17) {
                        scope.$apply(function(){
                            scope.hint = true;
                            
                        });

                        //reset to false (if ctrl+t for exemple)
                        $timeout(function(){
                            scope.$apply(function(){
                                scope.hint = false;
                            });
                        }, 3000);
                        
                    }
                }else{
                    scope.$apply(function(){
                        scope.hint = false;
                    });
                }
            }
            $document[0].onkeyup = function(e) {
                if(e.keyCode == 17) {
                    scope.$apply(function(){
                        scope.hint = false;
                    });
                }
            };

        }
    }
}]);
;directives.directive("sortable", ['BookmarkService', 'modalService', function(BookmarkService, modalService){
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
                        $(ui.item).remove();

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
;directives.directive("typeahead", ['$window', function ($window){
    var template = '<div>';
    template += '<input type="text" class="input-search input-search-bookmarks" autocomplete="off" ng-model="term" ng-change="query()" />';
    template += '<div ng-transclude></div>';
    template += '</div>';

    return {
        restrict: "E",
        transclude: true,
        //replace: true,
        template: template,
        scope: {
            search : '&',
            focus  : '&',
            blur   : '&',
            select : '=',
            items  : '=',
            term   : '='
        },
        controller: ["$scope", function($scope) {

            this.activate = function(item) {
                $scope.active = item;
            };

            this.activateFirstItem = function() {
                if($scope.items && $scope.items[0]){
                    this.activate($scope.items[0]);
                }
            };

            this.activateNextItem = function() {
                var index = $scope.items.indexOf($scope.active);
                this.activate($scope.items[(index + 1) % $scope.items.length]);
            };
 
            this.activatePreviousItem = function() {
                var index = $scope.items.indexOf($scope.active);
                this.activate($scope.items[index === 0 ? $scope.items.length - 1 : index - 1]);
            };
 
            this.isActive = function(item) {
                return $scope.active === item;
            };
 
            this.selectActive = function() {
                this.select($scope.active);
            };
 
            this.select = function(item) {
                $scope.hide = true;
                $scope.focused = true;
                $scope.select(item);
            };

            $scope.isVisible = function() {
                return !$scope.hide && ($scope.focused || $scope.mousedOver) && ($scope.items && $scope.items.length > 0);
            };

            $scope.query = function() {
                $scope.hide = false;
                $scope.search({term:$scope.term});
            }
        }],
        link: function(scope, element, attrs, controller){

            var $input = element.find('input.input-search');
            var $list = element.find('ul.search-bookmark-results-list');

            $input.bind('focus', function() {
                scope.focused = true;
                scope.focus();
            });
 
            $input.bind('blur', function() {
                scope.focused = false;
                scope.blur();
            });

            $input.bind('keyup', function(e) {
                if (e.keyCode === 9 || e.keyCode === 13) {
                    scope.$apply(function() { controller.selectActive(); });
                }
 
                if (e.keyCode === 27) {
                    scope.$apply(function() { scope.hide = true; });
                }

                var keys = [9, 13, 27, 38, 40];
                if(keys.indexOf(e.keyCode) == -1) {
                    scope.$apply(function() {controller.activateFirstItem(); });
                }
            });

            $input.bind('keydown', function(e) {
                if (e.keyCode === 9 || e.keyCode === 13 || e.keyCode === 27) {
                    e.preventDefault();
                };
 
                if (e.keyCode === 40) {
                    e.preventDefault();
                    scope.$apply(function() { controller.activateNextItem(); });
                }
 
                if (e.keyCode === 38) {
                    e.preventDefault();
                    scope.$apply(function() { controller.activatePreviousItem(); });
                }
            });

            scope.$watch('isVisible()', function(visible) {
                if (visible) {
                    var pos = $input.position();
                    var height = $input[0].offsetHeight;
 
                    $list.css({
                        top: pos.top + height,
                        left: pos.left,
                        position: 'absolute',
                        display: 'block'
                    });
                } else {
                    $list.css('display', 'none');
                }
            });
        }
    }
}]);



directives.directive("typeaheadItem", [function (){
    return {
        require: '^typeahead',
        link: function(scope, element, attrs, controller) {
 
            var item = scope.$eval(attrs.typeaheadItem);
 
            scope.$watch(function() { return controller.isActive(item); }, function(active) {
                if (active) {
                    element.addClass('active');
                } else {
                    element.removeClass('active');
                }
            });
 
            element.bind('mouseenter', function(e) {
                scope.$apply(function() { controller.activate(item); });
            });
 
            element.bind('click', function(e) {
                scope.$apply(function() { controller.select(item); });
            });
        }
    };
}]);
;filters.filter('removeHTTP', function() {
    return function (text) {
        return text.replace('http://', '').replace('www.', '');
    }
});
;filters.filter('truncate', function () {
    return function (text, length, end) {
        text = String(text);
        if (isNaN(length))
            length = 10;

        if (end === undefined)
            end = "...";

        if (text.length <= length || text.length - end.length <= length) {
            return text;
        }
        else {
            return String(text).substring(0, length-end.length) + end;
        }

    };
});
;services.factory('AuthService', [function() {
    sdo = {
        checkAuth: function(route, user) {
            if(!route.access){
                //first page load redirect to the #/
                return true;
            }
            if ((route.access && route.access.level > 0) && !user) {
                //This route need the user to be logged
                return {response: false, redirect: true};
            }
            if (route.access.level > 0 && (!user || user.roles < route.access.level)) {
                //Role error
                return {response: false, redirect: false};
            }

            return {response: true};
        }
    }

    return sdo;
}]);
;services.factory('BookmarkService', ['UserService', '$http', 'LocalBookmarkService', function(UserService, $http, LocalBookmarkService) {
    var service = {
        pageLoad: function(next) {

            var url = '/api/user/'+UserService.user.id+'/bookmarks';
            var promise = $http.get(url)
                .then(
                    function(response) {

                        
                        var bookmarks = response.data;

                        for(var i in bookmarks) {
                            LocalBookmarkService.addBookmark(bookmarks[i]);
                        }

                        if(typeof(next) == 'function') {
                            next();
                        }

                        return response.data;
                    },
                    function(data) {
                        console.error("Can't retrieve bookmarks");
                        return {}
                    }
                );

            return promise;
        },


        getByCategory: function(idCategory, parent, cache, next) {

            if(!UserService.isLogged) {

                return null;
            }else{

                if(LocalBookmarkService.getByCategory(idCategory, parent) === false || cache === false) {
                    var url = "";
                    if(parent) {
                        url = '/api/user/'+UserService.user.id+'/category/'+idCategory+'/parent/'+parent.id;
                    } else {
                        url = '/api/user/'+UserService.user.id+'/category/'+idCategory+'/bookmarks';
                    }
                    var promise = $http.get(url)
                    .then(
                        function(response) {

                            if(typeof(next) == 'function') {
                                next();
                            }
                            return response.data;
                        },
                        function(data) {
                            console.error("Can't retrieve bookmarks");
                            return {}
                        }
                    );

                    return promise.then(function(data) {

                        LocalBookmarkService.setByCategory(idCategory, parent, data);

                        return data;
                    });
                } else {

                    if(typeof(next) == 'function') {
                        next(LocalBookmarkService.getByCategory(idCategory, parent));
                    }

                    return LocalBookmarkService.getByCategory(idCategory, parent);
                }
            }
        },

        get: function(id, cache) {

            if(!UserService.isLogged) {

                return null;
            } else {

                if(LocalBookmarkService.get(id) === false || cache === false) {
                    var promise = $http.get('/api/user/'+UserService.user.id+'/bookmark/'+id)
                    .then(
                        function(response) {

                            return response.data;
                        },
                        function(data) {
                            console.error("Can't retrieve bookmark");
                            return {}
                        }
                    );

                    return promise.then(function(data) {

                        LocalBookmarkService.setBookmark(data);

                        return data;
                    });
                } else {

                    return LocalBookmarkService.get(id);
                }
            }
        },

        post: function(bookmark) {
            var promise = $http.post('/api/user/'+UserService.user.id+'/bookmark', bookmark)
            .then(
                    function(response) {

                    return response.data;
                },
                function(data) {
                    console.error("Can't add a bookmark");
                    return {}
                }
            )

            return promise.then(function(data) {

                if(!LocalBookmarkService.addBookmark(data)) {
                    console.error("can't refresh data after post bookmark");
                }

                return data;
            });
        },

        getParent: function(bookmark) {
            return LocalBookmarkService.getParent(bookmark);
        },



        update: function(bookmark) {
            var promise = $http.put('/api/user/'+UserService.user.id+'/bookmark', bookmark)
            .then(
                function(response) {

                    return response.data;
                },
                function(data) {
                    console.error("Can't update a bookmark");
                    return {}
                }
            )

            return promise;
        },

        remove: function(bookmark) {

            var promise = $http.delete('/api/user/'+UserService.user.id+'/bookmark/'+bookmark.id)
            .then(
                function(response) {
                    return response;
                },
                function(response) {
                    console.log("Error on removing the bookmark");
                    return {};
                }
            );
            //the localbookmarkservice is update into the controller.
            //It could be done here too.

            return promise;
        }
    }

    return service;
}]);
;services.factory('CategoryService', ['UserService', 'LocalCategoryService', '$http', 'LocalBookmarkService', 'resourceCache', function(UserService, LocalCategoryService, $http, LocalBookmarkService, resourceCache) {
    var service = {

        pageLoad: function(next) {

            var url = '/api/user/'+UserService.user.id+'/load';
            var promise = $http({
                method: 'GET',
                url: url,
                cache: resourceCache
            })
                .then(
                    function(response) {

                        LocalCategoryService.categories = [];
                        LocalBookmarkService.bookmarks  = [];
                        var categories = response.data;

                        for(var i in categories) {
                            var category = categories[i];
                            LocalCategoryService.addCategory(category);

                            for(var b in category.bookmarks) {
                                LocalBookmarkService.addBookmark(category.bookmarks[b]);
                            }
                        }

                        if(typeof(next) == 'function') {
                            next(categories.length);
                        }

                        //return response.data;
                    },
                    function(data) {
                        console.error("Can't retrieve bookmarks");
                        return {}
                    }
                );

            return promise;
        },








        getAll: function(next) {

            if(!UserService.isLogged) {

                return null;
            }else{

                if(LocalCategoryService.getCategories() === false) {

                    $http.get('/api/user/'+UserService.user.id+'/categories')
                    .success(
                        function(data, status, headers, config) {

                            if(typeof(next) == "function") {
                                next(data);
                            }
                    }).error(
                        function(data, status, headers, config) {
                            console.error("Can't retrieve categories");
                            return {}
                        }
                    );

                } else {
                    if(typeof(next) == "function") {
                        next(LocalCategoryService.getCategories());
                    }
                }
            }
        },

        get: function(id, cache) {

            if(!UserService.isLogged) {

                return null;
            } else {

                if(LocalCategoryService.get(id) === false || cache === false) {
                    var promise = $http.get('/api/user/'+UserService.user.id+'/category/'+id)
                    .then(
                        function(response) {

                            return response.data;
                        },
                        function(data) {
                            console.error("Can't retrieve category");
                            return {}
                        }
                    );

                    return promise.then(function(data) {

                        LocalCategoryService.setCategory(data);

                        return data;
                    });
                } else {

                    return LocalCategoryService.get(id);
                }
            }
        },

        post: function(category) {

            var promise = $http.post('/api/user/'+UserService.user.id+'/category', category)
            .then(
                    function(response) {

                    return response.data;
                },
                function(data) {
                    console.error("Can't add a category");
                    return {}
                }
            )

            return promise.then(function(data) {

                if(!LocalCategoryService.addCategory(data)) {
                    console.error("can't refresh data after post category");
                }

                return data;
            });
        },

        update: function(category) {

            var promise = $http.put('/api/user/'+UserService.user.id+'/category', category)
            .then(
                function(response) {

                    return response.data;
                },
                function(data) {
                    console.error("Can't update a category");
                    return {}
                }
            )

            return promise;
        },

        remove: function(category, next) {

            var promise = $http.delete('/api/user/'+UserService.user.id+'/category/'+category.id)
            .then(
                function(response) {
                    LocalCategoryService.remove(category);
                    next();
                },
                function(response) {
                    console.error("Error on removing the category");
                }
            );

            return promise;
        }
    }

    return service;
}]);
;services.factory('LocalBookmarkService', [ function() {

    var service = {
        bookmarks: new Array(),
        /**
         * bookmarks = [
         *      idCategory = [
         *          idParent = [
         *              book1, book2...
         *          ],
         *          'root' = []
         *      ]
         *  ]
         */

        get: function(id) {
            for(var cat in this.bookmarks) {
                for(var parent in this.bookmarks[cat]) {
                    for(var book in this.bookmarks[cat][parent]) {
                        if(this.bookmarks[cat][parent][book].id == id) {
                            return this.bookmarks[cat][parent][book];
                        }
                    }
                }
            }

            return false;
        },

        getByCategory: function(idCategory, parent) {

            if(!parent) {
                parent = 'root';
            } else {
                parent = parent.id;
            }

            if(this.bookmarks[idCategory] && this.bookmarks[idCategory][parent]) {

                return this.bookmarks[idCategory][parent];
            } else {

                return false;
            }
        },

        getParent: function(bookmark) {
            for(var cat in this.bookmarks) {
                for(var parent in this.bookmarks[cat]) {
                    for(var book in this.bookmarks[cat][parent]) {
                        if(this.bookmarks[cat][parent][book].id == bookmark.id) {

                            if(!this.bookmarks[cat][parent][book].parent) {
                                return parent == 'root' ? null : parent;
                            } else {
                                return this.get(this.bookmarks[cat][parent][book].parent);
                            }
                        }
                    }
                }
            }

            return null;
        },

        //Format a dataset for typeahead
        getDataset: function() {

            var out = [];

            for(var cat in this.bookmarks) {
                for(var parent in this.bookmarks[cat]) {
                    if(parent != 'root') {parent = parseInt(parent)}
                    for(var book in this.bookmarks[cat][parent]) {
                        if(this.bookmarks[cat][parent][book].bookmark_type_id != 2) {
                            out.push({
                                name     : this.bookmarks[cat][parent][book].name,
                                token    : this.bookmarks[cat][parent][book].name.split(' '),
                                category : parseInt(cat),
                                parent   : parent,
                                url      : this.bookmarks[cat][parent][book].url
                            });
                        }
                    }
                }
            }

            return out;
        },





        //Setter
        setBookmark: function (bookmark) {

            for(var cat in this.bookmarks) {
                for(var parent in this.bookmarks[cat]) {
                    for(var book in this.bookmarks[cat][parent]) {
                        if(this.bookmarks[cat][parent][book].id == bookmark.id) {
                            this.bookmarks[cat][parent][book] = bookmark;
                            
                            return true;
                        }
                    }
                }
            }

            return false;
        },

        setByCategory: function (idCategory, parent, bookmarks) {

            if(!parent) {
                parent = 'root';
            } else {
                parent = parent.id;
            }

            if(!this.bookmarks[idCategory]) {
                this.bookmarks[idCategory] = new Array();
            }
            this.bookmarks[idCategory][parent] = bookmarks;
        },

        addBookmark: function (bookmark) {

            var idCategory = bookmark.category_id;
            var parent = bookmark.parent;
            if(!parent) {
                parent = 'root';
            } else {
                parent = parent;
            }
            if(!this.bookmarks[idCategory]) { this.bookmarks[idCategory] = new Array()}
            if(!this.bookmarks[idCategory][parent]) { this.bookmarks[idCategory][parent] = new Array()}

            if(this.bookmarks[idCategory][parent]) {

                this.bookmarks[idCategory][parent].push(bookmark);
            } else {
                return false;
            }

            return true;
        }

    }

    return service;

}]);
;services.factory('LocalCategoryService', [ function() {

    var service = {
        categories: [],

        getCategories: function() {

            //wil break the reference
            return [].concat(this.categories);
        },

        get: function(id) {

            for(var i in this.categories) {
                if(this.categories[i].id == id) {

                    return this.categories[i];
                }
            }
        },






        //Setter
        setCategories: function (categories) {

            this.categories = categories;
        },

        setCategory: function (category) {

            for(var i in this.categories) {
                if(this.categories[i].id == category.id) {
                    this.categories[i] = category;
                }
            }
        },

        addCategory: function (category) {

            this.categories.push(category);

            return true;
        },

        remove: function(category) {
            for(var i in this.categories) {
                if(this.categories[i].id == category.id) {
                    this.categories.splice(i, 1);
                }
            }
        }

    }

    return service;

}]);
;services.service('modalService', ['$modal', '$q',
    function ($modal, $q) {

        var modalDefaults = {
            backdrop: true,
            keyboard: true,
            modalFade: true,
            template: 'js/App/View/Bookmarks/partial/Modal/test.html'
        };

        var modalOptions = {
            
        };

        this.showModal = function (customModalDefaults, customModalOptions) {
            if (!customModalDefaults) customModalDefaults = {};
            customModalDefaults.backdrop = 'static';
            return this.show(customModalDefaults, customModalOptions);
        };

        this.show = function (customModalDefaults, customModalOptions) {
            //Create temp objects to work with since we're in a singleton service
            var tempModalDefaults = {};
            var tempModalOptions = {};

            //Map angular-ui modal custom defaults to modal defaults defined in service
            angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

            //Map modal.html $scope custom properties to defaults defined in service
            angular.extend(tempModalOptions, modalOptions, customModalOptions);

            if (!tempModalDefaults.controller) {
                tempModalDefaults.controller = function ($scope,  $modalInstance) {}
            }

            var modalPromise = $modal(tempModalDefaults, customModalOptions);

            $q.when(modalPromise).then(function(modalEl){
                modalEl.modal('show');
            });
        };

    }]);
;services.factory('SearchEngineService', ['UserService', '$http', 'resourceCache', function(UserService, $http, resourceCache) {
    var service = {
        get: function() {

            if(!UserService.isLogged) {

                return null;
            }else{

                var promise = $http({
                    method: 'GET',
                    url: '/api/user/'+UserService.user.id+'/searchengines',
                    cache: resourceCache
                })
                .then(
                    function(response) {

                        return response.data;
                    },
                    function(data) {
                        console.error("Can't retrieve search engines");
                        return {}
                    }
                );

                return promise;
            }
        },

        getAll: function() {

            if(!UserService.isLogged) {

                return null;
            }else{

                var promise = $http.get('/api/searchengines')
                .then(
                    function(response) {

                        return response.data;
                    },
                    function(data) {
                        console.error("Can't retrieve all search engines");
                        return {}
                    }
                );

                return promise;
            }
        },

        save: function(engines) {

            var promise = $http.post('/api/user/'+UserService.user.id+'/searchengines', engines)
                .then(
                    function(response) {

                        return response.data;
                    },
                    function(data) {
                        console.error("Can't save search engines");
                        return {}
                    }
                );

            return promise;
        }
    }

    return service;
}]);
;services.factory('UserService', ['$http', '$location', '$q', '$timeout', 'resourceCache', function($http, $location, $q, $timeout, resourceCache) {
    var service =  {
        isLogged  : false,
        user      : null,
        isFinished: false,

        log : function() {

            var defer = $q.defer();
            var config = {
                method: 'GET',
                url   : '/api/islogged',
                cache : resourceCache
            };

            $http(config)
            .success(function(data, status, headers, config) {
                if (data && status == 200) {
                    service.isLogged = true;
                    service.user     = data;
                    //Redirect to home
                    var redirect = '/';
                    if($location.search().redirect){
                        redirect = $location.search().redirect;
                    }
                    $location.path(redirect).search({});
                } else {
                    service.isLogged = false;
                    service.user     = null;
                }

                this.isFinished = true;
                defer.resolve();
            })
            .error(function(data, status, headers, config) {
                service.isLogged = false;
                service.user     = null;

                this.isFinished = true;
                defer.reject(data);
            });

            return defer.promise;
        }
    }

    return service;

}]);

;services.factory('$modal', ['$rootScope', '$compile', '$http', '$timeout', '$q', '$templateCache', '$controller', function($rootScope, $compile, $http, $timeout, $q, $templateCache, $controller) {

  var ModalFactory = function ModalFactoryFn(config, params) {
    function Modal(config, params) {

      var options = angular.extend({show: true}, {}, config),
          scope = options.scope ? options.scope : $rootScope.$new(),
          templateUrl = options.template;

      return $q.when($templateCache.get(templateUrl) || $http.get(templateUrl, {cache: true}).then(function(res) {
          return res.data;
      }))
      .then(function onSuccess(template) {

        // Build modal object
        var id = templateUrl.replace('.html', '').replace(/[\/|\.|:]/g, '-') + '-' + scope.$id;
        var $modal = $('<div class="modal hide" tabindex="-1"></div>').attr('id', id).addClass('fade').html(template);
        if(options.modalClass) $modal.addClass(options.modalClass);

        //Using the controller passed in the options
        var ctrlInstance, ctrlLocals = {};
        if(config.controller) {

            //setting the modal vars into its scope
            for(var key in params) {
                scope[key] = params[key];
            }
            ctrlLocals.$scope = scope;
            ctrlLocals.$modalInstance = $modal;

          ctrlInstance = $controller(config.controller, ctrlLocals);
        }

        $('body').append($modal);

        // Compile modal content
        scope.modal = {};
        $timeout(function() {
          $compile($modal)(scope);
        });

        // Provide scope display functions
        scope.$modal = function(name) {
          $modal.modal(name);
        };
        angular.forEach(['show', 'hide'], function(name) {
          scope[name] = function() {
            $modal.modal(name);
          };
        });
        scope.dismiss = scope.hide;

        // Emit modal events
        angular.forEach(['show', 'shown', 'hide', 'hidden'], function(name) {
          $modal.on(name, function(ev) {
            scope.$emit('modal-' + name, ev);
          });
        });

        // Support autofocus attribute
        $modal.on('shown.bs.modal', function(ev) {
          $('input[autofocus], textarea[autofocus]', $modal).first().trigger('focus');
        });
        // Auto-remove $modal created via service
        $modal.on('hide.bs.modal', function(ev) {
          if(!options.persist) scope.$destroy();
        });

        // Garbage collection
        scope.$on('$destroy', function() {
          $modal.remove();
        });

        $modal.modal(options);

        return $modal;

      });

    }

    return new Modal(config, params);

  };

  return ModalFactory;

}])

.directive('bsModal', function($q, $modal) {

  return {
    restrict: 'A',
    scope: true,
    link: function postLink(scope, iElement, iAttrs, controller) {

      var options = {
        template: scope.$eval(iAttrs.bsModal),
        persist: true,
        show: false,
        scope: scope
      };

      // $.fn.datepicker options
      angular.forEach(['modalClass', 'backdrop', 'keyboard'], function(key) {
        if(angular.isDefined(iAttrs[key])) options[key] = iAttrs[key];
      });

      $q.when($modal(options)).then(function onSuccess(modal) {
        iElement.attr('data-target', '#' + modal.attr('id')).attr('data-toggle', 'modal');
      });

    }
  };
});
;controllers.controller('BookmarkController', ['$rootScope', '$scope', 'BookmarkService', 'CategoryService',  'modalService', 'LocalCategoryService', 'LocalBookmarkService', '$q', function ($rootScope, $scope, BookmarkService, CategoryService, modalService, LocalCategoryService, LocalBookmarkService, $q) {
    
    $scope.currentParent = null;
    $scope.backElement = null;

    //retrieving bookmarks from DB
    $scope.loadBookmarks = function(cache) {
        var next = $scope.mansory;
        if($rootScope.initStep > 1) {
            $rootScope.initStep--;
            next = null;
        }

        if($scope.category) {
            $scope.bookmarks = BookmarkService.getByCategory($scope.category.id, $scope.currentParent, cache, next);
        }

        if($rootScope.initStep == 1) {
            $scope.mansory();
            $rootScope.initStep = 0;
        }
    }
    $scope.loadBookmarks();

    $rootScope.$watch('pageLoad', function() {
        if($rootScope.pageLoad === false) {
            if($scope.category && $scope.category.id) {
                $scope.loadBookmarks();
            }
        }
    });

    $scope.$on('RefreshBookmarks2', function(e, args) {
        e.preventDefault();
        if(args == $scope.category.id) {
            $scope.loadBookmarks(false);
        }
    });

    $scope.$on('RefreshMansory', function(e, args) {
        e.preventDefault();
        $scope.mansory();
    });

    $scope.postBookmark = function(bookmark, callback){

        bookmark.position = BookmarkService.getByCategory(bookmark.category_id, $scope.currentParent, true, $scope.mansory).length;

        BookmarkService.post(bookmark).then(function(data) {
            if(data.id) {
                callback.call(null);
            } else {
                console.error('Error on adding this bookmark');
            }
        });
    }
    var postBookmark = $scope.postBookmark;

    var saveBookmark = function(bookmark) {

        return BookmarkService.update(bookmark).then(function(data) {
            $scope.loadBookmarks(false);
            //If the bookmarks has a new category
            if(bookmark.category_id != $scope.category.id) {
                //Sending event to parent scope which will stop and send it to all children scope.
                //Only the scope of the category will be updated.
                $scope.$emit('RefreshBookmarks', bookmark.category_id);
                //BookmarkService.getByCategory(bookmark.category_id, null, false);
            }

            return $scope.bookmarks;
        });
    }

    $scope.saveBookmark = saveBookmark;

    $scope.setParent = function(parent) {

        if(parent) {
            $scope.backElement = BookmarkService.getParent(parent);
        }

        $scope.currentParent = parent;

        $scope.loadBookmarks();
    };

    //Modal stuffs
    $scope.editBookmark = function(bookmark) {

        var modalController = function($scope, $modalInstance, LocalBookmarkService) {
            $scope.save = function() {
                saveBookmark($scope.bookmark).then(function(data) {
                    $modalInstance.modal('hide');
                });
            }

            $modalInstance.on('hide.bs.modal', function(e) {
                //When modal is leaved, book can be changed but not saved, so I retrieve db info to update display
                //This will retrieve the bookmark into the db (cache=false) and resetting it
                BookmarkService.get($scope.bookmark.id, false);
            });
        };
        var template = 'js/App/View/Bookmarks/partial/Modal/editFolder.html';
        var title = 'Edit a folder';
        if(bookmark.bookmark_type_id == 1) {
            template = 'js/App/View/Bookmarks/partial/Modal/editBookmark.html';
            title = 'Edit a bookmark';
        }

        var modalDefault = {
            template: template,
            controller: modalController
        }

        CategoryService.getAll(function(categories) {

            var modalOptions = {
                bookmark: bookmark,
                categories: categories,
                title: title
            };

            modalService.showModal(modalDefault, modalOptions);
        });
    }

    $scope.addFolder = function(idCategory, parent) {

        var modalController = function($scope, $modalInstance, LocalBookmarkService) {
            $scope.save = function() {
                postBookmark($scope.bookmark, function(){
                    $modalInstance.modal('hide');
                });
            }

            $modalInstance.on('hide.bs.modal', function(e) {
                //When modal is leaved, book can be changed but not saved, so I retrieve db info to update display
                //This will retrieve the bookmark into the db (cache=false) and resetting it
                BookmarkService.getByCategory(idCategory, parent, false);
            });
        };

        var modalDefault = {
            template: 'js/App/View/Bookmarks/partial/Modal/editFolder.html',
            controller: modalController
        }

        var bookmark = {};
        bookmark.bookmark_type_id = 2;
        bookmark.category_id = idCategory;
        if(parent) {
            bookmark.parent = parent.id;
        }

        var modalOptions = {
            bookmark: bookmark,
            title: 'Create a folder'
        };

        modalService.showModal(modalDefault, modalOptions);

    }

    $scope.removeBookmark = function(bookmark) {

        var bookmark = $scope.deleteBookmark;

        if(bookmark.bookmark_type_id == 2) {

            removeFolder(bookmark).then(function(data) {
                deleteBookmark(bookmark);

            }, function(e){
                //Don't work.. $scope has lost its inherit
                $scope.loadBookmarks();
            });
        } else {

            deleteBookmark(bookmark);
        }

    }

    //Alert the popUp 'It will remove children bookmark'
    //and start delete on confirm
    var removeFolder = function(folder) {

        var deferrerd = $q.defer();
        var modalController = function($scope, $modalInstance, BookmarkService, $q) {

            $scope.confirm = function() {
                deferrerd.resolve();
                $modalInstance.modal('hide');
            }
            $scope.cancel = function() {
                $modalInstance.modal('hide');
            }

            $modalInstance.on('hide.bs.modal', function(e) {
                deferrerd.reject();
            });
        };

        var modalDefault = {
            template: 'js/App/View/Bookmarks/partial/Modal/confirmBox.html',
            controller: modalController
        }

        var modalOptions = {
            title: 'Warning',
            content: 'This is a folder, every bookmarks it contain will be removed.'
        };

        modalService.showModal(modalDefault, modalOptions);

        return deferrerd.promise;
    }

    var deleteBookmark = function(bookmark) {

        var idCategory = bookmark.category_id;
        var parent;
        if(bookmark.parent) {
            parent = BookmarkService.get(bookmark.parent);
        }

        BookmarkService.remove(bookmark).then(function(data) {
            BookmarkService.getByCategory(idCategory, parent, false);
        });
    }

    
    
}]);
;controllers.controller('CategoryController', ['$rootScope', '$scope', 'CategoryService', 'modalService', '$q', 'BookmarkService', function ($rootScope, $scope, CategoryService, modalService, $q, BookmarkService) {

    $scope.loadCategory = function() {
        CategoryService.getAll(function(data) {
            $scope.categories = data;
            $scope.favorite = $scope.categories[0];
            $scope.categories = data.splice(1);
        });
    }
    var loadCategory = $scope.loadCategory;
    //retrieving categories from DB
    $scope.pageLoad = function() {
        var next = function(categoryLength) {
            $rootScope.initStep = categoryLength;
            //getting categories from cache
            $scope.loadCategory();
        };

        CategoryService.pageLoad(next);
    }
    $scope.pageLoad();

    $scope.$on('RefreshBookmarks', function(e, args) {
        e.stopPropagation();
        $scope.$broadcast('RefreshBookmarks2', args);
    });

    $scope.addCategory = function() {

        var modalController = function($scope, $modalInstance, LocalBookmarkService) {
            $scope.save = function() {
                postCategory($scope.category, function(data) {
                    $modalInstance.modal('hide');
                    loadCategory();
                });
            }

        };
        var template = 'js/App/View/Bookmarks/partial/Modal/editCategory.html';
        var title = 'Add a category';

        var modalDefault = {
            template: template,
            controller: modalController
        }

        var category = {};

        var modalOptions = {
            category: category,
            title: title
        };

        modalService.showModal(modalDefault, modalOptions);

    }

    $scope.postCategory = function(category, callback){

        CategoryService.post(category).then(function(data) {
            if(data.id) {
                callback.call(null);
            } else {
                console.error('Error on adding this category');
            }
        });
    }
    var postCategory = $scope.postCategory;

    var saveCategory = function(category) {

        return CategoryService.update(category).then(function(data) {});
    }

    $scope.saveCategory = saveCategory;

    $scope.removeCategory = function(category) {

        confirmDelete(category).then(function(data){
            CategoryService.remove(category, function(){
                $scope.loadCategory();
                $scope.$broadcast('RefreshMansory');
            });
        });
    }

    //Alert the popUp 'It will remove children bookmark'
    //and start delete on confirm
    var confirmDelete = function(category) {

        var deferrerd = $q.defer();
        var modalController = function($scope, $modalInstance) {

            $scope.confirm = function() {
                deferrerd.resolve();
                $modalInstance.modal('hide');
            }
            $scope.cancel = function() {
                $modalInstance.modal('hide');
            }

            $modalInstance.on('hide.bs.modal', function(e) {
                deferrerd.reject();
            });
        };

        var modalDefault = {
            template: 'js/App/View/Bookmarks/partial/Modal/confirmBox.html',
            controller: modalController
        }

        var modalOptions = {
            title: 'Warning',
            content: 'This is a category, every bookmarks it contain will be removed.'
        };

        modalService.showModal(modalDefault, modalOptions);

        return deferrerd.promise;
    }
}]);
;controllers.controller('FavoriteController', ['$rootScope', '$scope', 'BookmarkService', function ($rootScope, $scope, BookmarkService) {


    $scope.loadBookmarks = function(cache) {
        $scope.bookmarks = BookmarkService.getByCategory($scope.category.id, $scope.currentParent, cache);
    }

    $scope.$watch('favorite', function() {
        if($scope.favorite && $scope.favorite.id) {
            $scope.category = $scope.favorite;
            $scope.loadBookmarks();
        }
    });

    
    var saveBookmark = function(bookmark) {

        if(bookmark.bookmark_type_id != 1) {

        } else {
            return BookmarkService.update(bookmark).then(function(data) {
                $scope.loadBookmarks(false);
                //If the bookmarks has a new category
                if(bookmark.category_id != $scope.category.id) {
                    
                    //Sending event to parent scope which will stop and send it to all children scope.
                    //Only the scope of the category will be updated.
                    $scope.$emit('RefreshBookmarks', bookmark.category_id);
                    //BookmarkService.getByCategory(bookmark.category_id, null, false);
                }

                return $scope.bookmarks;
            });
        }
    }

    $scope.saveBookmark = saveBookmark;

}]);
;controllers.controller('LoginController', ['$scope', '$http', '$location', 'UserService', function ($scope, $http, $location, UserService) {
    
    $scope.user = {login: "", password:"", remember:false};
    $scope.loginError = false;
    var config = {
        method: 'POST',
        url   : '/api/login',
        data  : $scope.user
    };
    $scope.loginFn = function(autolog) {
        if(autolog) {
            config.data.autolog = true;
        }
        $http(config)
        .success(function(data, status, headers, config) {
            if (data && status == 200) {
                UserService.isLogged = true;
                UserService.user     = data;
                //Redirect to home
                var redirect = '/';
                if($location.search().redirect){
                    redirect = $location.search().redirect;
                }
                $location.path(redirect).search({});
            } else {
                UserService.isLogged = false;
                UserService.user     = null;
                if(!autolog) {
                    $scope.loginError = true;
                }
            }
        })
        .error(function(data, status, headers, config) {
            UserService.isLogged = false;
            UserService.user     = null;
            if(!autolog) {
                $scope.loginError = true;
            }
        });
    }

    /*
    var checkLogin = function() {
        var config = {
            method: 'GET',
            url   : '/api/islogged'
        };
        $http(config)
        .success(function(data, status, headers, config) {
            if (data && status == 200) {
                UserService.isLogged = true;
                UserService.user     = data;
                //Redirect to home
                var redirect = '/';
                if($location.search().redirect){
                    redirect = $location.search().redirect;
                }
                $location.path(redirect).search({});
            } else {
                UserService.isLogged = false;
                UserService.user     = null;
                if(!autolog) {
                    $scope.loginError = true;
                }
            }
        })
        .error(function(data, status, headers, config) {
            UserService.isLogged = false;
            UserService.user     = null;
            if(!autolog) {
                $scope.loginError = true;
            }
        });
    }

    //Try to re-log the user from session or cookie.
    checkLogin();
    */

}]);
;controllers.controller('LogoutController', ['$scope', '$http', '$location', 'UserService', function ($scope, $http, $location, UserService) {
    $http.get('/api/logout')
    .success(function(data, status, headers, config) {
        UserService.isLogged = false;
        UserService.user     = null;
        $location.path('/login');
    })
    .error(function(data, status, headers, config) {
        UserService.isLogged = false;
        UserService.user     = null;
        $scope.loginError = true;
    });
}]);
;controllers.controller('MainController', ['$scope', 'UserService', 'modalService', function ($scope, UserService, modalService) {
    
    $scope.user = UserService.user;




    $scope.editSettings = function(){

        var template = 'js/App/View/Bookmarks/partial/Modal/editSettings.html';
        var title = 'Edit a folder';

        var modalDefault = {
            template: template,
            controller: UserSettingsController
        };

        modalService.showModal(modalDefault, {});
    }

}]);
;controllers.controller('RegisterController', ['$scope', '$http', '$location', 'UserService', function ($scope, $http, $location, UserService) {
    
    $scope.user = {login: "", password:"", remember:false};
    $scope.loginError = false;
    var config = {
        method: 'POST',
        url   : '/api/register',
        data  : $scope.user
    };

    $scope.registerFn = function() {

    if($scope.user.password != $scope.user.password2) {

        return false;
    }

        $http(config)
        .success(function(data, status, headers, config) {
            
            if (data && status == 200 && data == 'OK') {
                //Redirect to home
                var redirect = '/';
                if($location.search().redirect){
                    redirect = $location.search().redirect;
                }
                $location.path(redirect).search({});
            } else {
                $scope.loginError = true;
            }
            
        })
        .error(function(data, status, headers, config) {
            UserService.isLogged = false;
            UserService.user     = null;
                $scope.loginError = true;
        });
    }

}]);
;controllers.controller('SearchEngineController', ['$scope', 'SearchEngineService', '$window', 'LocalBookmarkService', 'CategoryService', 'BookmarkService', '$timeout', function($scope, SearchEngineService, $window, LocalBookmarkService, CategoryService, BookmarkService, $timeout){

    $scope.search = {value: ""};
    $scope.hint = false;  //Show search engine Indexes
    var dataset = {};

    $scope.refreshDataset = function() {
        dataset = LocalBookmarkService.getDataset();
    }

    $scope.removeDataset = function() {
        //dataset = {};
    }

    var mySort = function(a,b) {
        return a.score - b.score;
    }

    $scope.searchBookmarkFn = function(term) {
        if(term.length > 0) {
            var count = 0;
            var tmp = [].concat(dataset);

            var cross = crossfilter(tmp);
            var dimension = cross.dimension(function(d){return d;});

            var scored = dimension.filter(function(book) {

                //fuzzy matching
                var search = term.toUpperCase();
                var text   = book.name.toUpperCase();
                var j = 0; // remembers position of last found character
                var oldJ;  // remembers position of n-1 character to calculate score
                book.score = 0; // score will be used to order the results
                book.matches = []; // used to store position of matches to highlights letters
                if(search == text){book.display='<span class="highlight">'+book.name+'</span>'; return true}; // if the word is the exact matching : score = 0
                book.score = 1;

                // consider each search character one at a time
                for (var i = 0; i < search.length; i++) {
                    var l = search[i];
                    if (l == ' ') continue;     // ignore spaces

                    if(i>0 && search[i-1] == search[i]) {
                        j++; // If two identical letter, incerementation of j to avoid matching the same letter
                    }
                    j = text.indexOf(l, j);     // search for character & update position
                    if (j == -1) return false;  // if it's not found, exclude this item

                    book.matches.push(j);       // saving the position of the match to highlight it

                    if(oldJ){
                        //If the letters are adjacent, I don't increment the score.
                        book.score += (j-oldJ) == 1 ? 0 : (j-oldJ);
                    }

                    if(i == 0){
                        //if the first letter searched is the first letter of the word
                        if(j == 0) {
                            book.score;
                        }else{
                            // Not the first letter so I increment the score.
                            book.score +=1;
                        }
                    }
                    oldJ = j;
                }

                book.score += (text.length - search.length) / 10; // the shortest matches are better

                count++;

                return true;
            });

            var results = scored.top(tmp.length).sort(mySort).slice(0,10);

            for(var i in results) {

                var book = results[i]

                //letters highlighting
                if(book.score > 0){
                    book.matches.reverse();
                    book.display = book.name.split('');
                    for(var i in book.matches) {
                        var j = book.matches[i];
                        book.display.splice(j+1, 0, '</span>');
                        book.display.splice(j, 0, '<span class="highlight">');
                    }
                    book.display = book.display.join('');
                }

                //Retrieving bookmark category
                if(typeof(book.category) != "string") {
                    if(book.category == 0) {
                        book.category = "Favorites";
                    }else{
                        var cat = CategoryService.get(book.category);
                        if(cat) {
                            book.category = cat.name;
                            if(cat.name == "__default") {
                                book.category = "Favorites";
                            }                    }else{
                            book.category = "Can't find category";
                        }
                    }
                }

                if(book.parent && book.parent != "root" && typeof(book.parent) != "string"){
                    var parent = BookmarkService.get(book.parent);
                    if(parent) {
                        book.parentName = parent.name;
                    }
                }
            }

            $scope.results = results;
        }else{
            $scope.results = [];
        }
    }

    var getSearchEngines = function(){
        //retrieving searchengines from DB
        SearchEngineService.get().then(function(data) {
            $scope.searchEngines = data;
            var tmpDefault = $scope.searchEngines.filter(function(value) {
                return value.default;
            })[0];
            $scope.setSelectedSearchEngine(tmpDefault);
        });
    }
    getSearchEngines();
    $scope.$on('refreshSearchEngine', function(){
        getSearchEngines();
    });

    //search
    $scope.searchFn = function(book) {
        if(!$scope.searchBookmark) {
            if(!$scope.search.value) $scope.search.value = "";
            var url = $scope.selectedSearchEngine.url.replace("{q}", $scope.search.value);
            $window.open(url);
        }
        if($scope.searchBookmark && book && book.url) {
            $window.open(book.url);
        }
    }

    $scope.setSelectedSearchEngine = function(searchEngine) {
        $scope.selectedSearchEngine = searchEngine;

        if($scope.selectedSearchEngine.url == "bookmarks") {

            $scope.searchBookmark = true;
        } else {
            $scope.searchBookmark = false;
        }

        //crap
        $timeout(function() {
            $('.input-search:visible').focus();
        });
    }
}]);
;var UserSettingsController = function($rootScope, $scope, $modalInstance, LocalBookmarkService, SearchEngineService) {
    
    $scope.userSearchEngines = null;
    $scope.searchEngines = null;
    //loading the user search engines
    SearchEngineService.get().then(function(data) {
        $scope.userSearchEngines = data;
        
        $scope.defaultSearchEngine = $scope.userSearchEngines.filter(function(value) {
            return value.default;
        })[0];
    });
    //loading all search engines
    SearchEngineService.getAll().then(function(data){
        $scope.searchEngines = data;
    });

    $scope.$watch('userSearchEngines', function(){refresh()});
    $scope.$watch('searchEngines', function(){refresh()});

    var refresh = function(){
        //When search engines are loaded, is set the view vars.
        if($scope.userSearchEngines && $scope.searchEngines && $scope.userSearchEngines.length>0 && $scope.searchEngines.length>0){
            for(var i in $scope.searchEngines){
                var searchEngine = $scope.searchEngines[i];

                var found = $scope.userSearchEngines.filter(function(s){
                    return s.id == searchEngine.id;
                });
                if(found.length > 0) {
                    $scope.searchEngines[i].selected = true;
                }else{
                    $scope.searchEngines[i].selected = false;
                }

                if(searchEngine.id == $scope.defaultSearchEngine.id) {
                    $scope.searchEngines[i].default = 1;
                }else{
                    $scope.searchEngines[i].default = 0;
                }
            }
        }
    }

    $scope.toggleSearchEngine = function(searchEngine) {
        if(!searchEngine.selected){
            searchEngine.selected = true;
            return true;
        }
        // Check if the user is not deselecting the last one.
        var selectedEngines = $scope.searchEngines.filter(function(s){ return s.selected});
        if(selectedEngines.length > 1){
            searchEngine.default = 0; // When unselected, a search engine is no longer the default one.
            searchEngine.selected = false;
        }
        if(selectedEngines.length == 2){
            // If only one search engine left, it becomes the default one.
            $scope.searchEngines.filter(function(s){ return s.selected})[0].default = true;
        }
    }

    $scope.toggleDefaultSearchEngine = function(searchEngine) {
        for(var i in $scope.searchEngines){
            $scope.searchEngines[i].default = 0;
            if($scope.searchEngines[i].id == searchEngine.id){
                $scope.searchEngines[i].default = 1;
            }
        }
    }

    $scope.save = function() {
        var selectedSearchEngine = [];
        var defaultEngine = $scope.searchEngines.filter(function(s){ return s.default});
        if(defaultEngine.length == 0) {

            $scope.errorDefault = true;
            return false;
        }
        for (var i in $scope.searchEngines) {
            var engine = $scope.searchEngines[i];
            if(engine.selected){
                selectedSearchEngine.push(engine);
            }
        }
        SearchEngineService.save(selectedSearchEngine).then(function(data) {
            $modalInstance.modal('hide');

            $rootScope.$broadcast('refreshSearchEngine');
        });
    }
};
;bookmarkApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
        when('/', {
            templateUrl: 'js/App/View/Bookmarks/mainView.html',
            controller: 'MainController',
            access: {
                level: 1
            },
            resolve: {
                func: ['UserService', function(UserService){
                        return UserService.log();
                    }
                ]
            }
        }).
        when('/login', {
            templateUrl: 'js/App/View/login.html',
            controller: 'LoginController',
            access: {
                level: 0
            }
            
        }).
        when('/logout', {
            templateUrl: 'js/App/View/login.html',
            controller: 'LogoutController',
            access: {
                level: 0
            }
        }).
        when('/register', {
            templateUrl: 'js/App/View/register.html',
            controller: 'RegisterController',
            access: {
                level: 0
            }
            
        }).
        otherwise({redirectTo: '/'});
}]);

//Check user auth
bookmarkApp.run(['$rootScope', 'AuthService', 'UserService', '$location', function(root, auth, UserService, location) {

    root.$on('$routeChangeStart', function(scope, currView, prevView) {

        if(UserService.isFinished){
            var authorization = auth.checkAuth(currView, UserService.user);
            if (!authorization.response) {
                var page = location.path();

                //
                if(authorization.redirect) {
                    //The user need to be logged
                    location.path('/login').search({redirect: page});
                } else {
                    //the user doesn't had credential to access this page
                    var previous = "/";
                    if(!prevView) previous = prevView;
                    location.path(previous);
                    console.error('Auth error');
                }
                
            }else{
                //access granted
            }
        }
    });
}]);


bookmarkApp.config(['$httpProvider', function($httpProvider) {

    //================================================
    // Add an interceptor for AJAX errors
    //================================================
    $httpProvider.responseInterceptors.push(function($q, $location) {
        return function(promise) {
            return promise.then(
                // Success: just return the response
                function(response){
                    return response;
                }, 
                // Error: check the error status to get only the 401
                function(response) {
                    if (response.status === 401 && $location.path() != '/login') {
                        $location.url('/login');
                    }
                    return $q.reject(response);
                }
            );
        }
    });

}]);
;angular.module('bookmarkApp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('js/App/View/Bookmarks/mainView.html',
    "<div id=top-bar><h1 class=title>{{user.username}}'s <span class=light>bookmarks</span></h1><ul id=user-settings><li><a ng-click=editSettings()><img src=../img/btns/parameters.png></a></li><li><a href=/#/logout><img src=../img/btns/exit.png></a></li><li></li></ul></div><div class=search-engine-list-general><ng-include src=\"'js/App/View/Bookmarks/searchEnginesList.html'\" ng-controller=SearchEngineController></ng-include></div><hr><div class=categories-list-general ng-controller=CategoryController ng-cloak=\"\"><div class=favorite-category><ul class=\"favorite-list connection\" ng-class=\"{favoritesEmpty: bookmarks.length==0}\" ng-controller=FavoriteController sortable=connection save=saveBookmark(bookmark) data-category={{favorite.id}}><li ng-repeat=\"bookmark in bookmarks\" class=\"favorite-bookmark bookmark\" bookmarkel=false data-bookmark={{bookmark.id}}></li></ul><div class=clr></div></div><div class=categories-actions><a ng-click=addCategory()>Add a category</a></div><ul class=categories-list mansory=255><li class=category-li ng-repeat=\"category in categories\" ng-controller=BookmarkController><div class=category-general><div class=category-header><h2 categoryedit=\"\">{{category.name}}</h2><div class=category-action><a ng-click=\"addFolder(category.id, currentParent)\" style=\"display: none\"><img src=/img/bookmark/folder.png></a> <a ng-click=removeCategory(category)><img src=/img/btns/croix.png></a> <a class=add-bookmark ng-click=\"showAdd = !showAdd\"><img src=/img/btns/new-bookmark.png></a><div class=clr></div></div><div class=clr></div></div><hr><div class=bookmarks-list-general><div addbookmark=\"\" categoryid=category.id postbookmark=\"postBookmark(newBookmark, callback)\" showadd=showAdd parent=currentParent></div><ul class=\"bookmarks-list connection\" ng-class=\"{folder: currentParent!=undefined}\" sortable=connection save=saveBookmark(bookmark) data-category={{category.id}} loadbookmark=loadBookmarks()><li ng-show=currentParent class=bookmark-back><a href=\"\" ng-click=setParent(backElement)>{{currentParent.name|truncate:24}}</a></li><li ng-repeat=\"bookmark in bookmarks\" class=bookmark bookmarkel=\"\" data-bookmark={{bookmark.id}}></li></ul></div></div></li></ul></div><ul class=\"bin connection\" sortable=connection remove=removeBookmark() ng-controller=BookmarkController><li></li></ul>"
  );


  $templateCache.put('js/App/View/Bookmarks/partial/Modal/confirmBox.html',
    "<div class=modal-header><h3>{{title}}</h3><button type=button class=close data-dismiss=modal aria-hidden=true>×</button></div><div class=modal-body>{{content}}</div><div class=modal-action><button type=button class=\"btn cancel\" ng-click=cancel()>Cancel</button> <button type=button class=btn ng-click=confirm()>Confirm</button></div>"
  );


  $templateCache.put('js/App/View/Bookmarks/partial/Modal/editBookmark.html',
    "<div class=modal-header><h3>{{title}}</h3><button type=button class=close data-dismiss=modal aria-hidden=true>×</button></div><div class=modal-body><form ng-submit=save()><div class=edit-bookmark-group><label>Name :<input type=text class=edit-bookmark-name ng-model=bookmark.name placeholder=Name autofocus=autofocus></label></div><div class=edit-bookmark-group><label>Url :<input type=text class=edit-bookmark-url ng-model=bookmark.url placeholder=Url type=url></label></div><div class=edit-bookmark-group><label>Category :<select ng-model=bookmark.category_id ng-options=\"c.id as c.name for c in categories\"></select></label></div><div class=modal-action><button type=submit class=btn>Save</button></div></form></div>"
  );


  $templateCache.put('js/App/View/Bookmarks/partial/Modal/editCategory.html',
    "<div class=modal-header><h3>{{title}}</h3><button type=button class=close data-dismiss=modal aria-hidden=true>×</button></div><div class=modal-body><form ng-submit=save()><div class=edit-category-group><label>Name :<input type=text class=edit-category-name ng-model=category.name placeholder=Name autofocus=autofocus></label></div><div class=modal-action><button class=btn type=submit>Save</button></div></form></div>"
  );


  $templateCache.put('js/App/View/Bookmarks/partial/Modal/editFolder.html',
    "<div class=modal-header><h3>{{title}}</h3><button type=button class=close data-dismiss=modal aria-hidden=true>×</button></div><div class=modal-body><form ng-submit=save()><div class=edit-bookmark-group><label>Name :<input type=text class=edit-bookmark-name ng-model=bookmark.name placeholder=Name autofocus=autofocus></label></div><div class=edit-bookmark-group><label>Category :<select ng-model=bookmark.category_id ng-options=\"c.id as c.name for c in categories\"></select></label></div><div class=modal-action><button type=submit class=btn>Save</button></div></form></div>"
  );


  $templateCache.put('js/App/View/Bookmarks/partial/Modal/editSettings.html',
    "<div class=modal-header><h3>Moteurs de recherche</h3><p class=subtitle>Cliquez sur l'icone d'un moteur pour l'activer, ou le désactiver, de votre page de bookmarks. Sélectionnez aussi votre moteur de recherche par défaut.</p><button type=button class=close data-dismiss=modal aria-hidden=true>×</button></div><div class=modal-body><form ng-submit=save()><div class=modal-center-content><div class=edit-searchEngine-group><div ng-repeat=\"searchEngine in searchEngines\" class=search-engine-selection><img ng-show=searchEngine.selected ng-click=toggleSearchEngine(searchEngine) ng-src=/img/search-engines/on/{{searchEngine.logo}}> <img ng-show=!searchEngine.selected ng-click=toggleSearchEngine(searchEngine) ng-src=/img/search-engines/off/{{searchEngine.logo}}><br><input id=engine{{searchEngine.id}} type=radio name=default ng-show=searchEngine.selected ng-click=toggleDefaultSearchEngine(searchEngine) ng-model=searchEngine.default value=1><label for=engine{{searchEngine.id}}></label></div></div></div><div ng-show=errorDefault>Sélectionnez un moteur de recherche par défault.</div><div class=clr></div><hr><div class=modal-action><button type=submit class=btn>Sauvegarder</button></div></form></div>"
  );


  $templateCache.put('js/App/View/Bookmarks/searchEnginesList.html',
    "<div class=search-engine-list><div class=search-engine-list-int><searchengineshortcut submit=setSelectedSearchEngine(searchEngine) searchengines=searchEngines hint=hint></searchengineshortcut><div ng-repeat=\"searchEngine in searchEngines\" class=search-engine ng-class=\"{selected: selectedSearchEngine.id==searchEngine.id}\"><div class=hint ng-show=hint>{{$index + 1}}</div><img class=engine-on ng-src=/img/search-engines/on/{{searchEngine.logo}} alt={{searchEngine.name}} ng-click=setSelectedSearchEngine(searchEngine)> <img class=engine-off ng-src=/img/search-engines/off/{{searchEngine.logo}} alt={{searchEngine.name}} ng-click=setSelectedSearchEngine(searchEngine)></div><form ng-submit=searchFn() class=form-search><div ng-show=!searchBookmark><input type=text class=input-search ng-model=search.value ng-change=setSearchBookmark() active=searchBookmark focus=\"\"><div id=reset-field ng-click=\"search.value=''\" ng-show=\"search.value!=''\">&times</div></div><div ng-show=searchBookmark><typeahead items=results term=search.value search=searchBookmarkFn(term) select=searchFn focus=refreshDataset() blur=removeDataset()><div id=reset-field ng-click=\"search.value=''\" ng-show=\"search.value!=''\">&times</div><ul class=search-bookmark-results-list><li class=search-bookmark-result ng-repeat=\"result in results\" typeahead-item=result><div class=left><img ng-src=\"http://www.google.com/s2/favicons?domain={{result.url|removeHTTP}}\" height=16 width=16></div><div><p ng-bind-html-unsafe=result.display></p><p class=cat>{{result.category}}<span ng-show=result.parentName>/ {{result.parentName}}</span></p><small>{{result.url|truncate:55}}</small><div class=clr></div></div></li></ul></typeahead></div><button class=btn-search type=submit><i></i></button></form></div></div>"
  );


  $templateCache.put('js/App/View/login.html',
    "<div class=login-form-general><div class=login-form><h1>Login</h1><form method=post ng-submit=loginFn()><div class=form-input><div class=form-group><label><input type=text ng-model=user.login placeholder=Login class=input-login></label><label><input type=password ng-model=user.password placeholder=password class=input-password></label></div><div class=form-error ng-show=loginError>Login or password is incorrect</div><div class=form-group><label><input type=checkbox name=remember ng-model=user.remember class=input-remember>Remember me ?</label></div></div><div class=form-action><button type=submit class=\"submit login\">Login</button> <a class=register-link href=/#/register title=Register>Register</a></div></form></div></div>"
  );


  $templateCache.put('js/App/View/register.html',
    "<div class=register-form-general><div class=register-form><h1>Register</h1><form name=registerForm method=post ng-submit=registerFn()><div class=form-input><div class=form-group><label><input type=text name=login ng-model=user.login placeholder=Login class=input-login ng-minlength=3 ng-maxlength=30 ng-pattern=/^[A-z][A-z0-9]*$/ required=\"\"><span class=form-error ng-show=\"!registerForm.login.$error.minLength && !registerForm.login.$error.maxLength && registerForm.login.$error.pattern && registerForm.login.$dirty\">Must start with a letter, and contain letters &amp; numbers only.</span> <span class=form-error ng-show=\"!registerForm.login.$error.required && (registerForm.login.$error.minlength || registerForm.login.$error.maxlength) && registerForm.login.$dirty\">Username ust be between 3 and 30 characters.</span></label><label><input type=email name=email ng-model=user.email placeholder=Email class=input-email required=\"\"><span ng-show=\"!registerForm.email.$error.required && registerForm.email.$error.email && registerForm.email.$dirty\">invalid email</span></label><label><input type=password id=pwd1 ng-model=user.password placeholder=password class=input-password required=\"\"></label><label><input type=password pw-check=pwd1 name=pwd2 ng-model=user.password2 placeholder=password class=input-password required=\"\"><span class=msg-error ng-show=registerForm.pwd2.$error.pwmatch>passwords don't match.</span></label></div><div class=form-error ng-show=loginError>Error during registration (please check your data)</div></div><div class=form-action><button type=submit class=\"submit register\">Register</button></div></form></div></div>"
  );

}]);
