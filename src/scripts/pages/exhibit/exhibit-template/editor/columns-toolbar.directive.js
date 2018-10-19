(function() {
    angular.module('rfa.exhibit-template-editor')
        .directive('exhibitColumnsToolbar', function(exhibitTemplateGridData) {
           return {
               restrict: 'E',
               templateUrl: '/scripts/pages/exhibit/exhibit-template/editor/columns-toolbar.html',
               scope: true,
               link: function(scope) {
                   var DEFAULT_CELL_COUNT = 3;

                   scope.addColumn = function() {
                       scope.tableData = exhibitTemplateGridData.addColumn(scope.tableData);
                   };
                   scope.removeColumn = function() {
                       var result = exhibitTemplateGridData.removeColumn({
                           tableData: scope.tableData,
                           columnsOffset: scope.columnsOffset,
                           columnsPerPage: scope.columnsPerPage,
                           type: undefined
                       });
                       scope.tableData = result.tableData;
                       scope.columnsOffset = result.columnsOffset;

                       var notDeletedRowsCount = exhibitTemplateGridData.getNotDeletedRowsCount(result.tableData);
                       if (DEFAULT_CELL_COUNT >= notDeletedRowsCount) {
                           scope.isShowSelectControlColumn.flag = false;
                       }
                   };

                   scope.selectControlColumn = function() {
                       if (!scope.isShowSelectControlColumn.flag) {
                           var count = exhibitTemplateGridData.getNotDeletedRowsCount(scope.tableData);
                           if (count <= DEFAULT_CELL_COUNT) {
                               return;
                           }
                       }

                       scope.isShowSelectControlColumn.flag = !scope.isShowSelectControlColumn.flag;
                   };
               }
           }
        });
})();
