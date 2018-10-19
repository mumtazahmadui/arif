angular
    .module('app.services')
    .factory('textEditorGetDataForEditor',
    function(AmendmentLetter, $stateParams, $q, textEditorFilterIn, $base64) {

        var prepareRows = function(originRows, tableData) {
            var rows = originRows.sort(function(a, b) {
                if (a.Action === b.Action) {
                    return 0;
                }
                return a.Action > b.Action ? 1 : -1;
            });

            rows.forEach(function(item) {
                var newRow = [];
                tableData.rows[0].forEach(function(column) {
                    newRow.push({
                        columnIndex: parseInt(item.PARTYB_ID, 10),
                        name: item[column.columnName] || '',
                        columnName: item[column.columnName] || '',
                        columnStyle: column.columnStyle,
                        controlColumn: column.controlColumn,
                        controlColumnValue: item.CONTROL_COLUMN_VALUE,
                        headerText: item.HEADER_TEXT,
                        deleted: column.deleted,
                        id: column.id
                    });
                });
                tableData.rows.push(newRow);
            });

            return tableData;
        };

        var prepareTableData = function(data, content) {
            var tableData = {
                rows: [[]]
            };
            data.columns.forEach(function(column) {
                var columnId = parseInt(column.COLUMN_ID, 10);
                var controlColumn = parseInt(column.IS_CONTROL_COLUMN, 10) === 1;
                var index = parseInt(column.INDEX, 10);
                tableData.rows[0].push({
                    columnIndex: index,
                    name: column.NAME + (controlColumn ? '*' : ''),
                    columnName: column.NAME,
                    columnStyle: '',
                    controlColumn: controlColumn,
                    deleted: parseInt(column.HIDDEN, 10),
                    id: columnId
                });
            });

            tableData = prepareRows(data.rows, tableData);
            return {
                name: '',
                tableData: tableData,
                data: [],
                content: decodeURIComponent($base64.decode(content))
            };
        };

        return {
            getAmendmentDraftWithoutContent: function(type) {
                var originRequest = AmendmentLetter.getAmendmentDraft({
                                        id: $stateParams.contentId
                                    });
                var data = {
                    name: '',
                    editorData: null
                };
                return originRequest.then(function(dt) {
                    var originData = dt.data;
                    // it must be removed
                    if (originData.data) {
                        angular.extend(data, {
                            name: originData.data.name,
                            editorData: textEditorFilterIn(originData, type)
                        });
                    }
                    return data;
                });
            },
            getAmendmentDraft: function(type) {
                // it must be removed
                var originRequest = AmendmentLetter.getAmendmentDraft({
                    id: $stateParams.contentId
                }),
                contentRequest = AmendmentLetter.getContent({
                    id: $stateParams.contentId
                }),
                data = {name: '', editorData: null};

                return $q.all([originRequest, contentRequest]).then(function(dt) {
                    var originData = dt[0].data,
                        content = dt[1]
                        ;
                    originData.data.content = content.data.content;
                    // it must be removed
                    if (originData.data) {
                        angular.extend(data, {
                            name: originData.data.name,
                            editorData: textEditorFilterIn(originData, type)
                        });
                    }
                    if (content && content.data) {
                        angular.extend(data.editorData, {
                            content: decodeURIComponent($base64.decode(content.data.content))
                        });
                    }
                    return data;
                });
            },
            getCommonData: function() {
                var originRequest = AmendmentLetter.get({
                    id: $stateParams.contentId,
                    exhibitId: $stateParams.exhibitId
                });

                return $q.all([originRequest]).then(function(dt) {
                    var originData = dt[0].data;
                    if (!originData) {
                        return null;
                    }
                    var content = dt[0].data.exhibitTextContent;
                    return {
                        name: '',
                        editorData: prepareTableData(originData, content),
                        exhibitHTMLContent: dt[0].data.exhibitHTMLContent
                    };
                });
            },

            getPartyBAdditionalContent: function() {
                return AmendmentLetter.getPartyBAdditionalContent({id: $stateParams.contentId});
            },

            getPartyBRemovalContent: function() {
                return AmendmentLetter.getPartyBRemovalContent({id: $stateParams.contentId});
            },

            getPartyBExhibitValueChangeContent: function() {
                return AmendmentLetter.getPartyBExhibitValueChangeContent({id: $stateParams.contentId});
            },

            getPartyBFundNameChangeContent: function() {
                return AmendmentLetter.getPartyBFundNameChangeContent({id: $stateParams.contentId});
            },

            getPartyARelationsContent: function() {
                return AmendmentLetter.getPartyARelationsContent({id: $stateParams.contentId});
            },
            getDatePinnedContent: function() {
                return AmendmentLetter.getDatePinnedContent({id: $stateParams.contentId});
            }
        };

    });
