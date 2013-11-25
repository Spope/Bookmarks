directives.directive("searchengineshortcut", ['$document', '$timeout', function($document, $timeout){

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
