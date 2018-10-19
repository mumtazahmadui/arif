(function () {
    angular.module('app.services')
        .factory('rfaGridSelection', function (CredentialsService,auditService,auditLegalManger) {
            var isAllSelectedState,
                isAllSelectedStateText;
            var isAllInnerSelectedState = {}
            var partyItemB = ['operations','tax','manager'];
            var clickableItem = ['onboarding','kyc','credit','legal'];

            updateSelectedStatus();

            return {
                toggleAll: toggleAll,
                toggleRow: toggleRow,
                updateStatus: updateSelectedStatus,
                toogleLegalEntityRow:toogleLegalEntityRow,
                toogleAllLegalEntity:toogleAllLegalEntity,
                toogleManagerEntityRow:toogleManagerEntityRow,
                toogleAllManagerEntity:toogleAllManagerEntity,
                updateSalesAuditChanged:updateSalesAuditChanged,
                updateSalesAuditClicked:updateSalesAuditClicked,
                isSalesAuditdisabled:isSalesAuditdisabled,
                isSalesAuditClickable:isSalesAuditClickable,
                onRequestType:onRequestType,
                updateToggleSalesAuditClicked:updateToggleSalesAuditClicked,
                deskCode:deskCode,
                isAllSelectedState: function () {
                    return isAllSelectedState;
                },
                isAllSelectedStateText: function () {
                    return isAllSelectedStateText;
                },
                isInnerAllSelected: function(index) {
                    return isAllInnerSelectedState[index];
                },
                exculdedDisable: function() {
                    return exculdedDisable;
                }
            };

            function onRequestType(string) {
                if(string) {
                    var x = string.split("_");
                    return {
                        'type' : x[0],
                        'status' : x[1]
                    }
                } else {
                    return {};
                }
            }

            function filterDeskCode(string) {
                if(string) {
                    var x = string.split("_");
                    if (x[0] !== 'operations') {
                        var x1 = x[0].charAt(0).toUpperCase();
                    } else if (x[0] == 'operations') {
                        var x1 = 'OP'
                    }
                    var x2 = x[1].charAt(0).toUpperCase();
                    x2 = x2 == "I" ? "P" : x2;
                    return x1 + '-' + x2
                } else {
                    return '';
                }
            }

            function deskCode (string) {
                return filterDeskCode(string);
            }


            function toggleAll(grid) {
                if (isAllSelected(grid)) {
                    grid.dataList.forEach(function (row) {
                        row.selected = false;
                        angular.forEach(row.partyBEntities, function (item) {
                            item.selected = false;
                        })
                    });
                } else {
                    grid.dataList.forEach(function (row) {
                        row.selected = true;
                        angular.forEach(row.partyBEntities, function (item) {
                            item.selected = true;
                        })
                    });
                }
                updateSelectedStatus(grid);
            }

            function toggleRow(grid, row) {
                row.selected = !row.selected;
                updateSelectedStatus(grid);
                updateInnerRow(row,row.selected);
            }

            function updateInnerRow(row,value) {
                if (value === true) {
                    angular.forEach(row.partyBEntities, function (item) {
                        item.selected = true;
                    });
                }
                if (value === false) {
                    angular.forEach(row.partyBEntities, function (item) {
                        item.selected = false;
                    });
                }
            }

            function updateSelectedStatus(grid) {
                isAllSelectedState = isAllSelected(grid);
                isAllSelectedStateText = isAllSelectedState ? "Deselect All" : "Select All";
            }

            function isAllSelected(grid) {
                var countSelected = 0;
                if (!grid || !grid.dataList) {
                    return false;
                } else {
                    angular.forEach(grid.dataList, function (row) {
                        if (row.selected) countSelected++;
                    });
                    return grid.dataList.length === countSelected;
                }
            }

            // Legal Entities Management...
            function toogleAllLegalEntity(grid,index,isFromModel) {
                var flag,entityGrid;
                grid.dataList[index].amendmentDeskOneStatus = !grid.dataList[index].amendmentDeskOneStatus;
                entityGrid = grid.dataList[index]["partyBEntities"];
                flag = grid.dataList[index].amendmentDeskOneStatus ? 1 : 0;
                if (!entityGrid.length) return
                if (isFromModel) {
                    emtityFromModel(grid,index,entityGrid,flag)
                } else {
                    var stated = isLegalInnerSelected(grid,index);
                    if (stated) {
                        angular.forEach(entityGrid, function(row) {
                            row.legalSelected =  false;
                        });
                        grid.dataList[index]["partyBEntities"].legalSelected = false
                    } else {
                        angular.forEach(entityGrid, function(row) {
                            row.legalSelected =  true;
                        });
                        grid.dataList[index]["partyBEntities"].legalSelected = true
                    }
                }
            }

            function emtityFromModel(grid,index,entityGrid,flag) {
                if (flag > 0) {
                    auditLegalManger.multiClickLegal(grid,entityGrid,index,true);
                    angular.forEach(entityGrid, function (row) {
                        row.deskStatus.deskOneStatus = 1;
                    });
                } else {
                    auditLegalManger.multiClickLegal(grid,entityGrid,index,false);
                    angular.forEach(entityGrid, function(row) {
                        row.deskStatus.deskOneStatus =  0;
                    });
                }
            }

            function isLegalInnerSelected (grid,index) {
                var count = 0;
                var obj = grid.dataList[index]["partyBEntities"];
                angular.forEach(obj, function(row) {
                    if(row.deskStatus.deskOneStatus) count++;
                });
                return obj.length === count;
            }

            function toogleLegalEntityRow(grid,row,index,selected) {
                var flag;
                // row.deskStatus.deskOneStatus = !row.deskStatus.deskOneStatus
                if (selected === 'legal') {
                    flag = row.deskStatus.deskOneStatus;
                    auditLegalManger.clickLegal(grid,row,index,flag)
                    updateLegalToggleStatus(grid,index)
                }
            }

            function updateLegalToggleStatus(grid,index) {
                var state = isLegalInnerSelected(grid,index);
                if(state) {
                    isAllInnerSelectedState[index] = true
                    grid.dataList[index]["partyBEntities"].legalSelected = true
                    grid.dataList[index]['amendmentDeskOneStatus'] = 1;
                } else {
                    isAllInnerSelectedState[index] = false
                    grid.dataList[index]["partyBEntities"].legalSelected = false;
                    grid.dataList[index]['amendmentDeskOneStatus'] = 0;
                }
            }

            // Manager Entities Management...
            function toogleAllManagerEntity(grid,index,isFromModel) {
                var flag,entityGrid;
                grid.dataList[index].amendmentDeskTwoStatus = !grid.dataList[index].amendmentDeskTwoStatus;
                entityGrid = grid.dataList[index]["partyBEntities"];
                flag = grid.dataList[index].amendmentDeskTwoStatus ? 1 : 0;

                if (!entityGrid.length) return
                if (isFromModel) {
                    ManagerEntityFromModel(grid,index,entityGrid,flag)
                } else {
                    var stated = isManagerInnerSelected(grid,index);
                    if (stated) {
                        angular.forEach(entityGrid, function(row) {
                            row.managerSelected =  false;
                        });
                        grid.dataList[index]["partyBEntities"].managerSelected = false
                    } else {
                        angular.forEach(entityGrid, function(row) {
                            row.managerSelected =  true;
                        });
                        grid.dataList[index]["partyBEntities"].managerSelected = true
                    }
                }
            }

            function ManagerEntityFromModel(grid,index,entityGrid,flag) {
                if (flag > 0) {
                    auditLegalManger.multiClickManager(grid,entityGrid,index,true);
                    angular.forEach(entityGrid, function (row) {
                        row.deskStatus.deskTwoStatus = 1;
                    });
                } else {
                    auditLegalManger.multiClickManager(grid,entityGrid,index,false);
                    angular.forEach(entityGrid, function(row) {
                        row.deskStatus.deskTwoStatus =  0;
                    });
                }
            }

            function isManagerInnerSelected (grid,index) {
                var count = 0;
                var obj = grid.dataList[index]["partyBEntities"];
                angular.forEach(obj, function(row) {
                    if(row.deskStatus.deskTwoStatus) count++;
                });
                return obj.length === count;
            }

            function toogleManagerEntityRow(grid,row,index,selected) {
                var flag;
                // row.deskStatus.deskTwoStatus = !row.deskStatus.deskTwoStatus;
                if (selected === 'manager') {
                    flag = row.deskStatus.deskTwoStatus;
                    auditLegalManger.clickManger(grid,row,index,flag);
                    updateManagerToggleStatus(grid,index);
                }
            }

            function updateManagerToggleStatus(grid,index) {
                var state = isManagerInnerSelected(grid,index);
                if(state) {
                    grid.dataList[index]["partyBEntities"].managerSelected = true
                    grid.dataList[index]['amendmentDeskTwoStatus'] = 1;
                } else {
                    grid.dataList[index]["partyBEntities"].managerSelected = false
                    grid.dataList[index]['amendmentDeskTwoStatus'] = 0;
                }
            }

            // Manager and Legal End..

            function updateSalesAuditChanged(grid,row,index,type,subtype) {
                console.log("updateSalesAuditChanged ",row)
            }

            function updateSalesAuditClicked(grid,row,index,type,subtype,requestType) {
                var filedTyped = type+"_"+subtype;
                updateGridHeader(grid,index,filedTyped);
                auditService.click(grid,row,index,type,subtype,filedTyped);
            }

            function updateGridHeader(grid,index,filedTyped) {
                var state = isInnerSelected(grid,index,filedTyped);
                if(state) {
                    grid.dataList[index]["partyBEntities"][filedTyped] = true
                } else {
                    grid.dataList[index]["partyBEntities"][filedTyped] = false
                }
            }

            // Audit
            function isSalesAuditdisabled (row,type,status) {
                if (type !== undefined && status === 'completed' && (clickableItem.indexOf(type) > 0)) {
                    return true;
                } else {
                    return false;
                }
             }

             function isSalesAuditClickable (row,type,status) {
                if (status !== 'completed' && (clickableItem.indexOf(type) > -1)) {
                    return true;
                } else if (status === 'completed' && (partyItemB.indexOf(type) > -1)) {
                    return true;
                } else {
                    return false;
                }
             }

             // Multiple Checked/Unchecked
             function updateToggleSalesAuditClicked (grid,index,type,subtype,requestType) {

                var filedTyped = type +"_"+ subtype;
                var entityGrid = grid.dataList[index]["partyBEntities"];
                if (!entityGrid.length) return
                var stated = isInnerSelected(grid,index,filedTyped);
                auditService.multiClick(grid,entityGrid,index,type,subtype,filedTyped)
                if (stated) {
                    angular.forEach(entityGrid, function(row) {
                        row[filedTyped] =  false;
                    });
                    grid.dataList[index]["partyBEntities"][filedTyped] = false
                } else {
                    angular.forEach(entityGrid, function(row) {
                        row[filedTyped] =  true;
                    });
                    grid.dataList[index]["partyBEntities"][filedTyped] = true
                }

             }

             function isInnerSelected (grid,index,filedTyped) {
                var count = 0;
                var obj = grid.dataList[index]["partyBEntities"];
                angular.forEach(obj, function(row) {
                    if(row[filedTyped]) count++;
                });
                return obj.length === count;
            }

        });
})();