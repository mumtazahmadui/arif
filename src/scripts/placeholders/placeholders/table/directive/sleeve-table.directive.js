(function() {
    angular.module('app.directives')
        .directive('partyBSleeveTablesPl', partyBSleeveTablesDirective);

    function partyBSleeveTablesDirective($sce) {
        return {
            restrict: 'E',
            scope: {
                data: '='
            },
            replace: true,
            templateUrl: '/views/directives/placeholders/tablePlaceholder.html',
            link: function($scope) {
                $scope.checkDefaults = function(column) {
                    var notDef = ['Sell Side Response', 'Reason for Rejection/Pending'];
                    if (!column) {
                        return false;
                    }
                    return -1 === notDef.indexOf(column);
                };
                $scope.tables = $scope.data.tables;
                $scope.tablesLength = Object.keys($scope.tables).length;
                $scope.hidePlaceholder = !$scope.tablesLength;

                $scope.trustAsHtml = function(string) {
                    return $sce.trustAsHtml(string);
                };
            }
        };
    }
})();
