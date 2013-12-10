window.fontLoaded = false;
WebFont.load({
    google: {
        families: [ 'Open+Sans:300italic,400italic,400,300,700:latin' ]
    },
    active: function() {
        window.fontLoaded = true;
        var scope = $("html").scope();
        if(scope){
            scope.$broadcast('font-loaded'); // bit hacky but allow to wait before isotope positionning
        }
    },
});
