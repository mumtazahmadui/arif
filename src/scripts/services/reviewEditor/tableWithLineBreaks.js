(function() {
    angular
        .module('app.services')
        .service('tableWithLineBreaks', [
            'CredentialsService', 'tableReviewEditorConfig', '$base64', 'placeholdersDataConnections',
        function(CredentialsService, tableReviewEditorConfig, $base64, placeholdersDataConnections) {
            var createColumns = function(columns, config, isSleeve) {
                var result = [];
                angular.forEach(columns, function(item) {
                    if (+item.HIDDEN)
                        return;
                    if (config.include && config.include.indexOf(item.NAME) === -1)
                        return;
                    if (!isSleeve && item.IS_SLEEVE === '1' || isSleeve && item.IS_SLEEVE === '0')
                        return;

                    var res = {name: item.NAME, label: item.LABEL, index: +item.INDEX};
                    if (item.responses) {
                        res.responses = item.responses;
                    }
                    result.push(res);
                });
                return result;
            };

            var getLineBreak = function(index, lineBreaks) {
                var searchFilter = {
                    LINE_BREAK_INDEX: index
                };
                var result = _.findLastIndex(lineBreaks, searchFilter);
                if (-1 === result) {
                    return null;
                }
                var lineBreak = lineBreaks.splice(result, 1);
                return {
                    text: decodeURIComponent($base64.decode(lineBreak[0].LINE_BREAK_TEXT)),
                    isShowHeader: lineBreak[0].SHOW_HEADER_TEXT ?
                                    decodeURIComponent($base64.decode(lineBreak[0].SHOW_HEADER_TEXT))
                                    : ''
                };
            };

            var getTableIndex = function(item){
                var res = item.CONTROL_COLUMN_VALUE || item.EXHIBIT_CONTROL_COLUMN_ID;
                if (res === null || typeof res === 'undefined' || -1 === res) {
                    res = 0;
                }
                return res;
            };

            var createOrGetTableObject = function(tables, item, lineBreaks, isSleeve, placeHolderType) {
                var index = getTableIndex(item);
                if(isSleeve && index !== 'sleeve') {
                    return null;
                }

                if (!tables[index]) {
                    tables[index] = {
                        placeHolderType: placeHolderType,
                        headerName: item.HEADER_TEXT,
                        rows: [],
                        lineBreak: getLineBreak(item.LINE_BREAK_INDEX, lineBreaks)
                    };
                }
                return {
                    table: tables[index],
                    index: index
                };
            };

            var prepareColumns = function(columns, isSleeve){
                var userType = CredentialsService.companyType(),
                    res = createColumns(columns, tableReviewEditorConfig.hide[userType], isSleeve);

                if (tableReviewEditorConfig.noborders[userType]) {
                    var nb = tableReviewEditorConfig.noborders[userType], bi;
                    res = res.sort(function(item1, item2) {
                        if (nb.indexOf(item1.name) > -1) {
                            item1.nobordered = true;
                        }
                        if (nb.indexOf(item2.name) > -1) {
                            item2.nobordered = true;
                        }

                        if (nb.indexOf(item1.name) === -1 && nb.indexOf(item2.name) > -1)
                                return -1;
                        if (nb.indexOf(item1.name) > -1 && nb.indexOf(item2.name) === -1)
                                return 1;
                        var i1 = item1.index,
                            i2 = item2.index
                        ;
                        return i1 > i2 ? 1 : i1 < i2  ? -1 : 0;
                    });

                    res.some(function(item, index) {
                        if (item.nobordered) {
                            bi = index;
                            return true;
                        }
                        return false;
                    });

                    res.splice(bi, 0, {name: '', splitter: true});

                }
                return res;

            };

            var createTables = function(columns, rows, lineBreaks, isSleeve, placeHolderType) {
                var tables = {};
                angular.forEach(rows, function(item) {                    
                    var tableHash = createOrGetTableObject(tables, item, lineBreaks, isSleeve, placeHolderType),
                        table = tableHash && tableHash.table,
                        key = tableHash && tableHash.index,
                        lisSleeve = isSleeve
                    ;
                    if(!tableHash) return;

                    if((key+'').indexOf('sleeve') === 0) lisSleeve = true;
                    if(!table.columns){
                        table.columns = prepareColumns(columns, lisSleeve);
                    }
                    table.INDEX_OF_LAST_UNMERGED_COLUMN = getIndexOfLastUnmergedColumn(table.columns);
                    //we need id for exhibit value table
                    countRowspan(item, rows);
                    table.rows.push(item);
                });

                if (tables && tables[0] && tables[0].rows && tables[0].rows.length) {
                    tables[0].placeHolderType = placeHolderType;
                    placeholdersDataConnections.setRows(placeHolderType, tables[0].rows);
                } else {
                    if (placeHolderType) {
                        var summaryRows = [];
                        angular.forEach(tables, function (value) {
                            summaryRows = summaryRows.concat(value.rows);
                        });
                        placeholdersDataConnections.setRows(placeHolderType, summaryRows);
                    }
                }

                return tables;
            };

            function countRowspan (item, rows) {
                if (typeof item.rowspan !== 'undefined') {
                    return;
                }
                var index = rows.indexOf(item) + 1;
                var rowspan = 1;
                var PROP = 'Party B True Legal Name';
                var isSameParents = true;
                while (index < rows.length && isSameParents) {
                    if (rows[index][PROP] === item[PROP])  {
                        rowspan += 1;
                        rows[index].rowspan = 0;
                    } else {
                        isSameParents = false;
                    }
                    index += 1;
                }
                item.rowspan = rowspan;
            }

            function getIndexOfLastUnmergedColumn (columns) {
                var index = 0;
                for (var i = 0, l = columns.length; i < l; i ++) {
                    if (columns[i].name === 'Action') {
                        index = i;
                    }
                }
                return index;
            }

            var preparePrevLineBreak = function(lineBreaks) {
                var result = [];
                angular.forEach(lineBreaks, function(item) {
                    result.push(
                        item.LINE_BREAK_TEXT ?
                            decodeURIComponent($base64.decode(item.LINE_BREAK_TEXT))
                            : ''
                    );
                });
                return result;
            };

            this.createTableData = function(data, isSleeve) {
                return {
                    previousLineBreaks: preparePrevLineBreak(data.previousLineBreaks),
                    //columns: columns,
                    tables: createTables(data.columns, data.rows, data.lineBreaks, isSleeve, data.placeHolderType)
                };
            };
        }]);
})();
