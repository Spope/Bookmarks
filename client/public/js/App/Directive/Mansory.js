directives.directive("mansory", [ '$timeout', '$window', function($timeout, $window){
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

            scope.getFont = function(){
                return window.font;
            }

            scope.mansory = function() {
                
                if(window.fontLoaded){
                    __masonry();
                }else{
                    var temp = scope.$on('font-loaded', function(){
                        __masonry();
                        temp();
                    });
                }
            }

            __masonry = function(){
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
