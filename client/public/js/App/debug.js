//================================================
// Force to synchronously load the 2 templates
//================================================

services.service('loadConfigTemplate').run(['$templateCache', '$http', function($templateCache, $http){

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "js/App/View/Bookmarks/bookmark.html", false);
    xhr.onload = function (e) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                $templateCache.put('js/App/View/Bookmarks/bookmark.html', xhr.responseText)
            } else {
            }
        }
    };
    xhr.send(null);

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "js/App/View/Bookmarks/folder.html", false);
    xhr.onload = function (e) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                $templateCache.put('js/App/View/Bookmarks/folder.html', xhr.responseText)
            } else {
            }
        }
    };
    xhr.send(null);

}]);
