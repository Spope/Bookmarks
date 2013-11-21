controllers.controller('SearchEngineController', ['$scope', 'SearchEngineService', '$window', 'LocalBookmarkService', 'CategoryService', 'BookmarkService', '$timeout', function($scope, SearchEngineService, $window, LocalBookmarkService, CategoryService, BookmarkService, $timeout){

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
