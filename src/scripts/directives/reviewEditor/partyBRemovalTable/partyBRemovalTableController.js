(function() {

    angular.module('app.directives')
        .controller('partyBRemovalTableController', partyBRemovalTableController);

        function partyBRemovalTableController(AmendmentLetter, $scope, tableWithLineBreaks, validataTable, prepareDataToSend) {
            $scope.loaded = false;
            var defaultFields = [
                'Sell Side Response', 'Reason for Rejection/Pending'
            ], responses = [{
                value: 'Accepted',
                text: 'Accept'
            }, {
                value: 'Rejected',
                text: 'Reject'
            }];

            $scope.isDefaultFields = function(name) {
                return -1 === defaultFields.indexOf(name);
            };

            $scope.isMarkInvalid = function(item, value) {
                if (!value) {
                    value = '';
                }
                return (item['Sell Side Response'] === 'Rejected' || item['Sell Side Response'] === 'Pending') &&
                    (!value.length || (value.length >= 501));
            };

            $scope.queueService.addTask(load, render);
            function load() {
                return AmendmentLetter
                    .getPartyBRemovalPlaceHolder($scope.amendmentId).then(function(data) {
                        data.data.columns && data.data.columns.forEach(function(item) {
                            if (item.NAME === 'Sell Side Response') {
                                item.responses = responses;
                            }
                        });
                        data.data.rows.forEach(function(item) {
                            if (item['Reason for Rejection/Pending']) {
                                item['Reason for Rejection/Pending'] = decodeURIComponent(item['Reason for Rejection/Pending']);
                            }
                        });
                        return data;
                    });;
            }

            function render(data) {
                $scope.sourceData = data;
                $scope.partyBRemovalTable = tableWithLineBreaks.createTableData($scope.sourceData, false);
                $scope.isShowHeader = !Object.keys($scope.partyBRemovalTable.tables).length;
            }

            function onSave(event, params) {
                var tables = $scope.partyBRemovalTable.tables;
                if($scope.sleeveRemovalTable){
                    $scope.sleeveRemovalTable.tables.forEach(function(table, index){
                        tables['sleeve-' + index] = table;
                    });
                }
                var sendData = prepareDataToSend.buildData(tables);
                $scope.loaded = false;
                $scope.notificationText = 'Saving...';
                AmendmentLetter
                    .updatePartyBRemoval($scope.amendmentId, sendData)
                    .success(params.success)
                    .error(params.error);
            }

            var isValid = function() {
                if (!validataTable.validate($scope.partyBRemovalTable.tables)) {
                    $scope.errorText = 'Please enter reason for rejection or pending';
                    $scope.validate = false;
                }
            };

            var onSaveEventOff = $scope.$on('onSave', onSave);
            var isValidEventOff = $scope.$on('isValid', isValid);
            $scope.$on('$destroy', function() {
                onSaveEventOff();
                isValidEventOff();
            });
        }
})();
