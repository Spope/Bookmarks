angular.module('bookmarkApp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('js/App/View/Bookmarks/bookmark.html',
    "<a class=url-bookmark ng-href={{bookmark.url}} target=_blank title={{bookmark.name}}><img ng-src=http://placehold.it/16x16 height=16 width=16>    {{bookmark.name|truncate:24}}</a>"
  );


  $templateCache.put('js/App/View/Bookmarks/mainView.html',
    "<div id=top-bar><h1 class=title>{{user.username}}'s <span class=light>bookmarks</span></h1><ul id=user-settings><li><a ng-click=editSettings()><img src=../img/btns/parameters.png height=22 width=22></a></li><li><a href=/#/logout><img src=../img/btns/exit.png height=22 width=22></a></li><li></li></ul></div><div class=search-engine-list-general><ng-include src=\"'js/App/View/Bookmarks/searchEnginesList.html'\" ng-controller=SearchEngineController ng-cloak=\"\"></ng-include></div><hr><div class=categories-list-general ng-controller=CategoryController ng-cloak=\"\"><div class=favorite-category><ul class=\"favorite-list connection\" ng-class=\"{favoritesEmpty: bookmarks.length==0}\" ng-controller=FavoriteController sortable=connection save=saveBookmark(bookmark) data-category={{favorite.id}}><li ng-repeat=\"bookmark in bookmarks\" class=\"favorite-bookmark bookmark\" bookmarkel=false data-bookmark={{bookmark.id}}></li></ul><div class=clr></div></div><div class=categories-actions><a ng-click=addCategory()>Add a category</a></div><ul class=categories-list mansory=255><li class=category-li ng-repeat=\"category in categories\" ng-controller=BookmarkController><div class=category-general><div class=category-header><h2 categoryedit=\"\">{{category.name}}</h2><div class=category-action><a ng-click=\"addFolder(category.id, currentParent)\" style=\"display: none\"><img src=/img/bookmark/folder.png width=20 height=20></a> <a ng-click=removeCategory(category)><img src=/img/btns/croix.png></a> <a class=add-bookmark ng-click=\"showAdd = !showAdd\"><img src=/img/btns/new-bookmark.png width=20 height=20></a><div class=clr></div></div><div class=clr></div></div><hr><div class=bookmarks-list-general><div addbookmark=\"\" categoryid=category.id postbookmark=\"postBookmark(newBookmark, callback)\" showadd=showAdd parent=currentParent></div><ul class=\"bookmarks-list connection\" ng-class=\"{folder: currentParent!=undefined}\" sortable=connection save=saveBookmark(bookmark) data-category={{category.id}} loadbookmark=loadBookmarks()><li ng-show=currentParent class=bookmark-back><a href=\"\" ng-click=setParent(backElement)>{{currentParent.name|truncate:24}}</a></li><li ng-repeat=\"bookmark in bookmarks\" class=bookmark bookmarkel=\"\" data-bookmark={{bookmark.id}}></li></ul></div></div></li></ul></div><ul class=\"bin connection\" sortable=connection remove=removeBookmark() ng-controller=BookmarkController><li></li></ul>"
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
    "<div class=search-engine-list><div class=search-engine-list-int><searchengineshortcut submit=setSelectedSearchEngine(searchEngine) searchengines=searchEngines hint=hint></searchengineshortcut><div ng-repeat=\"searchEngine in searchEngines\" class=search-engine ng-class=\"{selected: selectedSearchEngine.id==searchEngine.id}\"><div class=hint ng-show=hint>{{$index + 1}}</div><img class=engine-on ng-src=/img/search-engines/on/{{searchEngine.logo}} alt={{searchEngine.name}} ng-click=setSelectedSearchEngine(searchEngine) width=36 height=36> <img class=engine-off ng-src=/img/search-engines/off/{{searchEngine.logo}} alt={{searchEngine.name}} ng-click=setSelectedSearchEngine(searchEngine) width=36 height=36></div><form ng-submit=searchFn() class=form-search><div ng-show=!searchBookmark><input type=text class=input-search ng-model=search.value ng-change=setSearchBookmark() active=searchBookmark focus=\"\"><div id=reset-field ng-click=\"search.value=''\" ng-show=\"search.value!=''\">&times</div></div><div ng-show=searchBookmark><typeahead items=results term=search.value search=searchBookmarkFn(term) select=searchFn focus=refreshDataset() blur=removeDataset()><div id=reset-field ng-click=\"search.value=''\" ng-show=\"search.value!=''\">&times</div><ul class=search-bookmark-results-list><li class=search-bookmark-result ng-repeat=\"result in results\" typeahead-item=result><div class=left><img ng-src=\"http://g.etfv.co/{{result.url}}?defaulticon=lightpng\" height=16 width=16></div><div><p ng-bind-html-unsafe=result.display></p><p class=cat>{{result.category}}<span ng-show=result.parentName>/ {{result.parentName}}</span></p><small>{{result.url|truncate:55}}</small><div class=clr></div></div></li></ul></typeahead></div><button class=btn-search type=submit><i></i></button></form></div></div>"
  );


  $templateCache.put('js/App/View/folder.html',
    "<a class=url-bookmark href=\"\" title={{bookmark.name}} ng-click=setParent(bookmark)><img src=/img/bookmark/folder.png height=16 width=16> {{bookmark.name|truncate:24}}<ul class=\"connection sub-folder\" data-id={{bookmark.id}} sortable=connection save=saveBookmark(bookmark)></ul></a>"
  );


  $templateCache.put('js/App/View/login.html',
    "<div class=login-form-general><div class=login-form><h1>Login</h1><form method=post ng-submit=loginFn()><div class=form-input><div class=form-group><label><input type=text ng-model=user.login placeholder=Login class=input-login></label><label><input type=password ng-model=user.password placeholder=password class=input-password></label></div><div class=form-error ng-show=loginError>Login or password is incorrect</div><div class=form-group><label><input type=checkbox name=remember ng-model=user.remember class=input-remember>Remember me ?</label></div></div><div class=form-action><button type=submit class=\"submit login\">Login</button> <a class=register-link href=/#/register title=Register>Register</a></div></form></div></div>"
  );


  $templateCache.put('js/App/View/register.html',
    "<div class=register-form-general><div class=register-form><h1>Register</h1><form name=registerForm method=post ng-submit=registerFn()><div class=form-input><div class=form-group><label><input type=text name=login ng-model=user.login placeholder=Login class=input-login ng-minlength=3 ng-maxlength=30 ng-pattern=/^[A-z][A-z0-9]*$/ required=\"\"><span class=form-error ng-show=\"!registerForm.login.$error.minLength && !registerForm.login.$error.maxLength && registerForm.login.$error.pattern && registerForm.login.$dirty\">Must start with a letter, and contain letters &amp; numbers only.</span> <span class=form-error ng-show=\"!registerForm.login.$error.required && (registerForm.login.$error.minlength || registerForm.login.$error.maxlength) && registerForm.login.$dirty\">Username ust be between 3 and 30 characters.</span></label><label><input type=email name=email ng-model=user.email placeholder=Email class=input-email required=\"\"><span ng-show=\"!registerForm.email.$error.required && registerForm.email.$error.email && registerForm.email.$dirty\">invalid email</span></label><label><input type=password id=pwd1 ng-model=user.password placeholder=password class=input-password required=\"\"></label><label><input type=password pw-check=pwd1 name=pwd2 ng-model=user.password2 placeholder=password class=input-password required=\"\"><span class=msg-error ng-show=registerForm.pwd2.$error.pwmatch>passwords don't match.</span></label></div><div class=form-error ng-show=loginError>Error during registration (please check your data)</div></div><div class=form-action><button type=submit class=\"submit register\">Register</button></div></form></div></div>"
  );

}]);
