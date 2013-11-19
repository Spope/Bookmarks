directives.directive("searchengineshortcut", ['$window', '$timeout', function($window, $timeout){

    return {
        restrict: "E",
        scope: {
            position: "=",
            searchengine: "=",
            submit: "&"
        },
        link: function(scope, element, attrs) {

            var corresp = {
                1: [38],
                2: [233],
                3: [34],
                4: [145, 146, 39],
                5: [40],
                6: [45],
                7: [232],
                8: [95],
                9: [231]
            }

            $(window).bind('keypress', function(e) {
                if(e.ctrlKey &&  corresp[scope.position].indexOf(e.charCode) > -1){
                    e.preventDefault();
                    scope.submit({searchEngine: scope.searchengine});

                    $timeout(function() {
                        $('.input-search:visible').focus();
                    });

                    return false;
                }
            });
        }
    }
}]);
