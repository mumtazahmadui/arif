(function () {
    angular
        .module('rfa.masterlist.template')
        .controller('masterlistTemplateLibraryController', masterlistTemplateLibraryController);

    function masterlistTemplateLibraryController($scope, ScreenerService, rfaApiMasterlist, appConfig, CredentialsService, $window, modalsService) {

        var vm = this;
        vm.update = update;
        vm.filterSearch = filterSearch;
        vm.exportTemplate = exportTemplate;
        vm.remove = remove;

        activate();

        function activate() {
            vm.data = ScreenerService.get('MasterlistTemplate');
            vm.data.loading = true;
        }

        $scope.$on('$destroy', function() {
            vm.isDestroy = true;
        });

        function update() {
            vm.data.loading = true;
            rfaApiMasterlist.getRowsTemplates({
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
            rfaApiMasterlist.filterTemplateSearch({filterString: params.query, filterName: params.filterName})
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

        $scope.$on('screenerUpdate', function (event, server) {
            vm.data = ScreenerService.get();
            if (server && vm.data.id === "MasterlistTemplate") {
                vm.update();
            }
        });

        $scope.$on('screenerCall', function (event, data) {
            if (vm[data.name] !== undefined) {
                vm[data.name](data.params);
            }
        });

        function exportTemplate(params) {
            $window.open(appConfig.api_host + 'masterlist_template/' + params.mlTemplateId + '/export');
        }

        function remove(params) {
            modalsService.openWarningPopup({
                title: 'Delete ' + params.mlTemplateName,
                body: 'Selected Masterlist Template will be deleted. Please confirm'
            }).result.then(function () {
                rfaApiMasterlist.deleteTemplate({templateId: params.mlTemplateId}).$promise.then(function () {
                    update();
                }, function () {
                });
            }, function () {
            });
        }
    }
})();