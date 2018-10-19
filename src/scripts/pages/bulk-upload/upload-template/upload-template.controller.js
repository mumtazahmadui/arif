(function () {
    'use strict';

    angular.module('app.bulk.upload')
        .controller('uploadTemplateController', uploadTemplateController);

    function uploadTemplateController(
        $scope,
        $window,
        ScreenerService,
        BulkUploadService,
        $state,
        appConfig,
        modalsService
    ) {

        var vm = this;
        vm.update = update;
        vm.buttonAction = buttonAction;
        vm.filterSearch = filterSearch;
        vm.screenerUpdate = screenerUpdate;
        vm.downloadXCLTemplate = downloadXCLTemplate,
        vm.editUploadedTemplate = editUploadedTemplate,
        vm.deleteUploadedTemplate = deleteUploadedTemplate,
        vm.appConfig = appConfig;

        $scope.$on('$destroy', function () {
            vm.isDestroy = true;
        });
        $scope.$on('screenerUpdate', vm.screenerUpdate);

        $scope.$on('buttonAction', vm.buttonAction);

        $scope.$on('screenerCall', function (event, data) {
            if (vm[data.name] !== undefined) {
                vm[data.name](data.params);
            }
        });
        
        activate();

        function activate() {
            vm.data = ScreenerService.get('UploadTemplate');
            vm.data.loading = true;
        }

        function screenerUpdate(event, server) {
            vm.data = ScreenerService.get();
            if (server && vm.data.id === "UploadTemplate") {
                vm.update();
            }
        }

        function buttonAction(data) {
            $state.go('rfa.bulk-upload-create')

        }
        
        function filterSearch(params) {
            BulkUploadService.filterSearch({filterString: params.query})
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

        function update() {
            var dataToSend = prepareData();
            vm.data.loading = true;
            BulkUploadService.getRows(dataToSend)
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

        function prepareData() {
            return {
                'sortBy': vm.data.table.sortBy.toLowerCase(),
                'sortOrder': vm.data.table.desc,
                'userId': vm.data.credentials.userId,
                'pageSize': vm.data.pages.items_per_page,
                'offSet': vm.data.pages.page,
                'companyId': vm.data.credentials.companyId,
                'uploadTemplateName': vm.data.filters[0].value || []
            }
        }

        function downloadXCLTemplate(fileId) {
            $window.open(vm.appConfig.api_host + 'upload_template/' + fileId + '/export');
        }

        function editUploadedTemplate(row) {
            $state.go('rfa.bulk-upload-create', { templateId: row.id });
        }

        function deleteUploadedTemplate(id) {
            modalsService.openWarningPopup({
                body: 'Selected upload template will be deleted.',
                title: 'Confirm action'
            }).result.then(function () {
                BulkUploadService.deleteTemplate({ templateId: id }).$promise
                    .then(function() {
                        vm.update();
                    });
            }, angular.noop);
        }

    }
})();