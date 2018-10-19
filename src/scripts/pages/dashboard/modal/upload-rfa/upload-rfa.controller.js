(function () {
    angular
        .module('rfa.dashboard')
        .controller('UploadRFAModalController', UploadRFAModalController);

    function UploadRFAModalController($scope, UploadRFAFactory, modalsService, data, CredentialsService,$location) {
        var vm = this;
        vm.unWantedfile = false

        angular.extend(vm, {
            init: init,
            upload: upload,
            checkFile: checkFile,

            isUploadEnabled: isUploadEnabled,
            isAdmin: isAdmin,
            filesToAccept: ['pdf', 'jpg', 'jpeg', 'tiff'],
            errorMsgBE: false
        });
        vm.init();

        function init() {
            vm.uploading = false;
        }

        function checkFile(file) {
            vm.errorMsgBE = false;
            vm.unWantedfile = false;
            var extension = file.name.split('.').pop().toLowerCase();
            if (vm.filesToAccept.indexOf(extension) > -1) {
                vm.invalidField= false;
            } else {
                vm.invalidField =  true;
            }
        }

        function isUploadEnabled() {
            return (!vm.uploading && vm.file && vm.file.name && !vm.invalidField)
        }

        function upload(overwrite) {
            vm.uploading = true;
            vm.invalidField = false;
            vm.errorMsgBE = false;
            vm.unWantedfile = false;
            var url = 'company/' + CredentialsService.companyId() + '/amendment_letter/' + data.data.selectedRows[0].id +'/wsign';
            UploadRFAFactory.fileUpload(vm.file, url, {
                overwrite : overwrite.toString()
            }, 'json').then(function(response) {
                vm.uploading = false;
                if (response.status === 200  && response.data && response.data.data && (response.data.data.errorCode === "400" || response.data.data.errorCode === 400)) {
                    vm.unWantedfile = true;
                    return;
                } else if (response.status === 200  && response.data && response.data.data && response.data.data.message) {
                    vm.errorMsgBE = response.data.data.message;
                    return response;
                }else{
                    $location.url('/rfa/company/amendmentLetter');
                }
                $scope.$close();
            });
        }

        function isAdmin() {
            //TBI
            //console.log(CredentialsService, CredentialsService.hasPermission('RFA Admin'))
            return CredentialsService.hasPermission('bs.rfa.admin') || CredentialsService.hasPermission('ss.rfa.admin');
        }
    }
})();