/**
 * Screener filters
 * @author IvanPanarin <ipanarin@luxoft.com>
 */

// @ngInject
function screenerFilters(ScreenerService, $rootScope, CredentialsService,myStatusService,$timeout) {
    return {
        restrict: 'E',
        templateUrl: '/scripts/components/screener/filters/filters.html',
        scope: {},
        controller: function($scope) {
            $scope.$on('screenerUpdate', function() {
                $scope.defineKey();
            });
        },
        link: function(scope) {
            scope.data = ScreenerService.get();

            scope.companyType = CredentialsService.companyType();

            scope.mystatus = myStatusService.mystatus;
            scope.isDashboard = ScreenerService.isDashboard;
            scope.screenertitle = scope.data.filters.length > 7 ? true : false;
            scope.onCompletedTabs = ScreenerService.onCompletedTabs;
            scope.bulkActionClickable = ['notificationOperations','notificationManager','notificationTax']
            //if there are only 1 filter, then we using 1/4 of table ** i was in trap here, it was increased to 2=)
            if (scope.data.filters.length <=2 ) {
                scope.width = 3;
            }  else if(scope.data.filters.length <=6 ) {
                scope.width = Math.floor(12 / scope.data.filters.length);
            }
            else if(scope.data.filters.length  > 6 ) {
                scope.width = 2;
            }

            scope.hasPermissions = function(permission) {
                return CredentialsService.hasPermission(permission);
            };
            scope.hasAnyPermissions = function(permission) {
                return CredentialsService.hasAnyPermissions(permission);
            };

            scope.updateFilters = function() {
                scope.data.pages.page = 1;
                ScreenerService.set(scope.data, true);
                ScreenerService.setexpandAccordion(scope.data);
                scope.defineKey();
            };

            scope.notEmpty = function() {
                return scope.data.task || scope.data.filters.some(function(v) {
                    return ['All', 'Anyone',''].indexOf(v.view_value) === -1;
                });
            };

            scope.clearFilters = function(set) {
                $rootScope.$broadcast('remoteTasksWipe');
                ScreenerService.collapseAccordion();
                angular.forEach(scope.data.filters, function(element) {
                    switch (element.default_value) {
                        case 'Anyone':
                            element.value = [];
                            if (element.search_value) {
                                element.search_value = '';
                            }
                            break;
                        case 'All':
                            element.value = [];
                            if (element.search_value) {
                                element.search_value = '';
                            }
                            element.view_value = 'All';
                            break;
                        default:
                            element.value = [scope.filter.default_value];
                            element.view_value = '';
                            break;
                    }

                });

                if (set) {
                    ScreenerService.set(scope.data, true);
                }
            };

            scope.isDisabledLink = function(action) {
                if (scope.companyType == 'BS') {
                    if (scope.onCompletedTabs) {
                        return true;
                    } else {
                        return false;
                    }
                }
                if (scope.companyType == 'SS') {
                    if (scope.onCompletedTabs) {
                        var x  = scope.bulkActionClickable.indexOf(action.method)
                        if (x !== -1) {
                            return false;
                        } else {
                            return true;
                        }
                    } else {
                        return false;
                    }
                }
            }

            scope.bulkNotifications = function() {
                scope.$emit('bulkNotifications');
            };

            scope.getSelectedRows = function() {
                return _.filter(scope.data.table.data.dataList,
                    function(row){
                        return row.selected;
                    });
            };

            scope.getPartyBSelectedRows = function() {
                var selectedRow = []
                var rfaId = null
                var masterAgreement = null
                _.forEach(scope.data.table.data.dataList, function(row) {
                    rfaId = row.id;
                    masterAgreement = row.masterAgreement;
                    _.filter(row.partyBEntities,function(element){
                            if (element.selected) {
                                element.amendmentId = rfaId;
                                element.amendmentStatus = row.amendmentStatus.displayName;
                                element.masterAgreement = masterAgreement;
                                selectedRow.push(element);
                            }
                        });
                  });
                  return selectedRow;
            }

            scope.getSelectedValidRfaIdRows = function() {
                var isError = false;
                var selectedRfa = [];
                var rfaId = [];
                var partyB = scope.getPartyBSelectedRows();

                _.filter(scope.data.table.data.dataList,function(row){
                        if (row.selected) {
                            rfaId.push(row.id);
                            selectedRfa.push(row);
                        }
                    });

                if (partyB.length && rfaId.length) {
                    _.forEach(partyB,function(row) {
                        var compare = _.indexOf(rfaId, row.amendmentId);
                        if (compare === -1) {
                            isError = true;
                        }
                    });
                    if (isError) {
                        return [];
                    } else {
                        return selectedRfa
                    }
                } else {
                    return selectedRfa;
                }
            };

            scope.getSelectedValidUploadedRows = function() {
                var isError = false;
                var selectedRfa = [];
                var ssReadyFlag=false;
                _.filter(scope.data.table.data.dataList,function(row){
                        if (row.selected) {
                            if(scope.data.id=="SSRFA" && row.signDisabled && row.nextActions.eSign){
                                ssReadyFlag=true;
                            }else if (!row.nextActions.eSign) {
                                isError = true;
                            }
                            selectedRfa.push(row);
                        }
                    });

                    if(ssReadyFlag){
                        return 'ssUploadReadyExecute';
                    }else if (isError) {
                        console.log("selectedRfa.length :: ",selectedRfa.length)
                        if (selectedRfa.length > 1) {
                            return 'multiSelected';
                        } else  {
                            return 'uploadSignedNextStepError';
                        }
                    } else {
                        return selectedRfa;
                    }
            };

            scope.bulkAction = function(action) {
                if (scope.companyType == 'BS') {
                    if (scope.onCompletedTabs) return true;
                }

                if (scope.companyType == 'SS') {
                    if (scope.onCompletedTabs) {
                        var x  = scope.bulkActionClickable.indexOf(action.method)
                        if (x === -1) return true;
                    }
                }

                if (action.rfaIdValidation) {
                    scope.$emit('bulkAction', {action: action, rows: scope.getSelectedValidRfaIdRows()});
                }
                else if (action.partyBLevel) {
                    scope.$emit('bulkAction', {action: action, rows: scope.getPartyBSelectedRows()});
                }
                else if (action.uploaded) {
                    scope.$emit('bulkAction', {action: action, rows: scope.getSelectedValidUploadedRows()});
                } 
                else {
                    scope.$emit('bulkAction', {action: action, rows: scope.getSelectedRows()});
                }
            };

            scope.buttonAction = function(action) {
                scope.$emit('buttonAction', {action: action});
            };

            scope.$on('remoteFiltersWipe', function() {
                scope.clearFilters();
            });

            scope.defineKey = function() {
                angular.forEach(scope.data.filters, function(filterItem) {
                    angular.forEach(filterItem.data, function(dataItem) {
                        if (typeof dataItem === 'object') {
                            if (typeof dataItem.id !== 'undefined') {
                                filterItem.trackBy = 'id';
                            } else if (typeof dataItem.key !== 'undefined') {
                                filterItem.trackBy = 'key';
                            }
                        } else {
                            filterItem.trackBy = '';
                        }
                    });

                    if (filterItem.type === 'toggle') {
                        var data = filterItem.data;
                        filterItem.data = [];
                        angular.forEach(data, function(dataItem) {
                            if (filterItem.values.indexOf(dataItem) !== -1) {
                                filterItem.data.push(dataItem);
                            }
                        });

                    }
                });
            };
        }
    };
}

angular
    .module('app.directives')
    .directive('screenerFilters', screenerFilters);
