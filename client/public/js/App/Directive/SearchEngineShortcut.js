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

            $(window).bind('keypress', function(e) {
                if(e.shiftKey &&  corresp[scope.position].indexOf(e.charCode) > -1){
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
