(function() {
    angular.module('rfa.components')
        .factory('exhibitTemplateGridData', exhibitTemplateGridDataFactory);

    function exhibitTemplateGridDataFactory(exhibitTemplateGridDefaultData) {
        var LAST_DEFAULT_CELL_INDEX = 2;

        var addColumn = function(tableData) {
            for (var i = 0; i < tableData.rows.length; i++) {
                if (!tableData.rows[i].length) {
                    continue;
                }
                tableData.rows[i].push({
                    style: '',
                    name: ''
                });
            }
            return tableData;
        };

        var removeColumn = function(data) {
            for (var i = 0; i < data.tableData.rows.length; i++) {
                if (data.tableData.rows[i].length < 4) {
                    continue;
                }

                var deleted = 0;
                for (var c = data.tableData.rows[i].length - 1; c >= 3; c--) {
                    var isContinue = data.tableData.rows[i][c].deleted === 1;
                    if (isContinue) {
                        deleted++;
                        continue;
                    }

                    if (data.tableData.rows[i][c].deleted === undefined) {
                        data.tableData.rows[i] = _.without(data.tableData.rows[i], data.tableData.rows[i][c]);
                    } else {
                        deleted++;
                        data.tableData.rows[i][c].deleted = 1;
                    }

                    if (data.columnsOffset + data.columnsPerPage >= data.tableData.rows.length) {
                        data.columnsOffset--;
                    }

                    if (data.columnsOffset < 0) {
                        data.columnsOffset = 0;
                    }
                    break;
                }
            }
            return {
                notDeletedRowsCount: data.tableData.rows[0].length - deleted,
                tableData: data.tableData,
                columnsOffset: data.columnsOffset
            };
        };

        var getNotDeletedRowsCount = function(tableData) {
            if (!tableData.rows.length) {
                return 0;
            }

            var count = 0;
            tableData.rows[0].forEach(function(item) {
                if (!item.deleted) {
                    count++;
                }
            });
            return count;
        };

        var firstNotDeletedRowsCount = function(tableData) {
            if (!tableData.rows.length) {
                return 0;
            }

            var index = -1;
            for(var i = LAST_DEFAULT_CELL_INDEX + 1, l = tableData.rows[0].length; i < l; i++) {
                if (!tableData.rows[0][i].deleted) {
                    break;
                }
                index
            }
            return index;
        };

        return {
            firstNotDeletedRowsCount: firstNotDeletedRowsCount,
            getNotDeletedRowsCount: getNotDeletedRowsCount,
            createDefaultData: exhibitTemplateGridDefaultData,
            addColumn: addColumn,
            removeColumn: removeColumn
        };
    }
})();