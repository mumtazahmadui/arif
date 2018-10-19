(function () {
    angular
        .module('app.bulk.upload-files')
        .controller('uploadFileModalController', uploadFileModalController);

    function uploadFileModalController($scope, BulkUploadService, FileUploadFactory, modalsService) {
        var vm = this;

        angular.extend(vm, {
            init: init,
            upload: upload,
            checkFile: checkFile
        });

        vm.templateTypes = [];
        vm.init();

        function init() {
            BulkUploadService.getUploadFileName().$promise.then(function(response) {
                vm.templateTypes = response.data;
                vm.loaded = true;
            })
        }

        function checkFile(file) {
            var extension = file.name.split('.').pop();
            if (extension === 'xlsx') {
                vm.invalidField= false;
            } else {
                vm.invalidField =  true;
            }
        }

        function upload() {
            vm.uploading = true;
            var url = 'amendmentLetters/actions/uploadbulkRFAFile';
            FileUploadFactory.fileUpload(vm.file, url, {
                templateId : vm.name.id
            }, 'json').then(function(response) {
                vm.uploading = false;
                $scope.$close();

                if (response.status === 201) {
                    modalsService.openWarningPopup({
                        body: 'Bulk upload has been initiated. Please note the Request ID - ' +
                        response.data.bulkRFAUploadId + '. You will be notified via email when the processing completes.',
                        title: 'File uploaded successfully',
                        successBtn: 'Ok',
                        hideCancelBtn: true
                    });
                }
            });
        }
    }
})();