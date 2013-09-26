filters.filter('removeHTTP', function() {
    return function (text) {
        return text.replace('http://', '').replace('www.', '');
    }
});
