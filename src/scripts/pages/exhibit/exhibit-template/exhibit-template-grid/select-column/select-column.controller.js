(function() {
    angular.module('rfa.components')
        .controller('exhibitTemplateGridSelectColumnController', exhibitTemplateGridSelectColumnController);

    function exhibitTemplateGridSelectColumnController($scope) {
        var LAST_DEFAULT_CELL_INDEX = 2;
        var isWasSelected = false;

        var ifDoActions = function() {
            if (!$scope.isShowSelectControlColumn) {
                return false;
            }

            if (!$scope.tableData || !$scope.tableData.rows.length) {
                return false;
            }

            return true;
        };

        $scope.controlColumnClick = function(cell) {
            if (!ifDoActions()) {
                return;
            }
            cell.controlColumn = !cell.controlColumn;
            var length = $scope.tableData.rows[0].length;
            for(var i = LAST_DEFAULT_CELL_INDEX  + 1; i < length; i++) {
                if (cell !== $scope.tableData.rows[0][i]) {
                    $scope.tableData.rows[0][i].controlColumn = false;
                }
            }
        };

        var removeColumn = function() {
            if (!ifDoActions()) {
                return;
            }

            var lastNotDeleted = -1;
            var isOneSelected = false;
            var length = $scope.tableData.rows[0].length;
            for(var i = LAST_DEFAULT_CELL_INDEX  + 1; i < length; i++) {
                var isShowColumn = $scope.shownColumn($scope.tableData.rows[0][i]);
                if (isShowColumn) {
                    lastNotDeleted = i;
                }

                var isControlColumn = $scope.tableData.rows[0][i].controlColumn && isShowColumn;
                $scope.tableData.rows[0][i].controlColumn = isControlColumn;

                if (isControlColumn) {
                    isOneSelected = true;
                }
            }


            if (
                'new' === $scope.amendmentId
                && !isOneSelected
                && $scope.tableData.rows[0][lastNotDeleted]
                && isWasSelected
            ) {
                $scope.tableData.rows[0][lastNotDeleted].controlColumn = true;
            }
        };

        var beforeRemoveColumn = function() {
            isWasSelected = false;
            if (!ifDoActions()) {
                return;
            }

            var length = $scope.tableData.rows[0].length;
            for(var i = length - 1; i > LAST_DEFAULT_CELL_INDEX; i--) {
                if (1 !== $scope.tableData.rows[0][i].deleted) {
                    isWasSelected = $scope.tableData.rows[0][i].controlColumn;
                    break;
                }
            }
        };

        if ($scope.eventManager) {
            $scope.eventManager.off('removeColumn:after', removeColumn);
            $scope.eventManager.on('removeColumn:after', removeColumn);
            $scope.eventManager.off('removeColumn:before', beforeRemoveColumn);
            $scope.eventManager.on('removeColumn:before', beforeRemoveColumn);
        }
    }
})();
