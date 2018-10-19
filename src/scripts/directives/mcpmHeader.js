(function() {

    angular.module('app.directives')
        .directive('mcpmHeader', function(){
            return {
                restrict: 'E',
                replace: true,
                templateUrl: '/views/directives/mcpmHeader.html'
            };
        });
})();
