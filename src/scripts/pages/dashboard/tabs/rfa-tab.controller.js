(function() {
    // @ngInject
    angular.module('app.controllers')
        .controller('RFATabController', rfaTabController);

    function rfaTabController(
        $scope, AmendmentLetter, toastr, ScreenerService, modalsService, $window, documentsService, $location,
        RejectRFAButton, partyABCreator, DoughnutService

    ) {
        /* jshint validthis: true */
        var vm = this;
        vm.update = update;
        vm.getRequests = getRequests;
        vm.recallConfirmation = recallConfirmation;
        vm.rfaHistory = rfaHistory;
        vm.filterSearch = filterSearch;
        vm.withdrawn = withdrawn;
        vm.editAmendment = editAmendment;
        vm.editRFA = editRFA;
        vm.editLinkedExhibit = editLinkedExhibit;
        vm.linkExhibit = linkExhibit;
        vm.eSign = eSign;
        vm.open = open;
        vm.download = download;
        vm.gridFilterParam=ScreenerService.getGridSearchQuery();
        vm.data = ScreenerService.get('RFA');
        vm.data.loading = true;
        vm.rejectRFAReasonPopup = _.bind(RejectRFAButton.run, null, vm.data);
        vm.sendRFA = sendRFA;
        vm.legalStatus = legalStatus;
        vm.managerStatus = managerStatus;
        vm.bsuncheckedbox = bsuncheckedbox;
        vm.deleterfa=deleterfa;

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
            AmendmentLetter.sendRFA(data).then(function() {
                ScreenerService.set(vm.data, true);
                DoughnutService.update();
            }, function() {
                vm.data.loading = false;
                DoughnutService.update();
            });
        }

        function getRequests(data) {
            modalsService.open({
                template: "dashboard/tabs/modal/PartyBRequested",
                controller: "PartyBRequested",
                type: data.type,
                id: data.id,
                class: 'modal-rfa',
                backdrop: 'static'
            });
        }

        function rfaHistory(data) {
            modalsService.open({
                template: 'dashboard/modal/rfa-history/rfa-history',
                controller: 'RFAHistory',
                id: data.id,
                size: 'lg',
                class: 'modal-rfa',
                backdrop: 'static'
            });
        }

        function legalStatus(data) {
            modalsService.open({
                template: 'dashboard/modal/status/legal',
                controller: 'Legal',
                data: data,
                size: 'md',
                class: 'modal-rfa',
                backdrop: 'static'
            });
        }

        function managerStatus(data) {
            modalsService.open({
                template: 'dashboard/modal/status/manager',
                controller: 'Manager',
                data: data,
                size: 'md',
                class: 'modal-rfa',
                backdrop: 'static'
            });
        }

        function bsuncheckedbox(data) {
            modalsService.open({
                template: 'dashboard/modal/uncheckedbox/bsuncheckedbox',
                controller: 'Bsuncheckedbox',
                data: data,
                size: 'md',
                class: 'modal-uncheckedbox',
                backdrop: 'static'
            });
        }

        //region success and error
        var modalHandler = function(method, data) {
            AmendmentLetter[method](data).success(function() {
                ScreenerService.set(vm.data, true);
                vm.data.loading = false;
            }).error(function() {
                vm.data.loading = false;
            });
        };
        //endregion

        function withdrawn(data) {
            var modalConfirmInstance = modalsService.open({
                template: 'dashboard/modal/withdrawn/withdrawn',
                controller: 'Withdrawn',
                id: data.id,
                data: data.data,
                class: 'modal-rfa',
                backdrop: 'static'
            });
            modalConfirmInstance.result.then(function(data) {
                vm.data.loading = true;
                modalHandler('withdrawn', {
                    id: data.id,
                    data: data.selected
                });
            });
        }

        function recallConfirmation(data) {
            var modalConfirmInstance = modalsService.open({
                template: 'dashboard/modal/confirm-recall/confirm-recall',
                controller: 'ConfirmRecall',
                id: data.id,
                name: data.name,
                class: 'modal-rfa',
                backdrop: 'static'
            });
            modalConfirmInstance.result.then(function(data) {
                modalHandler('recall', {
                    data: data.id
                });
            });
        }

        function editAmendment(data) {
            $location.url('/rfa/company/amendmentDraft/' + data.id);
        }

        function editRFA(data){


            AmendmentLetter.editRFA({id: data.id}).then(function(){
                editAmendment(data);
            });
        }

        function editLinkedExhibit(data) {
            $location.url('/rfa/company/exhibitsLinked/' + data.id + '/' + data.exhibitId);
        }

        function eSign(data) {
            $location.url('/rfa/company/esign-bs/' + data.id + '/' + data.fileId);
        }

        function linkExhibit(data) {
            partyABCreator.openModal({flow: 'linkExhibit',
                RFAID: data.id});
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
            if (!angular.equals(vm.gridFilterParam, {}) && vm.gridFilterParam.action == 'gridSearch'&&ScreenerService.gridUrlFilterFlag) {
                vm.data.showhideGrid=false;
                AmendmentLetter.gridSearch(vm.gridFilterParam.filterId).
                    success(function (data) {
                        updateDashboardFilter(data);
                        searchDashboard();
                        vm.data.showhideGrid=true;
                        ScreenerService.gridUrlFilterFlag=false;
                    }).error(function () {
                        vm.data.loading = false;
                        vm.data.showhideGrid=true;
                    });
            } else {
                searchDashboard();
            }
        }
        function updateDashboardFilter(queryData) {
            var agreementDate = queryData['agreementDate'];
            if (agreementDate) vm.data.filters[0].value = agreementDate;
            var masterlistIdentifier = queryData['masterlistIdentifier'];
            if (masterlistIdentifier) vm.data.filters[1].value = masterlistIdentifier;
            var partyA = queryData['partyA'];
            if (partyA) vm.data.filters[2].value = partyA;
            var partyBAccount = queryData['partyBAccount'];
            if (partyBAccount){
            	vm.data.filters[3].value = partyBAccount;
                ScreenerService.expandAccordion = true;
            }
            var partyBClientIdentifier = queryData['partyBClientIdentifier'];
            if (partyBClientIdentifier) vm.data.filters[4].value = partyBClientIdentifier;
            var actionOnPartyB = queryData['partyBLei'];
            if (actionOnPartyB) vm.data.filters[5].value = partyBLei;
            var actionOnPartyB = queryData['actionOnPartyB'];
            if (actionOnPartyB) vm.data.filters[6].value = actionOnPartyB;
            var requestStatus = queryData['requestStatus'];
            if (requestStatus) vm.data.filters[7].value = requestStatus;
            var rfaIds = queryData['rfaId'];
            if (rfaIds) vm.data.filters[8].value = rfaIds;
            var agreementType = queryData['agreementType'];
            if (agreementType) vm.data.filters[9].value = agreementType;
            var submitDate = queryData['submitDate'];
            if (submitDate) vm.data.filters[10].value = submitDate;
            vm.data.showhideGrid=true;
        }

        function searchDashboard(){
            AmendmentLetter.search({
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
                vm.data.loading = false;
            });
        }

        function filterSearch(params) {
            AmendmentLetter.filterSearch({
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
        function deleterfa(data) {
            modalsService.open({
                template: 'dashboard/modal/rfa-delete/rfa-delete',
                controller: 'RFADelete',
                id: data.id,
                size: 'lg',
                class: 'modal-rfa',
                backdrop: 'static'
            });
        }

        $scope.$on('updatedTabs',function() {
            var tabs = ScreenerService.onCompletedTabs;
            if (tabs) {
                if (vm.data.filters[7] &&
                    vm.data.filters[7].value && vm.data.filters[7].value.indexOf('Completed') === -1) {
                    vm.data.filters[7].value.push("Completed")
                }
            } else  {
                if (vm.data.filters[7] && vm.data.filters[7].value) {
                    var pos = vm.data.filters[7].value.indexOf('Completed')
                    if (pos !== -1) {
                        vm.data.filters[7].value.splice(pos, 1);
                    }
                }
            }
            vm.update();
        })

        $scope.$on('screenerUpdate', function(event, server) {
            if (server && vm.data.id === "RFA") {
                var x = vm.data.filters[7] &&
                vm.data.filters[7].value &&
                vm.data.filters[7].value.indexOf('Completed') !== -1 ? true : false;

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

    }

})();