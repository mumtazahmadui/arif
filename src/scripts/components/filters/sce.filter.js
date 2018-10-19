(function() {
    angular.module('app.filters')
        .filter('sce', function($sce) {
            return function(value) {
                return $sce.trustAsHtml(value);
            };
        });
})();
