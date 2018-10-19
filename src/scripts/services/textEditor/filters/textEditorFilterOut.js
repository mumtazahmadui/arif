angular
    .module('app.services')
    .factory('textEditorFilterOut',[
        'textEditorTypesConfig',
        '$base64',
        'CredentialsService',
        function(EditorTypes, $base64, CredentialsService) {
            function generateHtmlTable(rows) {
                // Generating HTML for table
                var tHtml = '';
                var tStart = '<table><tbody>';
                var tEnd = '</tbody></table>';
                tHtml += tStart;

                function sortByOrder(cellA, cellB) {
                    return cellA.order - cellB.order;
                }

                for (var rowIndex = 0; rowIndex < rows.length; rowIndex++) {
                    tHtml += '<tr>';
                    var orderedRow = rows[rowIndex].sort(sortByOrder);
                    for (var columnIndex = 0; columnIndex < orderedRow.length; columnIndex++) {
                        var cell = orderedRow[columnIndex];
                        if (cell.deleted !== 1) {
                            var rowLabel = cell.label || cell.name;
                            tHtml += '<td>' + rowLabel + '</td>';
                        }
                    }
                    tHtml += '</tr>';
                }
                tHtml += tEnd;
                return tHtml;
            }

            function getCells(rows, parentRow, columnIndex){
                var cells = [];
                for (var rowIndex = 1; rowIndex < rows.length; rowIndex++) {
                    var item = rows[rowIndex][columnIndex];
                    var cell = {};
                    if (item) {
                        if (item.id > 0) {
                            cell.id = item.id;
                        }
                        cell.value = item.name;
                        cell.style = item.style;
                        cell.deleted = parentRow.deleted;
                        cell.partyBEntityId = parentRow.partyBEntityId;
                    }
                    cells.push(cell);
                }
                if (cells.length === 0) {
                    cells = null;
                }
                return cells;
            }

            function createCells (dataForAJAX, rows, params) {
                for (var columnIndex = 0; columnIndex < rows[0].length; columnIndex++) {
                    var parentRow = rows[0][columnIndex];
                    if (!parentRow.id && params.type === EditorTypes.exhibit && 1 === parentRow.deleted) {
                        continue;
                    }

                    if (parentRow.style !== undefined) {
                        parentRow.style = parentRow.style
                            .replace('ng-valid', '')
                            .replace('ng-touched', '')
                            .replace('ng-dirty', '')
                            .replace('ng-valid-parse', '')
                            .replace('ng-pristine', '')
                            .trim();
                    }

                    dataForAJAX.columns[columnIndex] = {
                        columnName: parentRow.name,
                        columnStyle: parentRow.style,
                        createdBy: CredentialsService.userId(),
                        modifiedBy: CredentialsService.userId(),
                        deleted: parentRow.deleted,
                        columnIndex: columnIndex
                    };

                    if (params.type === EditorTypes.linked) {
                        dataForAJAX.columns[columnIndex].cells = getCells(rows, parentRow, columnIndex);
                    } else if (params.type === EditorTypes.exhibit) {
                        dataForAJAX.columns[columnIndex].controlColumn = false;
                        if (params.selectControlColumn && parentRow.hasOwnProperty('controlColumn')) {
                            dataForAJAX.columns[columnIndex].controlColumn = parentRow.controlColumn;
                        }
                    }

                    if (params.contentId !== 'new' && params.content.name !== '') {
                        dataForAJAX.columns[columnIndex].id = parentRow.id;
                    }
                }
            }

            return function(params) {
                var dataForAJAX = params.data ? _.clone(params.data) : {};

                // Generating columns content
                if (params.type === EditorTypes.linked || params.type === EditorTypes.exhibit) {
                    if (
                        dataForAJAX.columns === undefined ||
                        dataForAJAX.columns.length !== params.tableData.rows[0].length
                    ) {
                        dataForAJAX.columns = [];
                    }

                    createCells(dataForAJAX, params.tableData.rows, params);

                    var tableHtml = generateHtmlTable(params.tableData.rows);

                    dataForAJAX.htmlContent = $base64.encode(encodeURIComponent(tableHtml));
                }

                // add encode content
                var encodedContent = $base64.encode(encodeURIComponent(params.template.replace(/<br>/g, '<br/>')));
                if (params.type === EditorTypes.linked || params.type === EditorTypes.exhibit) {
                    dataForAJAX.textContent = encodedContent;
                } else {
                    dataForAJAX.content = encodedContent;
                }

                if (params.name) {
                    dataForAJAX.name = params.name;
                }

                var res = {
                    data: dataForAJAX
                };

                if (params.preparedData) {
                    res.preparedData = params.preparedData;
                }

                return res;
            };
        }]);
