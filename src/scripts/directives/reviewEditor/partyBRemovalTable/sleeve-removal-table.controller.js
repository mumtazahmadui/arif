(function(){
    'use strict';    
    angular.module('app.directives')
        .controller('SleeveRemovalTableController', SleeveRemovalTableController)
    ;

    function SleeveRemovalTableController(AmendmentLetter, $scope, tableWithLineBreaks, prepareDataToSend, validataTable){
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
                return (item['Sell Side Response'] === 'Rejected') &&
                        (!value.length || (value.length >= 501));
            };

            $scope.queueService.addTask(load, render);
            function load() {
                return AmendmentLetter
                    .getSleeveRemovalPlaceHolder($scope.amendmentId).then(function(data) {
                        data.data.columns && data.data.columns.forEach(function(item) {
                        if (item.NAME === 'Sell Side Response') {
                            item.responses = responses;
                        }
                    });
                    data.data.rows.forEach(function(item) {
                        if (item['Reason for Rejection/Pending'])
                            item['Reason for Rejection/Pending'] = decodeURIComponent(item['Reason for Rejection/Pending']);
                        });
                        return data;
                    });
            }

            function render(data) {
                $scope.sourceData = data;
                $scope.sleeveRemovalTable = tableWithLineBreaks.createTableData($scope.sourceData, false);
                $scope.isShowHeader = !Object.keys($scope.sleeveRemovalTable.tables).length;
            }

            function onSave(event, params) {
                var tables = $scope.sleeveRemovalTable.tables;
                var sendData = prepareDataToSend.buildData(tables);
                if (!sendData.ssResponses.length) {
                    return;
                }
                $scope.loaded = false;
                $scope.notificationText = 'Saving...';
                AmendmentLetter
                    .updateSleeveRemoval($scope.amendmentId, sendData)
                    .success(params.success)
                    .error(params.error);
            }

            var isValid = function() {
                if (!validataTable.validate($scope.sleeveRemovalTable.tables)) {
                    $scope.$parent.errorText = 'Please enter reason for rejection or pending';
                    $scope.$parent.validate = false;
                } else if (!validataTable.validateSleeve($scope.sleeveRemovalTable.tables)) {
                    $scope.$parent.errorText = 'Sub-account(s) can be actioned only after parent account is actioned';
                    $scope.$parent.validate = false;
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
