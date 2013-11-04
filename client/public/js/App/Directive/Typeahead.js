directives.directive("typeahead", ['$window', '$rootScope', '$compile', function ($window, $rootScope, $compile){
    
    // get template from cache or you can load it from the server
    var template = "<p><small>{{datum.parent}}</small>{{datum.value}}aapp</p>";
    var compileFn = $compile(template);
    var templateFn = function (datum) {
        var newScope = $rootScope.$new();
        newScope.datum = datum;
        var element = compileFn(newScope);
        newScope.$apply();
        var html = element.html();
        newScope.$destroy();
        return html;
    };
    return {
        restrict: "A",
        scope: {
            datasets: '=',
            active:   '=',
            ngModel:  '='
        },
        link: function(scope, element, attrs){

            scope.$watch('active', function() {
                if(scope.active) {
                    var options = scope.datasets();
                    options.template = templateFn;
                    element.typeahead(
                        options
                    ).on('typeahead:selected typeahead:autocompleted', function(data, datum) {
                        scope.ngModel = datum.value;
                        //scope.$apply();
                        $window.open(datum.url);
                        //element.closest('form').submit()
                    });
                }else{
                    element.typeahead('destroy');
                }

                element.focus();

            });

            element.bind('keyup', function(e) {
                scope.ngModel = element.val();
                scope.$apply();
            });
        }
    }
}]);
