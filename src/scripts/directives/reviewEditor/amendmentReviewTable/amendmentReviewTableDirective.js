(function() {
    angular.module('app.directives')
        .directive('amendmentReviewTable', amendmentReviewTable);

    function amendmentReviewTable(placeholdersDataConnections, modalsService) {
        return {
            restrict: 'E',
            scope: {
                data: '=',
                checkDefaults: '=',
                isMarkInvalid: '='
            },
            templateUrl: '/views/directives/reviewEditor/amendmentReviewTable.html',
            link: function($scope) {
                var anyChanged = false;

                function setSameValue (value) {
                    return function (child) {
                        child['Sell Side Response'] = value;
                    };
                }

                function setSameValueAndClearReasons (value) {
                    return function (child) {
                        child['Sell Side Response'] = value;
                        child['Reason for Rejection/Pending'] = '';
                        anyChanged = true;
                    };
                }

                function setSameReasonsForChildren(value) {
                    return function (child) {
                        if (child['Sell Side Response'] !== 'Accepted') {
                            child['Reason for Rejection/Pending'] = value;
                        }
                    };
                }

                $scope.setResponseValue = function(placeholder, item, value) {
                    if (!$scope.ableToResponse(placeholder, item, value)) {
                        return false;
                    }

                    item['Sell Side Response'] = value;

                    // if we accepting, we are clearing 'reasons for rejecting' fields for parent and children
                    if (value === 'Accepted') {
                        anyChanged = false;
                        var message = placeholder === "PARTYB_ADDITION_TABLE" ?
                            'All linked sub-account(s) will be automatically accepted. User will have the ability to edit response' :
                            'All linked sub-account(s) will automatically be accepted for removal';
                        item['Reason for Rejection/Pending'] = '';
                        placeholdersDataConnections.changeChildrenValues(placeholder, item, setSameValueAndClearReasons(value));
                        if (anyChanged) {
                            modalsService.alert({
                                'class': 'modal-rfa',
                                'title': 'Alert',
                                'body': message
                            });
                        }
                    } else {
                        placeholdersDataConnections.changeChildrenValues(placeholder, item, setSameValue(value));
                    }
                };

                $scope.setChildrenReasons = function (placeholder, item) {
                    placeholdersDataConnections.changeChildrenValues(placeholder, item, setSameReasonsForChildren(item['Reason for Rejection/Pending']));
                };

                $scope.ableToResponse = function (placeholder, item, value) {
                    return placeholdersDataConnections.isChildResponseAvailable(placeholder, item, value);
                };

                $scope.isShowErrorMaxLength = function(value, maxLength) {
                    if (!value || !value.length) {
                        return false;
                    }
                    return value.length > maxLength;
                };

                $scope.avoidAlign = function (column) {
                    if (column && column.name === 'Sell Side Response') {
                        return {
                            'text-align': 'left'
                        };
                    }
                };
            }
        };
    }
})();

