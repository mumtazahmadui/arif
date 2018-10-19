(function() {
    angular.module('rfa.components')
        .controller('exhibitsLinkedGridRowController', exhibitsLinkedGridRowController);

    function exhibitsLinkedGridRowController($scope, exhibitTemplateConfig) {
        $scope.LAST_LINKED_DEFAULT_INDEX = $scope.lastEditableColumn;
        $scope.columnsPerPage = exhibitTemplateConfig.columns.perPage;
        $scope.columnsOffset = exhibitTemplateConfig.columns.offset;

        $scope.textEditorLinkedTableShownRow = function(row, index) {
            return index === 0 || $scope.controlColumn.value === row[0].controlColumnValue;
        };

        $scope.tooltipBody = function (cell, index) {
            if (index > $scope.LAST_LINKED_DEFAULT_INDEX && cell.label) {
                return cell.label;
            } else if (cell.name) {
                return cell.name;
            } else {
                return '';
            }
        };

        $scope.shownColumn = function(column) {
            return column.deleted === 0 || column.deleted === undefined;
        };

        $scope.columnScrollRight = function() {
            if ($scope.availableToScrollRight()) {
                $scope.columnsOffset++;
            }
        };

        $scope.columnScrollRight = function() {
            if ($scope.availableToScrollRight()) {
                $scope.columnsOffset++;
            }
        };

        $scope.columnScrollLeft = function() {
            if ($scope.columnsOffset > 0) {
                $scope.columnsOffset--;
            }
        };

        $scope.availableToScrollRight = function() {
            return $scope.columnsOffset + $scope.columnsPerPage < $scope.$parent.tableData.rows[0].filter(function(i) {
                    return i.deleted !== 1;
                }).length;
        };
    }
})();
