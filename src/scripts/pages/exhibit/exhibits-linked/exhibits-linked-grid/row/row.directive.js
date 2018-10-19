(function() {
    angular.module('rfa.components')
        .directive('exhibitsLinkedGridRow', function() {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: '/scripts/pages/exhibit/exhibits-linked/exhibits-linked-grid/row/row.html',
                scope: {
                    controlColumn: '=',
                    lastEditableColumn: '='
                },
                controller: 'exhibitsLinkedGridRowController'
            };
        });
})();
