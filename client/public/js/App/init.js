var services    = angular.module('bookmarkApp.services', []);
var directives  = angular.module('bookmarkApp.directives', []);
var controllers  = angular.module('bookmarkApp.controllers', []);

var bookmarkApp = angular.module('bookmarkApp', ['bookmarkApp.directives', 'bookmarkApp.controllers','bookmarkApp.services']);
