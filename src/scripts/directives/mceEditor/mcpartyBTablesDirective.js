(function() {
    angular.module('app.directives')
        .directive('partyBTables', partyBTablesDirective);

    function partyBTablesDirective() {
        return {
            restrict: 'E',
            scope: {
                model: '='
            },
            replace: true,
            templateUrl: '/views/directives/mceEditor/amendmentReviewTable.html',
            link: function($scope) {

                if ($scope.model) {
                    $scope.data = $scope.model.getData();
                }

                $scope.checkDefaults = function(column) {
                    var notDef = ['Sell Side Response', 'Reason for Rejection/Pending'];
                    if (!column) {
                        return false;
                    }
                    return -1 === notDef.indexOf(column);
                };
            }
        };
    }
})();
