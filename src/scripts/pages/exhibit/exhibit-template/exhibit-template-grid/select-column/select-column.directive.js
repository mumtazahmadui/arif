(function() {
    angular.module('rfa.components')
        .directive('exhibitTemplateGridSelectColumn', function() {
            return {
                restrict: 'A',
                replace: true,
                templateUrl: '/scripts/pages/exhibit/exhibit-template/exhibit-template-grid/select-column/select-column.html',
                controller: 'exhibitTemplateGridSelectColumnController'
            };
        });
})();
