(function() {
    // @ngInject
    angular.module('app.controllers')
        .controller('SSRFATabController', ssRFATabController);

    function ssRFATabController(
        $scope, SSAmendmentLetter, toastr, ScreenerService, modalsService, $location, $window, documentsService,
        RejectRFAButton, AmendmentLetter, DoughnutService
    ) {
        /* jshint validthis: true */
        var vm = this;
        vm.update = update;
        vm.rfaHistory = rfaHistory;
        vm.filterSearch = filterSearch;
        vm.eSign = eSign;
        vm.editResponse = editResponse;
        vm.open = open;
        vm.download = download;
        vm.data = ScreenerService.get('SSRFA');
        vm.data.loading = true;
        vm.rejectRFAReasonPopup = rejectRFAReasonPopup;
        vm.sendRFA = sendRFA;
        vm.escalation = escalation;
        vm.uncheckedbox = uncheckedbox;
        vm.multiuncheckedbox = multiuncheckedbox,
        vm.gridFilterParam=ScreenerService.getGridSearchQuery();

        vm.isDestroy = false;

        $scope.$on('$destroy', function() {
            vm.isDestroy = true;
        });
        $scope.$on('bulkActionStarted', function() {
            vm.data.loading = true;
        });
        $scope.$on('bulkActionFinished', function() {
            vm.data.loading = false;
        });

        function sendRFA(data) {
            vm.data.loading = true;
            AmendmentLetter.sendRFA(data)
            .then(function() {
                ScreenerService.set(vm.data, true);
                DoughnutService.update();
            }, function() {
                vm.data.loading = false;
                DoughnutService.update();
            });
        }

        function rejectRFAReasonPopup(data) {
            RejectRFAButton.run(vm.data, data)
            .then(function() {
                vm.data.loading = true;
            }, function() {
                vm.data.loading = false;
            });
        }

        function eSign(data) {
            $location.url('/rfa/company/esign-ss/' + data.id + '/' + data.fileId);
        }

        function editResponse(data) {
            $location.url('/rfa/company/amendmentReview/' + data.id + '/' + data.exhibitId);
        }

        function rfaHistory(data){
            var modalConfirmInstance = modalsService.open({
                template: "dashboard/modal/rfa-history/rfa-history",
                controller: "RFAHistory",
                id: data.id,
                class: 'modal-rfa',
                size: 'lg',
                backdrop: 'static'
            });
            modalConfirmInstance.result.then(function() {
            }, function() {});
        }

        function escalation(data) {
            modalsService.open({
                template: 'dashboard/modal/escalation/escalation',
                controller: 'Escalation',
                data: data,
                size: 'lg',
                class: 'modal-escalation',
                backdrop: 'static'
            });
        }

        function uncheckedbox(data) {
            modalsService.open({
                template: 'dashboard/modal/uncheckedbox/uncheckedbox',
                controller: 'Uncheckedbox',
                data: data,
                size: 'lg',
                class: 'modal-uncheckedbox',
                backdrop: 'static'
            });
        }

        function multiuncheckedbox(data) {
            modalsService.open({
                template: 'dashboard/modal/uncheckedbox/multiuncheckedbox',
                controller: 'Multiuncheckedbox',
                data: data,
                size: 'lg',
                class: 'modal-uncheckedbox',
                backdrop: 'static'
            });
        }

        function open(data) {
            $window.open(documentsService.openFile({
                fileId: data.fileId,
                id: data.id
            }));
        }

        function download(data) {
            $window.open(documentsService.downloadFile({
                fileId: data.fileId
            }));
        }
        
        function update() {
            vm.data.loading = true;
            if(!angular.equals(vm.gridFilterParam, {})&&vm.gridFilterParam.action=='gridSearch'&&ScreenerService.gridUrlFilterFlag){
                vm.data.showhideGrid=false;          
                AmendmentLetter.gridSearch(vm.gridFilterParam.filterId).
                success(function(data) {
                    updateDashboardFilter(data)
                    searchDashboard();
                    vm.data.showhideGrid=true; 
                    ScreenerService.gridUrlFilterFlag=false;
                }).error(function() {
                    vm.data.loading = false;
                    vm.data.showhideGrid=true;   
                });
            }else{
                searchDashboard();
            }
        }

        function updateDashboardFilter(queryData) {
            var agreementDate = queryData['agreementDate'];
            if (agreementDate) vm.data.filters[0].value = agreementDate;
            var investmentManager = queryData['investmentManager'];
            if (investmentManager) vm.data.filters[1].value = investmentManager;
            var partyB = queryData['partyBAccount'];
            if (partyB){
            	vm.data.filters[2].value = partyB;
                ScreenerService.expandAccordion = true; 
            }            
            var partyBClient = queryData['partyBClient'];
            if (partyBClient) vm.data.filters[3].value = partyBClient;
            var partyBLei = queryData['partyBLei'];
            if (partyBLei) vm.data.filters[4].value = partyBLei;
            var myStatus = queryData['myStatus'];
            if (myStatus) vm.data.filters[5].value = myStatus;            
            var rfaIds = queryData['rfaId'];
            if (rfaIds) vm.data.filters[6].value = rfaIds;            
            var masterlistIdentifier = queryData['masterlistIdentifier'];
            if (masterlistIdentifier) vm.data.filters[7].value = masterlistIdentifier;            
            var agreementType = queryData['agreementType'];
            if (agreementType) vm.data.filters[8].value = agreementType;            
            var actionOnPartyB = queryData['actionOnPartyB'];
            if (actionOnPartyB) vm.data.filters[9].value = actionOnPartyB;            
            var requestStatus = queryData['requestStatus'];
            if (requestStatus) vm.data.filters[10].value = requestStatus;  
            vm.data.showhideGrid=true;            
        }

        function searchDashboard() {
            SSAmendmentLetter.search({
                items_per_page: vm.data.pages.items_per_page,
                page: vm.data.pages.page,
                sortBy: vm.data.table.sortBy.toLowerCase(),
                desc: vm.data.table.desc,
                data: vm.data
            }).success(function(data) {
                if (vm.isDestroy) {
                    return;
                }
                vm.data.table.data = data;
                vm.data.loading = false;
                ScreenerService.set(vm.data, false);
            }).error(function() {
            });
        }

        function filterSearch(params) {
            SSAmendmentLetter.filterSearch({
                filterString: params.query,
                filterName: params.filterName
            }).success(function(data) {
                angular.forEach(vm.data.filters, function(value) {
                    if (value.id === params.filterName) {
                        value.data = data.data;
                        value.loading = false;
                        ScreenerService.set(vm.data, false);
                    }
                });
            });
        }

        $scope.$on('updatedTabs',function() {
            var tabs = ScreenerService.onCompletedTabs;
            if (tabs) {
                if (vm.data.filters[10] &&
                    vm.data.filters[10].value && vm.data.filters[10].value.indexOf('Completed') === -1) {
                    vm.data.filters[10].value.push("Completed")
                }
            } else  {
                if (vm.data.filters[10] && vm.data.filters[10].value) {
                    var pos = vm.data.filters[10].value.indexOf('Completed')
                    if (pos !== -1) {
                        vm.data.filters[10].value.splice(pos, 1);
                    }
                }
            }
            vm.update();
        })

        $scope.$on('screenerUpdate', function(event, server) {
            if (server && vm.data.id === "SSRFA") {
                var x = vm.data.filters[10] &&
                vm.data.filters[10].value &&
                vm.data.filters[10].value.indexOf('Completed') !== -1 ? true : false;

                if (x && !vm.data.onCompletedTabs) {
                    vm.data.onCompletedTabs = true;
                    $scope.$broadcast('handleClosed');
                    $scope.$emit("activatedTabs",1);
                } else if (!x && vm.data.onCompletedTabs) {
                    vm.data.onCompletedTabs = false;
                    $scope.$broadcast('handleClosed');
                    $scope.$emit("activatedTabs",0);
                } else {
                    vm.data = ScreenerService.get();
                    vm.update();
                }
            }
        });

        $scope.$on('screenerCall', function(event, data) {
            if (vm[data.name] !== undefined) {
                vm[data.name](data.params);
            }
        });

        $scope.$on('bulkNotifications',function(){
            var modalConfirmInstance = modalsService.open({
                template: "dashboard/modal/bulkNotifications",
                controller: "bulkNotifications",
                class: 'partyAB',
                backdrop: 'static',
                controllerAs:"bn"
            });
            modalConfirmInstance.result.then(function() {
            }, function() {});
        });
    }

})();