(function () {
    angular
        .module('rfa.masterlist.library')
        .controller('masterlistLibraryController', masterlistLibraryController);

    function masterlistLibraryController(appConfig,
                                         $scope,
                                         ScreenerService,
                                         CredentialsService,
                                         $window,
                                         documentsService,
                                         rfaApiMasterlist,
                                         modalsService) {
        var vm = this;
        vm.update = update;
        vm.filterSearch = filterSearch;
        vm.exportXCL = exportXCL;
        vm.exportPartyBMap = exportPartyBMap;
        vm.open = open;
        vm.removeMasterlist = removeMasterlist;
        vm.editAgreementType = editAgreementType;

        activate();

        function activate() {
            vm.data = ScreenerService.get('Masterlist');
            vm.data.loading = true;
        }

        $scope.$on('$destroy', function() {
            vm.isDestroy = true;
        });
        $scope.$on('screenerUpdate', function (event, server) {
            vm.data = ScreenerService.get();
            if (server && vm.data.id === "Masterlist") {
                vm.update();
            }
        });

        $scope.$on('screenerCall', function (event, data) {
            if (vm[data.name] !== undefined) {
                vm[data.name](data.params);
            }
        });
        function update() {
            vm.data.loading = true;
            rfaApiMasterlist.getRows({
                'items_per_page': vm.data.pages.items_per_page,
                'page': vm.data.pages.page,
                'sortBy': vm.data.table.sortBy.toLowerCase(),
                'desc': vm.data.table.desc,
                'data': vm.data
            })
                .$promise.then(function (data) {
                if (vm.isDestroy) {
                    return;
                }
                vm.data.table.data = data;
                vm.data.loading = false;
                ScreenerService.set(vm.data, false);
            }, function () {
            });
        }

        function filterSearch(params) {
            rfaApiMasterlist.filterSearch({filterString: params.query, filterName: params.filterName})
                .$promise.then(function (data) {
                angular.forEach(vm.data.filters, function (value) {
                    if (value.id === params.filterName) {
                        value.data = data.data;
                        value.loading = false;
                        ScreenerService.set(vm.data, false);
                    }
                });
            });
        }

        function exportXCL(params) {
            $window.open(appConfig.api_host + 'company/' + CredentialsService.companyId() + '/master_list/' + params.fileId + '/export');
        }

        function exportPartyBMap(params) {
            $window.open(appConfig.api_host + 'company/' + CredentialsService.companyId() + '/master_list/' + params.fileId + '/mcpm_partyb_mapping/export');
        }

        function open(data) {
            $window.open(documentsService.openFile({fileId: data.fileId}));
        }

        function removeMasterlist(params) {
            modalsService.openRemovePopup({
                id: params.id,
                name: params.name
            }).result.then(function () {
                rfaApiMasterlist.deleteMasterlist({id: params.id}).$promise.then(function () {
                    update();
                }, function () {
                });
            }, function () {
            });
        }

        function editAgreementType(data) {
            modalsService.open({
                template: 'masterlist/masterlist-library/modal/edit-agreement-type/editAgreementType.template',
                controller: 'editAgreement',
                controllerAs: 'editAgrmntType',
                class: 'modal-rfa',
                id: data.id,
                agreementType: data.agreementType
            }).result.then(function () {
                update();
            });
        }

       
    }
})();