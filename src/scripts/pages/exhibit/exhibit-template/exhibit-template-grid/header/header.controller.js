(function() {
    angular.module('rfa.components')
        .controller('exhibitTemplateGridHeaderController', exhibitTemplateGridHeaderController);

    function exhibitTemplateGridHeaderController($scope, exhibitTemplateGridData, exhibitTemplateConfig) {
        $scope.tableData = {};
        $scope.tableData.rows = angular.copy(exhibitTemplateGridData.createDefaultData);
        $scope.isShowSelectControlColumn = {flag: false};
        $scope.columnsOffset = exhibitTemplateConfig.columns.offset;
        $scope.columnsPerPage = exhibitTemplateConfig.columns.perPage;
        $scope.DEFAULT_CELL_COUNT = 3;
        $scope.shownColumn = function(column) {
            return column.deleted === 0 || column.deleted === undefined;
        };

        angular.extend(this, {
            columnScrollLeft: function() {
                if ($scope.columnsOffset > 0) {
                    $scope.columnsOffset--;
                }
            },
            columnScrollRight: function() {
                if (this.availableToScrollRight()) {
                    $scope.columnsOffset++;
                }
            },
            shownColumn: $scope.shownColumn,
            // Cells operations
            availableToScrollRight: function() {
                return $scope.columnsOffset + $scope.columnsPerPage < $scope.tableData.rows[0].filter(function(i) {
                    return i.deleted !== 1;
                }).length;
            }            
        });
    }
})();
