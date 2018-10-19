(function () {
    angular
        .module('app.directives')
        .directive('screenerTable', screenerTable);

    function screenerTable(ScreenerService, CredentialsService, $location, myStatusService) {
        return {
            restrict: 'E',
            template: '<div ng-include="getContentUrl()"></div>',
            scope: {},
            controller: screenerCtrl,
            controllerAs: 'screenerCtrl',
            link: function (scope) {
                // When Landing from Email Link...
                // Accordion will open..
                scope.PartyBFilter = "no"
                scope.$location = $location.search();
                if (Object.keys(scope.$location).length > 0) {
                    var searchLink = Object.assign({}, scope.$location);
                    if (searchLink.email) {
                        scope.PartyBFilter = 'yes';
                    }
                }

                scope.tooltipAudit = {
                    'delay': 1000,
                    'placement': 'bottom',
                    'leftplacement': 'left',
                    'class': 'btn-audit'
                }
                scope.reviews = {};
                scope.mystatus = {};

                scope.hasPermissions = function (permission) {
                    return CredentialsService.hasPermission(permission);
                };
                var exculdedDisable = ['operations', 'tax', 'manager'];
                var clickableItem = ['onboarding', 'kyc', 'credit', 'legal'];
                scope.limitPagesize = null;

                var templates = ['amendments', 'letters', 'exhibits', 'masterlist', 'masterlist_template', 'uploaded_files', 'upload_template'];
                scope.data = ScreenerService.get();
                function splitJoin(obj, fieldNames) {
                    fieldNames.forEach(function (val) {
                        if (obj.hasOwnProperty(val) && obj[val]) {
                            obj[val] = obj[val].split('\'').join('"');
                        }
                    });
                }

                scope.placementTooltips = function (index, itemPerpage) {
                    if (scope.limitPagesize > 10) {
                        if (scope.limitPagesize >= itemPerpage) {
                            if ((index === (itemPerpage - 1)) || (index === (itemPerpage - 2)) || (index === (itemPerpage - 3))) {
                                return 'top';
                            } else {
                                return 'bottom';
                            }
                        } else {
                            if ((index === (scope.limitPagesize - 1)) || (index === (scope.limitPagesize - 2)) || (index === (scope.limitPagesize - 3))) {
                                return 'top';
                            } else {
                                return 'bottom';
                            }
                        }
                    } else {
                        return 'bottom';
                    }
                }

                scope.toStringJson = function (obj) {
                    if (obj && !obj.length) {
                        return JSON.stringify(obj);
                    }
                    for (var ind = 0; ind < obj.length; ind++) {
                        splitJoin(obj[ind], ['reason']);
                        if (!obj[ind].entity) {
                            continue;
                        }
                        splitJoin(obj[ind].entity, ['name', 'lei', 'trueLegalName', 'clientIdentifier']);
                    }
                    return JSON.stringify(obj);
                };
                scope.$watch(function () {
                    return scope.data.table.data;
                },
                    function (data) {
                        if (data.dataList) {
                            scope.limitPagesize = data.dataList.length;
                        }
                        if (data.dataList) {
                            angular.forEach(data.dataList, function (request) {
                                if (!request.reviewData) {
                                    return;
                                }
                                Object.keys(request.reviewData).forEach(function (item) {
                                    if (!request.reviewData[item]) {
                                        return;
                                    }
                                    var _item = scope.reviews[request.id],
                                        dataItem = request.reviewData[item];
                                    if (!_item) {
                                        _item = {};
                                        scope.reviews[request.id] = _item;
                                    }
                                    _item[item + 'State'] = !!dataItem.review_id;
                                    _item[item + 'User'] = dataItem.updateBy;
                                    _item[item] = dataItem[(item === 'legal' ? item : 'onBoarding') + '_review_id'];
                                });
                            });
                        }

                        // CheckFor Accordion Expanded
                        if (ScreenerService.expandAccordion) {
                            scope.PartyBFilter = 'yes';
                        } else {
                            scope.PartyBFilter = 'no';
                        }


                        // Configuration of PartyB Checked/UnChecked...
                        if (data.dataList) {
                            angular.forEach(data.dataList, function (request) {
                                if (request.partyBEntities && request.partyBEntities.length) {
                                    var partyLength = request.partyBEntities.length;
                                    var m = {}
                                    angular.forEach(request.partyBEntities, function (item) {
                                        for (var key in item.deskStatus) {
                                            if (item.deskStatus !== 'bsCPDeskStatus' || item.deskStatus !== 'deskOneStatus' || item.deskStatus !== 'deskTwoStatus') {
                                                var filedName = "";
                                                var x = key.split(/(?=[A-Z])/);
                                                if (x.length > 2) {
                                                    filedName = x[0] + "_" + x[1] + x[2];
                                                } else {
                                                    filedName = x[0] + "_" + x[1];
                                                }
                                                if (item.deskStatus[key] === 1) {
                                                    item[filedName] = true;
                                                    m[filedName] = m[filedName] ? m[filedName] + 1 : 1

                                                }
                                            }
                                        }
                                        _.forEach(m, function (num, key) {
                                            if (num == partyLength) {
                                                request.partyBEntities[key] = true;
                                            }
                                        });
                                    })

                                }
                            });
                        }
                        //updating EsignValue
                        if (data.dataList) {
                            angular.forEach(data.dataList, function (request) {
                                request.eSigncount = request.eSigncount < 10 ? '0' + request.eSigncount : request.eSigncount;
                                request.wSignCount = request.wSignCount < 10 ? '0' + request.wSignCount : request.wSignCount;
                                var defaultSignStatus = request.wSignStatus || 'Not Signed';
                                request.wSignStatus = defaultSignStatus;
                            });
                        }
                    }
                );

                scope.getContentUrl = function () {
                    if (templates.indexOf(scope.data.table.template) !== -1) {
                        if (scope.data.table.template == 'amendments') {
                            ScreenerService.isDashboards(false);
                        } else {
                            ScreenerService.isDashboards(true);
                        }

                        return '/scripts/components/screener/tables/' + scope.data.table.template + '_table.html';
                    }
                    ScreenerService.isDashboards(true);
                    return '/scripts/components/screener/tables/table.html';
                };

                scope.call = function (name, params) {
                    ScreenerService.call({
                        name: name,
                        params: params
                    });
                };

                scope.isSalesAuditDisable = function (row, type, status) {
                    var xStatus = scope.rfaType(type);
                    var xStatusType = xStatus.type;
                    if (xStatusType !== undefined && status === 'completed' && (clickableItem.indexOf(xStatusType) > 0)) {
                        return "audit-disable";
                    } else {
                        return "audit-enable";
                    }
                }

                scope.rfaType = function (string) {
                    if (string) {
                        var x = string.split("_");
                        return {
                            'type': x[0],
                            'status': x[1]
                        }
                    } else {
                        return {};
                    }
                }

                scope.getStatusData = function () {
                    myStatusService.getStatus().then(function (res) {
                        myStatusService.mystatus.getDesk1Index = res.data[0].initials.charAt(0);
                        myStatusService.mystatus.getDesk1Name = res.data[0].label;
                        myStatusService.mystatus.getDesk2Index = res.data[1].initials.charAt(0);
                        myStatusService.mystatus.getDesk2Name = res.data[1].label;

                        if (!myStatusService.mystatus.getDesk1Index) {
                            myStatusService.mystatus.getDesk1Index = 'L'
                        }
                        if (!myStatusService.mystatus.getDesk1Name) {
                            myStatusService.mystatus.getDesk1Name = 'Legal'
                        }
                        if (!myStatusService.mystatus.getDesk2Index) {
                            myStatusService.mystatus.getDesk2Index = 'M'
                        }
                        if (!myStatusService.mystatus.getDesk2Name) {
                            myStatusService.mystatus.getDesk2Name = 'Manager'
                        }
                        scope.mystatus = myStatusService.mystatus;
                    }).catch(function () {
                        myStatusService.mystatus.getDesk1Index = "L";
                        myStatusService.mystatus.getDesk1Name = "Legal";
                        myStatusService.mystatus.getDesk2Index = "M"
                        myStatusService.mystatus.getDesk2Name = "Manager"
                        scope.mystatus = myStatusService.mystatus;
                    })
                }
                scope.getStatusData();
            }
        };
    }

    function screenerCtrl($scope, ScreenerService, modalsService, AmendmentLetter, rfaGridSelection, CredentialsService) {
        var vm = this;

        angular.extend(vm, {
            updateReviewState: updateReviewState,
            toggleAll: toggleAll,
            toogleRow: toogleRow,
            toogleLegalEntityRow: toogleLegalEntityRow,
            toogleAllLegalEntity: toogleAllLegalEntity,
            toogleManagerEntityRow: toogleManagerEntityRow,
            toogleAllManagerEntity: toogleAllManagerEntity,
            allSelected: rfaGridSelection.isAllSelectedState(),
            updateSalesAuditChanged: updateSalesAuditChanged,
            updateSalesAuditClicked: updateSalesAuditClicked,
            controlSalesAuditDisabled: controlSalesAuditDisabled,
            updateToggleSalesAuditClicked: updateToggleSalesAuditClicked,
            partyBChecked: partyBChecked,
        });

        function updateReviewState(type, request) {
            var state = $scope.reviews[request.id][type + 'State'],
                body = {
                    state: state,
                    request: request,
                    reviewId: $scope.reviews[request.id][type]
                },
                stype = type === 'onboarding' ? 'onBoarding' : type,
                methodName = 'set' + (type[0].toUpperCase() + type.substring(1)) + 'Review';

            //set Review to state silently
            if (state) {
                AmendmentLetter[methodName](body).then(function (data) {
                    var res = data.headers('Location').match(/\/([^\/]+)Reviews\/([^\/]+)/);
                    AmendmentLetter.getReviewInfo(stype, request.id, res[2]).then(function (data) {
                        var dt = data.data;
                        $scope.reviews[request.id][type + 'User'] = dt[type].updateBy;
                        $scope.reviews[request.id][type] = dt[type][stype + '_review_id'];
                    });
                });
                //reset Review with confirmation
            } else {
                var modalConfirmInstance = modalsService.open({
                    'template': 'modal/ConfirmCleanReview',
                    'controller': 'default',
                    'class': 'modal-rfa'
                });
                modalConfirmInstance.result.then(function () {
                    AmendmentLetter[methodName](body);
                }, function () { //reject
                    $scope.reviews[request.id][type + 'State'] = true;
                });
            }
        }

        function toggleAll() {
            rfaGridSelection.toggleAll($scope.data.table.data);
        }

        function toogleRow(row) {
            rfaGridSelection.toggleRow($scope.data.table.data, row);
        }


        $scope.$watch(rfaGridSelection.isAllSelectedState, function () {
            vm.allSelected = rfaGridSelection.isAllSelectedState();
        });

        function partyBChecked(request, item, index) {
            item.selected = !item.selected
            checkedRfaLeval(request, index)
        }

        function checkedRfaLeval(request, index) {
            var selectedItem = [];
            if (request.partyBEntities.length) {
                angular.forEach(request.partyBEntities, function (item) {
                    if (item.selected) {
                        selectedItem.push(item.id);
                    }
                });
                if (selectedItem.length === request.partyBEntities.length) {
                    request.selected = true;
                } else {
                    request.selected = false;
                }
            }
        }

        // legal Control on checkBox..
        function toogleLegalEntityRow(event, row, index, selected) {
            var isUserAllow = CredentialsService.hasPermission('bs.rfa.desk1');
            if (!isUserAllow) return event.preventDefault();

            row.deskStatus.deskOneStatus = !row.deskStatus.deskOneStatus;
            var xFlag = row.deskStatus.deskOneStatus;
            var unCheckBoxlegal = (xFlag === true || xFlag === 1) ? true : false;
            if (unCheckBoxlegal) {
                rfaGridSelection.toogleLegalEntityRow($scope.data.table.data, row, index, selected);
            } else {
                var option = {
                    grid: $scope.data.table.data,
                    row: row,
                    index: index,
                    selected: selected,
                    tab: 'legal'
                }
                ScreenerService.call({
                    name: 'bsuncheckedbox',
                    params: option
                });
            }
        }

        function toogleAllLegalEntity(index) {
            rfaGridSelection.toogleAllLegalEntity($scope.data.table.data, index, false);
        }

        // Manager Control on checkBox..
        function toogleManagerEntityRow(event, row, index, selected) {
            var isUserAllow = CredentialsService.hasPermission('bs.rfa.desk2');
            if (!isUserAllow) return event.preventDefault();

            row.deskStatus.deskTwoStatus = !row.deskStatus.deskTwoStatus;
            var xFlag = row.deskStatus.deskTwoStatus;
            var checkBoxManager = (xFlag === true || xFlag === 1) ? true : false;
            if (checkBoxManager) {
                rfaGridSelection.toogleManagerEntityRow($scope.data.table.data, row, index, selected);
            } else {
                var option = {
                    grid: $scope.data.table.data,
                    row: row,
                    index: index,
                    selected: selected,
                    tab: 'manager'
                }
                ScreenerService.call({
                    name: 'bsuncheckedbox',
                    params: option
                });
            }
        }

        function toogleAllManagerEntity(index) {
            rfaGridSelection.toogleAllManagerEntity($scope.data.table.data, index, false);
        }

        function updateSalesAuditChanged(event, row, index, type, subtype) {
            // event.preventDefault();
            // return rfaGridSelection.updateSalesAuditChanged(event,$scope.data.table.data,row,index,type,subtype);
        }

        function updateSalesAuditClicked(event, row, index, type, requestStatus) {
            var typeRequest = rfaGridSelection.onRequestType(type);
            var xtype = typeRequest.type;
            var xSubtype = typeRequest.status;

            // Check User Role is allow to Audit
            var userRole = CredentialsService.auditUser(xtype);
            var isUserAllow = CredentialsService.hasPermission(userRole);

            // Check in Case CheckBox is  Disable..
            var isSalesAuditDisable = rfaGridSelection.isSalesAuditdisabled(row, xtype, requestStatus);

            // Check in Case User is not allow to Clickable
            var isSalesAuditClickable = rfaGridSelection.isSalesAuditClickable(row, xtype, requestStatus);

            var indexValue = xtype + "_" + xSubtype;

            if (!isUserAllow) {
                event.preventDefault();
            } else {
                var checked = row[indexValue] ? true : false;
                if (checked) {
                    rfaGridSelection.updateSalesAuditClicked($scope.data.table.data, row, index, xtype, xSubtype, requestStatus);
                } else {
                    var option = {
                        grid: $scope.data.table.data,
                        row: row,
                        index: index,
                        xtype: xtype,
                        xSubtype: xSubtype,
                        requestStatus: requestStatus
                    }
                    ScreenerService.call({
                        name: 'uncheckedbox',
                        params: option
                    });
                }
            }
        }

        function updateToggleSalesAuditClicked(event, grid, index, type, requestStatus) {
            var typeRequest = rfaGridSelection.onRequestType(type);
            var xtype = typeRequest.type;
            var xSubtype = typeRequest.status;

            // Check User Role is allow to Audit
            var userRole = CredentialsService.auditUser(xtype);
            var isUserAllow = CredentialsService.hasPermission(userRole);

            // Check in Case CheckBox is  Disable..
            var isSalesAuditDisable = rfaGridSelection.isSalesAuditdisabled(grid, xtype, requestStatus);

            // Check in Case User is not allow to Clickable
            var isSalesAuditClickable = rfaGridSelection.isSalesAuditClickable(grid, xtype, requestStatus);

            var indexValue = xtype + "_" + xSubtype;

            if (!isUserAllow) {
                event.preventDefault();
            } else {
                var multiChecked = grid.dataList[index]["partyBEntities"][indexValue] ? true : false;
                if (multiChecked) {
                    rfaGridSelection.updateToggleSalesAuditClicked($scope.data.table.data, index, xtype, xSubtype, requestStatus);
                } else {
                    var option = {
                        grid: $scope.data.table.data,
                        index: index,
                        xtype: xtype,
                        xSubtype: xSubtype,
                        requestStatus: requestStatus
                    }
                    ScreenerService.call({
                        name: 'multiuncheckedbox',
                        params: option
                    });
                }
            }
        }

        function controlSalesAuditDisabled(event, row, index, type, subtype) {
            return false;
        }
    }
})();