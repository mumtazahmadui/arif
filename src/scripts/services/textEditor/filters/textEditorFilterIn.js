angular
    .module('app.services')
    .factory('textEditorFilterIn',[
        'textEditorTypesConfig',
        'textEditorConfig',
        '$base64',
        function(EditorTypes, textEditorConfig, $base64) {

            var checkDatePinned = function(content) {
                var findDatePinned = /id="date_pinned"/g;
                var matches = content.match(findDatePinned);
                if (!matches || !matches.length) {
                    content = textEditorConfig.datePinned + content;
                }
                return content;
            };

            function sortCells(cells, sortByBA){
               return cells.sort(function(a, b) {
                    return a.partyBEntityId && sortByBA.indexOf(a.partyBEntityId) > -1 ?
                        sortByBA.indexOf(a.partyBEntityId) - sortByBA.indexOf(b.partyBEntityId)
                        : a.id - b.id;
                });
            }

            return function(data, type) {
                var tableData = {
                    rows: [[]]
                };
                var content = '';
                var newData = _.clone(data.data);

                if (EditorTypes.linked === type && angular.isObject(newData.exhibit)) {
                    newData.exhibit.name = newData.name;
                    if (!newData.exhibit.partyBEntities) {
                        newData.exhibit.partyBEntities = newData.partyBEntities;
                    }
                    newData = newData.exhibit;
                }

                if (newData.columns) {
                    for (var i = 0; i < newData.columns.length; i++) {
                        newData.columns[i].cells = _.uniq(newData.columns[i].cells, 'partyBEntityId');
                    }
                }

                var source = newData.textContent || newData.content;
                if (source) {
                    content = decodeURIComponent($base64.decode(source));
                    var values = /value="((?!\<)[a-zA-Z0-9\s\[\]]*(?!\<))"/g;
                    content = content.replace(values, 'value="&lt; $1 &gt;"');
                }

                if (EditorTypes.letter === type) {
                    content = checkDatePinned(content);
                }

                var partyBAddtion = [];
                if (EditorTypes.linked === type && angular.isArray(newData.partyBEntities)) {
                    partyBAddtion = angular.copy(
                        newData.partyBEntities
                    ).filter(function(item) {
                        if (item.isAdded) {
                            return item;
                        }
                    }).sort(function(a, b) {
                        return a.id - b.id;
                    });
                }

                if ((EditorTypes.linked === type || EditorTypes.exhibit === type) && angular.isArray(newData.columns)) {
                    newData.columns = newData.columns.sort(function(a, b) {
                        return a.columnIndex - b.columnIndex || a.id - b.id;
                    });

                    var sortByBA = partyBAddtion.map(function(v) {
                        return v.entity.id;
                    });

                    var getName = function(entity, index, cell) {
                        if (index > 2 || !entity) {
                            return !cell ? '' : cell.value;
                        }

                        if (0 === index) {
                            return entity.trueLegalName || entity.name;
                        }

                        if (1 === index) {
                            return entity.clientIdentifier;
                        }
                        return entity.lei;
                    };

                    var cells_length = partyBAddtion.length;
                    for (var index = 0; index < newData.columns.length; index++) {
                        var col = newData.columns[index];
                        var cells = sortCells(col.cells, sortByBA);

                        tableData.rows[0][index] = {
                            style: col.columnStyle,
                            name: col.columnName,
                            controlColumn: col.controlColumn,
                            id: col.id,
                            deleted: col.deleted
                        };

                        if (EditorTypes.linked !== type) {
                            continue;
                        }
                        
                        for (var ci = 0; ci < cells_length; ci++) {
                            var cell = cells[ci] || '';
                            var entity = partyBAddtion[ci].entity;

                            if (!tableData.rows[1 + ci]) {
                                tableData.rows[1 + ci] = [];
                            }

                            tableData.rows[1 + ci][index] = {
                                deleted: 0,
                                partyBEntityId: entity.id,
                                style: (!cell ? '' : cell.columnStyle),
                                controlColumn: col.controlColumn,
                                name: getName(entity, index, cell)
                            };

                            if (cell) {
                                tableData.rows[1 + ci][index].id = cell.id;
                            }
                        }
                    }
                }
                return {
                    tableData: tableData,
                    data: newData,
                    content: content
                };
            };
        }]);
