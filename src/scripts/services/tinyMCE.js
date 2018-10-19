(function(){
    angular
        .module('app.services')
        .factory('tinyMCE', function() {
            return window.tinyMCE;
        });
})();