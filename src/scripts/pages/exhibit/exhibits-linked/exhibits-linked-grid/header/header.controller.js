(function() {
    angular.module('rfa.components')
        .controller('exhibitsLinkedGridController', exhibitsLinkedGridController);

    function exhibitsLinkedGridController($scope) {
        $scope.textEditorLinkedConfig = {
            controlColumnsValues: []
        };

        var prepareData = function(tableData) {
            var HEADER_INDEX = 0;
            var lastControlColumnsValue = undefined;
            var controlColumnsValues = [];
            tableData.forEach(function(item, index) {
                if (HEADER_INDEX === index) {
                    return;
                }
                if (lastControlColumnsValue !== item[0].controlColumnValue) {
                    controlColumnsValues.push({
                        value: item[0].controlColumnValue,
                        headerText: item[0].headerText
                    });
                    lastControlColumnsValue = item[0].controlColumnValue;
                }
            });
            if (!controlColumnsValues.length) {
                controlColumnsValues.push({
                    value: '',
                    headerText: ''
                });
            }
            $scope.textEditorLinkedConfig.controlColumnsValues = controlColumnsValues;
        };

        $scope.$watch('tableData', function(newValue) {
            if (newValue) {
                prepareData($scope.tableData.rows);
            }
        });
    }
})();
