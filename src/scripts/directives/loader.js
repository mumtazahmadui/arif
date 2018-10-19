(function() {
    angular.module('app.directives')
        .directive('loader', [
        function() {
            return {
                restrict: 'E',
                scope: {
                    isShow: '=',
                    notificationText: '='
                },
                replace: true,
                templateUrl: '/views/directives/loader.html'
            };
        }]);
})();
