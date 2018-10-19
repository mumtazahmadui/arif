(function() {

    angular.module('app.directives')
        .controller('partyBFundNameChangeCtrl', [
            'AmendmentLetter', '$scope', 'tableWithLineBreaks', 'validataTable', 'prepareDataToSend',
        function(AmendmentLetter, $scope, tableWithLineBreaks, validataTable, prepareDataToSend) {
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

            $scope.isDefaultFieldsFundName = function(name) {
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
                    .getPartyBFundNameChangePlaceHolder($scope.amendmentId).then(function(data) {
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
                $scope.partyBFundNameChange = tableWithLineBreaks.createTableData(data);
                $scope.isShowHeader = !Object.keys($scope.partyBFundNameChange.tables).length;
            }

            var onSave = function(event, params) {
                var sendData = prepareDataToSend.buildData($scope.partyBFundNameChange.tables);
                $scope.loaded = false;
                $scope.notificationText = 'Saving...';
                AmendmentLetter
                    .updateBFundName($scope.amendmentId, sendData)
                    .success(params.success)
                    .error(params.error);
            };

            var isValid = function() {
                if (!validataTable.validate($scope.partyBFundNameChange.tables)) {
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
        }]);
})();
