(function() {
    angular
        .module('app.placeholders')
        .factory('app.placeholders.tablePrepareData', [
            'CredentialsService', 'tableReviewEditorConfig', '$base64',
        function(CredentialsService, tableReviewEditorConfig, $base64) {
            return function() {
                var createColumns = function(columns, item) {

                    var userType = CredentialsService.companyType(),
                        config = tableReviewEditorConfig.hide[userType],
                        result = [],
                        synonyms = {
                            'Parent Account True Legal Name': 'Party B Account True Legal Name',
                            'Parent Account Client Identifier': 'Party B Account Client Identifier'
                        },
                        sleeveItem = item.IS_SLEEVE === '1'
                    ;

                    angular.forEach(columns, function(item) {
                        if (+item.HIDDEN) {
                            return;
                        }
                        if (config.include && config.include.indexOf(item.NAME) === -1 || !item.NAME) {
                            return;
                        }
                        if (sleeveItem && item.IS_SLEEVE === '0' || !sleeveItem && item.IS_SLEEVE === '1' ) {
                            return;
                        }

                        var res = {name: item.NAME, label: item.LABEL, order: +item.INDEX};
                        if(sleeveItem && synonyms[item.NAME]){
                            res.columnName = synonyms[item.NAME];
                        }

                        if (item.responses) {
                            res.responses = item.responses;
                        }
                        result.push(res);
                    });
 
                    if (tableReviewEditorConfig.noborders[userType]) {
                        var nb = tableReviewEditorConfig.noborders[userType];
                        result = result.sort(function(item1, item2) {
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
                            return 0;
                        });

                        result.some(function(item) {
                            if (item.nobordered) {
                                return true;
                            }
                            return false;
                        });

                    }
                    return result;
                };

                var prepareLineBreak = function(tables) {
                    _.forEach(tables, function(table) {
                        if (!table.lineBreak) {
                            table.lineBreak = {
                                exhibitControlColumnId: table.rows[0].EXHIBIT_CONTROL_COLUMN_ID,
                                lineBreakIndex: parseInt(table.rows[0].LINE_BREAK_INDEX),
                                lineBreakText: '',
                                showHeaderText: table.headerName
                            };
                        }
                    });
                };

                var getLineBreak = function(item, lineBreaks) {
                    var index = item.LINE_BREAK_INDEX,
                        searchFilter = {
                            LINE_BREAK_INDEX: index
                        };
                    var result = _.findLastIndex(lineBreaks, searchFilter);
                    if (-1 === result) {
                        return null;
                    }
                    var lineBreak = lineBreaks.splice(result, 1)[0];
                    return {
                        exhibitControlColumnId: lineBreak.EXHIBIT_CONTROL_COLUMN_ID,
                        lineBreakIndex: parseInt(lineBreak.LINE_BREAK_INDEX),
                        lineBreakText: '',
                        showHeaderText: decodeURIComponent($base64.decode(lineBreak.SHOW_HEADER_TEXT ?
                            lineBreak.SHOW_HEADER_TEXT
                            : ''))
                    };
                };

                var getTableIndex = function(item){
                    var res = (item['CONTROL_COLUMN_VALUE'] || item['EXHIBIT_CONTROL_COLUMN_ID']);
                    if (res === null || -1 === res) {
                        res = '0';
                    }
                    res = res.toString();
                    return res;
                };                

                var createOrGetTableObject = function(tables, item, data) {
                    var index = getTableIndex(item);

                    if (tables[index])
                        return tables[index];
                    else {
                        var table = {
                            headerName: item.HEADER_TEXT,
                            columns: createColumns(data.columns, item),
                            rows: [],
                            lineBreak: getLineBreak(item, data.lineBreaks)
                        };
                        tables[index] = table;
                        return table;
                    }
                };

                var createTables = function(data) {
                    var tables = {
                    };
                    angular.forEach(data.rows, function(item) {
                        var table = createOrGetTableObject(tables, item, data);
                        table.rows.push(item);
                    });
                    prepareLineBreak(tables);
                    return tables;
                };

                var preparePrevLineBreak = function(lineBreaks) {
                    var result = [];
                    angular.forEach(lineBreaks, function(item) {
                        result.push(
                            item.LINE_BREAK_TEXT ?
                                item.LINE_BREAK_TEXT
                                : ''
                        );
                    });
                    return result;
                };

                this.prepareGetData = function(data) {
                    data = JSON.parse(data);
                    var tables, res;
                    _.some(data.rows, function(item){return item.IS_SLEEVE && item.IS_SLEEVE !== '0'}),
                        tables = createTables(data),
                        res = {
                            previousLineBreaks: preparePrevLineBreak(data.previousLineBreaks),
                            tables: tables
                        }
                    ;

                    return res;
                };

                this.prepareSendData = function(args) {
                    var data = args.data,
                        tables = data.tables,
                        headerText = {},
                        ids = [args.id],
                        tableIndex = 0
                    ;

                    ids.forEach(function(tableId){
                        _.each($('#' + tableId + ' .headerText'), function(header, index) {
                            var tid = index;
                            headerText[tid] = header.innerHTML;
                        });
                    });

                    _.map(tables, function(table) {
                        if (table.lineBreak) {
                            table.lineBreak.showHeaderText = headerText[tableIndex] || '';
                        }
                        tableIndex ++;
                        return table;
                    });
                    var res = [];
                    Object.keys(tables).forEach(function(tindex) {
                        var table = tables[tindex];
                        var lb = angular.copy(table.lineBreak);
                        if (!lb) {
                            res.push(lb);
                            return;
                        }

                        lb.lineBreakText = $base64.encode(encodeURIComponent(lb.lineBreakText || ''));
                        lb.showHeaderText = $base64.encode(encodeURIComponent(lb.showHeaderText || ''));
                        res.push(lb);
                    });
                    return res;
                };
            };
        }]);
})();
