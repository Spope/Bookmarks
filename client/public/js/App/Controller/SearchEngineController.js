function SearchEngineController($scope, UserService){

    //$scope.serachEngines = UserService.user.searchEngine;

    $scope.searchEngines = [
        {
            name: 'Google',
            url : 'http://www.google.fr/search?q={q}',
            logo: 'google.png'
        },
        {
            name: 'Amazon',
            url : 'http://www.amazon.fr/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords={q}&x=0&y=0',
            logo: 'amazon.png'
        }
    ];
}
