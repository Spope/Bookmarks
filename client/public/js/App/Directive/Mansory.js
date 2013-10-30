directives.directive("mansory", [ function(){
    return {
        restrict: "A",
        link: function(scope, element, attrs) {

            var options = {
                gutterX: 20,
                gutterY: 20,
                paddingX: 0,
                paddingY: 0,
                enableDrag: false
            };
            if(attrs.mansory) {
                options.colWidth = parseInt(attrs.mansory)
            }

            $(element).shapeshift(options);

            scope.mansory = function() {
                console.log("mansory");
                $(element).trigger("ss-rearrange");
            }
        }
    }
}]);
