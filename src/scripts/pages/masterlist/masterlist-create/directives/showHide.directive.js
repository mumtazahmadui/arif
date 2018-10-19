(function () {
    angular.module('rfa.components').directive('showHide', showHide);

    function showHide() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                ngModel: '=',
                row: '=',
                onHide: '=',
                ngDisabled: '=',
                invalidClass: '='
            },
            templateUrl: '/scripts/pages/masterlist/masterlist-create/directives/showHide.template.html',
            link: function(scope) {
                scope.toggle = function (value) {
                    if (scope.ngDisabled) {
                        return false;
                    }
                    scope.ngModel = value;
                    if (value === 0) {
                        scope.onHide(scope.row);
                    }
                };
            }
        };
    }
})();