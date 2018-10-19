(function() {
    angular.module('rfa.components')
        .directive('exhibitTemplateGridHeader', function() {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: '/scripts/pages/exhibit/exhibit-template/exhibit-template-grid/header/header.html',
                controller: 'exhibitTemplateGridHeaderController',
                controllerAs: 'exhTemplateGHCtrl'
            };
        });
})();