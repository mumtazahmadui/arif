(function() {
    angular.module('rfa.exhibits-linked')
        .factory('exhibitsLinkedAdapter', function($base64) {
            return function(data, content) {
                var prepareRows = function(originRows, tableData) {
                    var rows = originRows;
                    rows.forEach(function(item) {
                        var newRow = [];
                        var sleeveWithoutParents = false;
                        //checking, if there are no parents, then we just showing disabled cells
                        if (true) {
                            sleeveWithoutParents = parentNotAvailable(item, rows);
                        }
                        var rowspan;
                        if (sleeveWithoutParents) {
                            countRowspanWithoutParent(item, rows);
                        } else {
                            rowspan = countRowspan(item, rows);
                        }

                        tableData.rows[0].forEach(function(column) {
                            newRow.push({
                                columnIndex: parseInt(item.PARTYB_ID, 10),
                                order: column.order,
                                name: item[column.columnName] || '',
                                columnName: item[column.columnName] || '',
                                columnStyle: column.columnStyle,
                                controlColumn: column.controlColumn,
                                controlColumnValue: item.CONTROL_COLUMN_VALUE,
                                headerText: item.HEADER_TEXT,
                                isSleeve: item.IS_SLEEVE && item.IS_SLEEVE!=='0',
                                deleted: column.deleted,
                                id: column.id,
                                rowspan: item.rowspan || rowspan,
                                sleeveWithoutParents: sleeveWithoutParents,
                                parent_entiry_id : item.PARENT_ENTITY_ID || null
                            });
                        });
                        tableData.rows.push(newRow);
                    });

                    return tableData;
                };
                var tableData = {
                    rows: [[]]
                };

                // 4 is default value in most cases
                var actionColumnIndex = 4,
                    currentColumnIndex = 0;
                data.columns.forEach(function(column) {
                    if (column.NAME === 'Action') {
                        actionColumnIndex = currentColumnIndex;
                    }
                    if (column.HIDDEN !== '1') {
                        currentColumnIndex ++;
                    }
                    var columnId = parseInt(column.COLUMN_ID, 10);
                    var controlColumn = parseInt(column.IS_CONTROL_COLUMN, 10) === 1;
                    var index = parseInt(column.INDEX, 10);
                    tableData.rows[0].push({
                        columnIndex: index,
                        order: index,
                        name: column.NAME + (controlColumn ? '*' : ''),
                        columnName: column.NAME,
                        label: column.LABEL,
                        columnStyle: '',
                        controlColumn: controlColumn,
                        deleted: parseInt(column.HIDDEN, 10),
                        id: columnId
                    });
                });

                tableData = prepareRows(data.rows, tableData);

                function countRowspan (row, rowsArr) {
                    var childrenArr = rowsArr.filter(function (item) {
                        var sameParent = row['PARENT_ENTITY_ID'] === item['PARENT_ENTITY_ID'];
                        return sameParent && item.Action === row.Action;
                    });

                    return childrenArr.length + 1;
                }

                function countRowspanWithoutParent(row, rowsArr) {
                    if (row.rowspan) {
                        return;
                    }

                    var sameParentArr = rowsArr.filter(function (item) {
                        return (row['PARENT_ENTITY_ID'] === item['PARENT_ENTITY_ID']) && 
                        item.Action === row.Action ;
                    });

                    if (sameParentArr.length) {
                        sameParentArr[0].rowspan = sameParentArr.length;
                        for (var i = 1, l = sameParentArr.length; i < l; i += 1) {
                            sameParentArr[i].rowspan = 0;
                        }
                    }
                }

                function parentNotAvailable (row, rowsArr) {
                    var foundParents = rowsArr.filter(function (item) {
                        var sameParent = row['PARENT_ENTITY_ID'] === item['PARENT_ENTITY_ID'];
                        return sameParent && item.Action === row.Action
                    });
                    return foundParents.length;
                }

                return {
                    name: '',
                    tableData: tableData,
                    indexOfLastEditableColumn: actionColumnIndex,
                    data: [],
                    content: decodeURIComponent($base64.decode(content))
                };
            };
        });
})();
