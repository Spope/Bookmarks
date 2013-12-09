directives.directive("mansory", [ '$timeout', function($timeout){
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
                }, 0);
            }
        }
    }
}]);
