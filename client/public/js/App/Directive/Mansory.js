directives.directive("mansory", [ '$timeout', function($timeout){
    return {
        restrict: "A",
        link: function(scope, element, attrs) {

            var options = {
                layoutMode: 'masonryColumnShift',
                masonry: {
                }
            };

            if(attrs.mansory) {
                options.masonry.columnWidth = parseInt(attrs.mansory)
            }

            element.isotope(options);

            scope.mansory = function() {

                //Hack to wait the render to finish
                $timeout(function(){
                    element.isotope('reloadItems').isotope();
                });
            }

            scope.refreshMansort = function() {
                $timeout(function(){
                    element.isotope('reLayout').isotope();
                });
            }
        }
    }
}]);
