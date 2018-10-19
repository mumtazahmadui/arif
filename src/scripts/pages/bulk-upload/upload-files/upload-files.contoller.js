(function () {
    'use strict';
    angular.module('app.bulk.upload')
        .controller('uploadFilesController', uploadFilesController);

    function uploadFilesController($scope, ScreenerService, BulkUploadService, modalsService, $window, appConfig) {

        var vm = this;
        vm.update = update;
        vm.buttonAction = buttonAction;
        vm.filterSearch = filterSearch;
        vm.screenerUpdate = screenerUpdate;
        vm.deleteUploadedFile = deleteUploadedFile;
        vm.downloadXCLFile = downloadXCLFile;
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
            vm.data = ScreenerService.get('UploadedFiles');
            vm.data.loading = true;
            vm.data.processingStatus = processingStatus;
        }

        function screenerUpdate(event, server) {
            vm.data = ScreenerService.get();
            if (server && vm.data.id === "UploadedFiles") {
                vm.update();
            }
        }

        function buttonAction(data) {
            modalsService.open({
                template: 'bulk-upload/upload-files/modal/upload-file/upload-file',
                controller: 'uploadFile',
                controllerAs: 'vm',
                class: 'modal-mst-title',
                backdrop: 'static'
            }).result.then(function() {
                vm.update();
            });
        }

        function processingStatus(type) {
            switch (type) {
                case 'Error':
                    return 'red';
                    break;
                case 'Completed':
                    return 'green';
                    break;
                case 'In Progress':
                    return '#0C5D91';
                    break;
                default:
                    break;
            }
        }
        function filterSearch(params) {
            if (params.filterName === 'processing_status') {
                BulkUploadService.filterSearchProcessingStatus({ filterString: params.query })
                    .$promise.then(function (data) {
                        angular.forEach(vm.data.filters, function (value) {
                            if (value.id === params.filterName) {
                                value.data = data.data;
                                value.loading = false;
                                ScreenerService.set(vm.data, false);
                            }
                        });
                    });
            } else if (params.filterName === 'uploaded_by') {
                BulkUploadService.filterSearchUploadedBy({ filterString: params.query })
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
        }
        function update() {
            vm.data.loading = true;
            BulkUploadService.getUploadedFilesRows({
                'sortBy': vm.data.table.sortBy.toLowerCase(),
                'sortOrder': vm.data.table.desc,
                'userId': vm.data.credentials.userId,
                'pageSize': vm.data.pages.items_per_page,
                'offSet': vm.data.pages.page,
                'companyId': vm.data.credentials.companyId,
                'processingStatus': vm.data.filters[0].value || [],
                'uploadBy': vm.data.filters[1].value || []

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

        function deleteUploadedFile(id) {
            modalsService.openWarningPopup({
                body: 'Selected error file will be deleted.',
                title: 'Confirm action'
            }).result.then(function () {
                BulkUploadService.deleteFile({ companyId: vm.data.credentials.companyId, fileId: id }).$promise
                    .then(function() {
                        vm.update();
                    });
            }, angular.noop);
        }

        function downloadXCLFile(fileId) {
            var companyId = vm.data.credentials.companyId;
            $window.open(vm.appConfig.api_host + 'company/' + companyId + '/files/download_file/' + fileId);
        }
    }
})();