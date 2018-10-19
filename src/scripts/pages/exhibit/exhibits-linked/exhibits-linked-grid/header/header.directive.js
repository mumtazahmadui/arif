(function() {
    angular.module('rfa.components')
        .directive('exhibitsLinkedGridHeader', function() {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: '/scripts/pages/exhibit/exhibits-linked/exhibits-linked-grid/header/header.html',
                controller: 'exhibitsLinkedGridController'
            };
        });
})();
